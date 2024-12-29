import { PartialAPIChatInputApplicationCommandInteraction } from "../../@types/discord-custom";

export const getDiscordUserId = (
  interaction: PartialAPIChatInputApplicationCommandInteraction
) => {
  const discordUserId = interaction?.member?.user?.id;
  if (!discordUserId) {
    throw new Error("Failed to get Discord user ID");
  }

  return discordUserId;
};
