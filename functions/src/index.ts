import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

import { onRequest } from "firebase-functions/v2/https";
import { InteractionType } from "discord-interactions";
import { verifyRequest } from "./utils/request-processing";

import { handleCommand } from "./commands";
import { onSchedule } from "firebase-functions/scheduler";
import { updateOnlineLeaderboard } from "./lib/leaderboard/update-online-leaderboard";

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
      handleCommand(request);
    }
  }
);

export const scheduledFunctions = onSchedule("every 5 minutes", async () => {
  await updateOnlineLeaderboard();
});
