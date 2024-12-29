import type { AppCommand } from "../@types/discord-custom";
import {
  DE_REGISTER,
  DE_REGISTER_SUBCOMMANDS
} from "../constants/command-list";
import { APIApplicationCommandInteractionDataSubcommandOption } from "@discordjs/core";
import { getFirestore } from "firebase-admin/firestore";
import { validateCredentials, validateGame } from "../lib/helpers/validator";
import { getDiscordUserId } from "../lib/helpers/getters";
// TODO: @ path resolution is not working when build completes

export default {
  ...DE_REGISTER,
  callback: async ({ interaction }) => {
    validateCredentials(interaction);
    const discordUserId = getDiscordUserId(interaction);

    const subcommand = interaction.data?.options?.[0]
      .name as DE_REGISTER_SUBCOMMANDS;
    const subcommandData = (
      interaction.data
        ?.options?.[0] as unknown as APIApplicationCommandInteractionDataSubcommandOption
    ).options;
    if (!subcommand) {
      throw new Error("Invalid command");
    }

    if (!Object.values(DE_REGISTER_SUBCOMMANDS).includes(subcommand)) {
      throw new Error("Invalid command");
    }

    const db = getFirestore();

    const userCollection = db.collection("users");

    /* ------------------------------- DELETE USER ------------------------------ */
    const userDoc = await userCollection.doc(`${discordUserId}`).get();

    if (!userDoc.exists) {
      throw new Error("You have not registered any profiles");
    }

    if (subcommand === DE_REGISTER_SUBCOMMANDS.user) {
      await userCollection.doc(`${discordUserId}`).delete();
      return {
        content: "Your profile has been removed"
      };
    }

    /* -------------------------------- DELETE ID ------------------------------- */

    const game = subcommandData?.[0].value as string;
    validateGame(game);

    const id = subcommandData?.[1].value as string;
    // TODO: Implement a regex for ID validation
    if (!id) {
      throw new Error("Please provide a valid ID");
    }

    const existingIds = (userDoc.exists ? userDoc.data()?.[game] : {}) ?? {};

    if (id in existingIds) {
      delete existingIds[id];
      await userCollection.doc(`${discordUserId}`).update({
        [game]: existingIds
      });

      return {
        content: `ID ${id} has been removed from your profile`
      };
    } else {
      throw new Error(`ID ${id} not found in your profile for ${game}`);
    }
  }
} satisfies AppCommand;
