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

export enum DE_REGISTER_SUBCOMMANDS {
  user = "user",
  id = "id"
}

export const DE_REGISTER = {
  name: "deregister",
  description: "Remove profile from our database",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: DE_REGISTER_SUBCOMMANDS.user,
      description: "Deregister your entire profile",
      type: ApplicationCommandOptionType.Subcommand
    },
    {
      name: DE_REGISTER_SUBCOMMANDS.id,
      description: "Deregister a game ID from your profile",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "game",
          type: ApplicationCommandOptionType.String,
          description: "Select the game you want to deregister for",
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
    }
  ]
} satisfies PartialAPIApplicationCommand;

export const HELP = {
  name: "help",
  description: "Provides usage guides and help for the bot",
  type: ApplicationCommandType.ChatInput,
  options: [
    // {
    //   name: "type",
    //   type: ApplicationCommandOptionType.Subcommand,
    //   description: "Show help for a specific command",
    //   required: true
    // },
    {
      name: "game",
      type: ApplicationCommandOptionType.String,
      description: "Select the game you want help with",
      choices: [
        { name: "Age Of Empires 4", value: GAMES.AOE4 },
        { name: "Dota 2", value: GAMES.DOTA2 }
      ],
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
