import { readdir } from "fs/promises";
import type { AppCommand } from "../utils/types";

/**
 * Load all commands from the commands directory
 * @return {Promise<Record<string, AppCommand>>} A map of command names to commands
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
