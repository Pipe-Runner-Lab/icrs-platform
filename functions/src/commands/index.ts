import { readdir } from "fs/promises";
import type { AppCommand } from "../utils/types";

export async function loadCommands() {
    const commandsMap: Record<string, AppCommand> = {};
    const files = await readdir(__dirname);
    for(const file of files){
        if (file.endsWith(".map")) continue;
        if (file.startsWith("index")) continue;
        const module = await import(`./${file}`);
        const command = module.default;
        commandsMap[command.name] = command;
    }
    return commandsMap;
}
