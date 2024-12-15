import { onRequest } from "firebase-functions/v2/https";
import type { Request } from "firebase-functions/v2/https";
import type { Response } from "firebase-functions/lib/v1/cloud-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  verifyKey,
  InteractionType,
  InteractionResponseType
} from "discord-interactions";
import { REST } from "@discordjs/rest";
import { API } from "@discordjs/core";

import { loadCommands } from "./commands/index";
import type { AppCommand } from "./utils/types";

initializeApp();

const db = getFirestore();

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
const api = new API(rest);
let commandsMap: Record<string, AppCommand> = {};
loadCommands().then((commands) => {
  commandsMap = commands;
});

/**
 * Verify the request signature
 * @param {Request} request The request object
 * @param {Response} response The response object
 * @return {Promise<boolean>} True if the request is valid, false otherwise
 */
async function verifyRequest(
  request: Request,
  response: Response
): Promise<boolean> {
  const signature = request.headers["x-signature-ed25519"] as
    | string
    | undefined;
  const timestamp = request.headers["x-signature-timestamp"] as
    | string
    | undefined;
  const publicKey = process.env.DISCORD_PUBLIC_KEY;
  const isValidRequest =
    signature &&
    timestamp &&
    publicKey &&
    (await verifyKey(request.rawBody, signature, timestamp, publicKey));
  if (!isValidRequest) {
    response.status(401).send("Invalid request signature");
    return false;
  }
  return true;
}

/**
 * Handle the command
 * @param {Request} request The request object
 * @param {Response} response The response object
 */
async function handleCommand(request: Request, response: Response) {
  const command = commandsMap[request.body.data.name];
  const responseData = await command.callback({
    interaction: request.body,
    db: db,
    api: api
  });
  if (!responseData) {
    return;
  }
  response.json({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: responseData
  });
}

export const interactions = onRequest(async (request, response) => {
  const isValid = await verifyRequest(request, response);
  if (!isValid) {
    return;
  }
  if (request.body.type == InteractionType.PING) {
    response.json({ type: InteractionType.PING });
    return;
  }
  if (request.body.type == InteractionType.APPLICATION_COMMAND) {
    handleCommand(request, response);
  }
});
