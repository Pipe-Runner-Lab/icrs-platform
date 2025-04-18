import { REST } from "@discordjs/rest";
import { API, MessageFlags } from "@discordjs/core";
import type { Request } from "firebase-functions/v2/https";
import type { AppCommand } from "@/@types/discord-custom";
import { readdir } from "fs/promises";
import { logger } from "firebase-functions/v2";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rest = new REST({ version: "10" }).setToken(
  process.env.DISCORD_BOT_TOKEN!
);
const api = new API(rest);
let commandsMap: Record<string, AppCommand> = {};
loadCommands().then((commands) => {
  commandsMap = commands;
});

/**
 * Handle the command
 * @param {Request} request The request object
 * @param {Response} response The response object
 */
export async function handleCommand(request: Request) {
  const command = commandsMap[request.body.data.name];
  await api.interactions.defer(request.body.id, request.body.token);
  try {
    const responseData = await command.callback({
      interaction: request.body,
      api: api
    });
    if (!responseData) {
      throw new Error("Something went wrong");
    }
    await api.interactions.followUp(
      request.body.application_id,
      request.body.token,
      responseData
    );
  } catch (error) {
    logger.error(error);
    logger.info(JSON.stringify(request.body));
    await api.interactions.followUp(
      request.body.application_id,
      request.body.token,
      {
        content:
          (
            error as {
              message: string;
            }
          ).message +
          `\n\nIf you think this is a bug, please take a screenshot and report this in the <#${process.env.DEVELOPERS_CHANNEL_ID}> channel`
      }
    );
  }
}

/**
 * Load all commands from the commands directory
 * @return {Promise<Record<string, AppCommand>>} A map of command names to commands
 * Note: The check for `.map` files is to prevent loading the map file generated by TypeScript (post compilation)
 */
export async function loadCommands() {
  const commandsMap: Record<string, AppCommand> = {};
  const files = await readdir(__dirname);
  for (const file of files) {
    if (file.endsWith(".map")) continue;
    if (file.startsWith("index")) continue;
    const module = await import(`./${file}`);
    const command = module.default;
    commandsMap[command.name] = command;
  }
  return commandsMap;
}
