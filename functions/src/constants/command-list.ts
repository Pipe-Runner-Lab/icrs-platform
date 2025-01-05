import { PartialAPIApplicationCommand } from "@/@types/discord-custom";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  APIApplicationCommandOption,
  APIApplicationCommandBasicOption
} from "@discordjs/core";
import { GAMES } from "./games";

// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-type

const gameChoiceCommandComponent: APIApplicationCommandOption = {
  name: "game",
  type: ApplicationCommandOptionType.String,
  description: "Select the game you want to register for",
  choices: [
    { name: "Age Of Empires 4", value: GAMES.AOE4 },
    { name: "Dota 2", value: GAMES.DOTA2 }
  ],
  required: true
};

const idCommandComponent: APIApplicationCommandOption = {
  name: "id",
  type: ApplicationCommandOptionType.String,
  description: "Profile ID (Check /help if you are unsure)",
  required: true
};

const mentionCommandComponent = (
  name: "winner" | "loser"
): APIApplicationCommandBasicOption => ({
  name,
  type: ApplicationCommandOptionType.User,
  description: `Mention the ${name} of the match`,
  required: true
});

export const REGISTER = {
  name: "register",
  description: "Add profile to our database",
  type: ApplicationCommandType.ChatInput,
  options: [gameChoiceCommandComponent, idCommandComponent]
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
      options: [gameChoiceCommandComponent, idCommandComponent]
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
      name: "online",
      description: "Show Online leaderboard",
      options: [gameChoiceCommandComponent]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "in-house",
      description: "Show In House leaderboard",
      options: [gameChoiceCommandComponent]
    },
    {
      type: ApplicationCommandOptionType.Subcommand,
      name: "update-in-house",
      description: "Update In House leaderboard",
      options: [
        gameChoiceCommandComponent,
        mentionCommandComponent("winner"),
        mentionCommandComponent("loser")
      ]
    }
  ]
} satisfies PartialAPIApplicationCommand;
