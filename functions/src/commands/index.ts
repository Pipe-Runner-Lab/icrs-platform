import { REST } from "@discordjs/rest";
import { API } from "@discordjs/core";
import type { Request } from "firebase-functions/v2/https";
import type { Response } from "firebase-functions/lib/v1/cloud-functions";
import { getFirestore } from "firebase-admin/firestore";
import { InteractionResponseType } from "discord-interactions";
import type { AppCommand } from "@/@types/discord-custom";
import { readdir } from "fs/promises";
import { GAMES } from "../constants/games";
import * as aoe4world from "../utils/aoe4world";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);
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
export async function handleCommand(request: Request, response: Response) {
  try {
    const command = commandsMap[request.body.data.name];
    const responseData = await command.callback({
      interaction: request.body,
      api: api
    });
    if (!responseData) {
      return;
    }
    response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: responseData
    });
  } catch (error) {
    response.json({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: (
          error as {
            message: string;
          }
        ).message
      }
    });
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

/**
 * Scheduled callback to update user data
 * This function is called every 5 minutes
 * @return {Promise<void>}
 */
export async function scheduledCallback() {
  const db = getFirestore();
  const users = (await db.collection("users").get()).docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  })) as any[];

  const allProfileIds = users.reduce((acc, user) => {
    for (const profileId of Object.keys(user[GAMES.AOE4])) {
      acc.push(profileId);
    }
    return acc;
  }, []) as string[];

  const leaderboard = await aoe4world.getSoloLeaderboard(
    allProfileIds.map(Number)
  );
  for (const user of users) {
    const profileData = {} as Awaited<
      ReturnType<typeof aoe4world.getSoloLeaderboard>
    >;
    for (const profileId of Object.keys(user[GAMES.AOE4])) {
      const profile = leaderboard[profileId];
      if (!profile) continue;
      profileData[profileId] = profile;
    }
    await db
      .collection("users")
      .doc(user.id)
      .set(
        {
          [GAMES.AOE4]: profileData
        },
        { merge: true }
      );
  }
}

// was unable to run scheduledCallback locally, so just a local development workaround
// setInterval(scheduledCallback, 60000);
