import type { AppCommand } from "../utils/types";
import {
  DE_REGISTER,
  DE_REGISTER_SUBCOMMANDS
} from "../constants/command-list";
import { doesGuildMatch } from "../utils/request-processing";
import { GAMES } from "../constants/games";
import { APIApplicationCommandInteractionDataSubcommandOption } from "@discordjs/core";
// TODO: @ path resolution is not working when build completes

export default {
  ...DE_REGISTER,
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

    const subcommand = interaction.data?.options?.[0]
      .name as DE_REGISTER_SUBCOMMANDS;
    const subcommandData = (
      interaction.data
        ?.options?.[0] as unknown as APIApplicationCommandInteractionDataSubcommandOption
    ).options;
    if (!subcommand) {
      return {
        content: "Invalid subcommand"
      };
    }

    if (!Object.values(DE_REGISTER_SUBCOMMANDS).includes(subcommand)) {
      return {
        content: "Invalid subcommand"
      };
    }

    const userCollection = db.collection("users");
    if ((await userCollection.get()).size === 0) {
      return {
        content: "You have not registered any profiles"
      };
    }

    /* ------------------------------- DELETE USER ------------------------------ */
    const userDoc = await userCollection.doc(`${discordUserId}`).get();

    if (!userDoc.exists) {
      return {
        content: "You have not registered any profile in our database"
      };
    }

    if (subcommand === DE_REGISTER_SUBCOMMANDS.user) {
      await userCollection.doc(`${discordUserId}`).delete();
      return {
        content: "Your profile has been removed"
      };
    }

    /* -------------------------------- DELETE ID ------------------------------- */

    const game = subcommandData?.[0].value as string;
    if (!game || !Object.values(GAMES).includes(game as GAMES)) {
      return {
        content: "Please select a game we support"
      };
    }

    const id = subcommandData?.[1].value as string;
    // TODO: Implement a regex for ID validation
    if (!id) {
      return {
        content: "Please provide a valid ID"
      };
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
      return {
        content: `ID ${id} not found in your profile for ${game}`
      };
    }
  }
} satisfies AppCommand;
