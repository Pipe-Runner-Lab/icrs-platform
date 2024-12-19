import { PartialAPIApplicationCommand } from "@/utils/types";
import { ApplicationCommandType } from "@discordjs/core";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { GAMES } from "./games";

// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type

export const REGISTER = {
  name: "register",
  description: "Add profile to our database",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "game",
      type: ApplicationCommandOptionType.String,
      description: "Select the game you want to register for",
      choices: [
        { name: "Age Of Empires 4", value: GAMES.AOE4 },
        { name: "Dota 2", value: GAMES.DOTA2 }
      ],
      required: true
    },
    {
      name: "id",
      type: ApplicationCommandOptionType.String,
      description: "Profile ID (Check /help if you are unsure)",
      required: true
    }
  ]
} satisfies PartialAPIApplicationCommand;

export const LEADERBOARD = {
  name: "leaderboard",
  description: "Display our server leaderboard",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "global",
      description: "Global leaderboard"
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "online",
      description: "Guild leaderboard"
    }
  ]
} satisfies PartialAPIApplicationCommand;
