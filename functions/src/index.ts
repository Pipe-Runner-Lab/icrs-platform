import { initializeApp } from "firebase-admin/app";

initializeApp();

import { onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/scheduler";
import { InteractionType } from "discord-interactions";
import { verifyRequest } from "./utils/request-processing";

import { handleCommand, scheduledCallback } from "./commands";

export const interactions = onRequest(
  {
    minInstances: 1
  },
  async (request, response) => {
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
  }
);

export const scheduledFunction = onSchedule(
  "every 5 minutes",
  scheduledCallback
);
