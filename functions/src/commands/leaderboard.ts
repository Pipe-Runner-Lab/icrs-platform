import type { AppCommand } from "../@types/discord-custom";
import { LEADERBOARD } from "../constants/command-list";
import { updateInHouseLeaderboard } from "../lib/leaderboard/update-in-house-leaderboard";
import { showInHouseLeaderboard } from "../lib/leaderboard/show-in-house-leaderboard";
import { validateCredentials } from "../lib/helpers/validator";
import { showOnlineLeaderboard } from "../lib/leaderboard/show-online-leaderboard";

export default {
  ...LEADERBOARD,
  callback: async ({ interaction }) => {
    const subcommand = interaction?.data?.options?.[0]?.name;
    if (subcommand === "in-house") {
      validateCredentials(interaction);
      return showInHouseLeaderboard(interaction.data);
    }

    if (subcommand === "update-in-house") {
      validateCredentials(interaction, {
        adminLock: true
      });
      return updateInHouseLeaderboard(interaction.data);
    }

    if (subcommand === "online") {
      validateCredentials(interaction);
      return showOnlineLeaderboard(interaction.data);
    }

    throw new Error("Invalid subcommand");
  }
} satisfies AppCommand;
