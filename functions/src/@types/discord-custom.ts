import type {
  APIApplicationCommand,
  APIInteractionResponseCallbackData,
  APIChatInputApplicationCommandInteraction,
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataBasicOption,
  API
} from "@discordjs/core";

export type PartialAPIApplicationCommand = Omit<
  APIApplicationCommand,
  "id" | "application_id" | "version" | "default_member_permissions" | "type"
> & { type?: number };

export type PartialAPIApplicationCommandInteractionData = Omit<
  APIChatInputApplicationCommandInteractionData,
  "options"
> & {
  options?: APIApplicationCommandInteractionDataBasicOption[];
};

export type PartialAPIChatInputApplicationCommandInteraction = Omit<
  APIChatInputApplicationCommandInteraction,
  "data"
> & {
  data: PartialAPIApplicationCommandInteractionData;
};

export type AppCommand = PartialAPIApplicationCommand & {
  callback: ({
    interaction,
    api
  }: {
    interaction: PartialAPIChatInputApplicationCommandInteraction;
    api: API;
  }) => Promise<APIInteractionResponseCallbackData | void>;
};
