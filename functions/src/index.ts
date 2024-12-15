import { onRequest } from "firebase-functions/v2/https";
import { initializeApp } from "firebase-admin/app";
import { InteractionType } from "discord-interactions";
import { verifyRequest } from "./utils/request-processing";
import { handleCommand } from "./commands";

initializeApp();

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
