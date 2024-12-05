import { onRequest } from "firebase-functions/v2/https";
import type { Request } from "firebase-functions/v2/https";
import type { Response } from "firebase-functions/lib/v1/cloud-functions";
import { App, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions";

import * as commands from "./commands";
import type { AppCommand } from "./utils/types";

initializeApp();

const db = getFirestore();
const commandsMap = Object.values(commands).reduce((acc, command) => {
  acc[command.name] = command;
  return acc;
}, {} as Record<string, AppCommand>);


async function verifyRequest(request: Request, response: Response) {
  const signature = request.headers["x-signature-ed25519"] as string|undefined;
  const timestamp = request.headers["x-signature-timestamp"] as string|undefined;
  const public_key = process.env.DISCORD_PUBLIC_KEY;
  const isValidRequest = signature 
    && timestamp 
    && public_key
    && await verifyKey(request.rawBody, signature, timestamp, public_key);
  if (!isValidRequest){
    response.status(401).send("Invalid request signature");
    return false;
  }
  return true;
}

async function handleCommand(request: Request, response: Response) {
  const command = commandsMap[request.body.data.name];
  const responseData = await command.callback({
    interaction: request.body,
    db: db
  });
  if (!responseData){
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
    response.json({type: InteractionType.PING});
    return;
  }
  if (request.body.type == InteractionType.APPLICATION_COMMAND) {
    handleCommand(request, response);
    return;
  }
});

