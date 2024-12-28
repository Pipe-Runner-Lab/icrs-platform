import type { AppCommand } from "../utils/types";
import * as aoe4world from "../utils/aoe4world";
import { REGISTER } from "../constants/command-list";
import { doesGuildMatch } from "../utils/request-processing";
import { GAMES } from "../constants/games";
// TODO: @ path resolution is not working when build completes

// https://interactions-zhgogk6p4a-uc.a.run.app

const MAX_IDS = 5;

export default {
  ...REGISTER,
  callback: async ({ interaction, db }) => {
    if (!interaction.guild_id || !doesGuildMatch(interaction.guild_id)) {
      return {
        content: "This command is only available in the ICRS Discord server"
      };
    }

    const discordUserId = interaction?.member?.user?.id;
    if (!discordUserId) {
      return {
        content: "Could not find your user ID"
      };
    }

    const game = interaction.data?.options?.[0].value as string;
    if (!game || !Object.values(GAMES).includes(game as GAMES)) {
      return {
        content: "Please select a game we support"
      };
    }

    const id = interaction.data?.options?.[1].value as string;
    if (!id) {
      return {
        content: "Please provide a valid ID"
      };
    }

    let existingIds = {};
    const userCollection = db.collection("users");
    if ((await userCollection.get()).size !== 0) {
      const userDoc = await userCollection.doc(`${discordUserId}`).get();
      existingIds = userDoc.exists ? userDoc.data()?.[game] : {};
      if (Object.keys(existingIds).length >= MAX_IDS) {
        return {
          content: "You have reached the maximum number of IDs for this game"
        };
      }
    }

    let player = null;
    if (game === GAMES.AOE4) {
      player = await aoe4world.searchPlayer(id);
    }

    if (!player) {
      return {
        content: "Could not find player with the provided ID"
      };
    }
    const playerRating = (await aoe4world.getSoloLeaderboard([player.profile_id]))[player.profile_id];
    if (!playerRating) {
      return {
        content: "Could not find rating for the player"
      };
    }

    await db
      .collection("users")
      .doc(discordUserId)
      .set(
        {
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
