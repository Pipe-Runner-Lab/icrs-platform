import { GAMES } from "../../constants/games";
import { doesGuildMatch } from "../../utils/request-processing";
import { PartialAPIChatInputApplicationCommandInteraction } from "../../@types/discord-custom";

export const validateCredentials = (
  interaction: PartialAPIChatInputApplicationCommandInteraction,
  options: {
    adminLock?: boolean;
  } = {
    adminLock: false
  }
) => {
  if (
    // TODO: Node env not working
    // process.env.NODE_ENV === "production" &&
    interaction.channel.id !== process.env.LEADERBOARD_CHANNEL_ID
  ) {
    throw new Error(
      "This command is only available in the leaderboard channel"
    );
  }

  if (!interaction.guild_id || !doesGuildMatch(interaction.guild_id)) {
    throw new Error(
      "This command is only available in the ICRS Discord server"
    );
  }

  if (
    process.env.BOT_MANAGER_ROLE_ID &&
    options.adminLock &&
    !interaction?.member?.roles?.includes(process.env.BOT_MANAGER_ROLE_ID)
  ) {
    throw new Error(
      `You do not have permission to run this command. Please contact a <@&${process.env.BOT_MANAGER_ROLE_ID}>.`
    );
  }
};

export const validateGame = (game: string) => {
  if (!game || !Object.values(GAMES).includes(game as GAMES)) {
    throw new Error("Please select a game we support");
  }
};
