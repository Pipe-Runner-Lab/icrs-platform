import type { AppCommand } from "../@types/discord-custom";
import * as aoe4world from "../utils/aoe4world";
import { REGISTER } from "../constants/command-list";
import { GAMES } from "../constants/games";
import { validateCredentials, validateGame } from "../lib/helpers/validator";
import { getDiscordUserId } from "../lib/helpers/getters";
import { getFirestore } from "firebase-admin/firestore";
// TODO: @ path resolution is not working when build completes

// https://interactions-zhgogk6p4a-uc.a.run.app

const MAX_IDS = 5;

export default {
  ...REGISTER,
  callback: async ({ interaction }) => {
    validateCredentials(interaction);
    const discordUserId = getDiscordUserId(interaction);

    const game = interaction.data?.options?.[0].value as string;
    validateGame(game);

    const id = interaction.data?.options?.[1].value as string;
    if (!id) {
      throw new Error("Please provide a valid ID");
    }

    const db = getFirestore();

    let existingIds = {};
    const userCollection = db.collection("users");
    const userDoc = await userCollection.doc(`${discordUserId}`).get();
    existingIds = userDoc.exists ? userDoc.data()?.[game] : {};
    if (Object.keys(existingIds).length >= MAX_IDS) {
      throw new Error(
        `You have already registered ${MAX_IDS} profiles. Please deregister one before registering a new one.`
      );
    }

    let player = null;
    if (game === GAMES.AOE4) {
      player = await aoe4world.searchPlayer(id);
    }

    if (!player) {
      throw new Error(`Could not find a player with the given ID : ${id}`);
    }
    const playerRating = (
      await aoe4world.getSoloLeaderboard([player.profile_id])
    )[player.profile_id];
    if (!playerRating) {
      throw new Error(
        `Could not find the rating for the player with the given ID : ${id}`
      );
    }

    await db
      .collection("users")
      .doc(discordUserId)
      .set(
        {
          profile: {
            username: interaction?.member?.user.username,
            displayName: interaction?.member?.user.global_name,
            nickName: interaction?.member?.nick
          },
          [game]: {
            ...existingIds,
            [player.profile_id]: playerRating
          }
        },
        {
          merge: true
        }
      );
    return {
      content: `We found your ID ${player.profile_id} under the name of ${player.name}. We have registered it for you.`
    };
  }
} satisfies AppCommand;
