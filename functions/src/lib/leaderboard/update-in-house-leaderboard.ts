import {
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteractionData
} from "@discordjs/core";
import { getFirestore } from "firebase-admin/firestore";
import { validateGame } from "../helpers/validator";
import { generateAoe4InHouseLeaderboard } from "./utils";
import { GAME_NAMES } from "../../constants/games";

export const updateInHouseLeaderboard = async (
  interactionData: APIChatInputApplicationCommandInteractionData
): Promise<{
  content: string;
}> => {
  const db = getFirestore();

  const game = (
    interactionData
      .options?.[0] as APIApplicationCommandInteractionDataSubcommandOption
  ).options?.[0].value as string;
  validateGame(game);

  const winnerId = (
    interactionData
      .options?.[0] as APIApplicationCommandInteractionDataSubcommandOption
  ).options?.[1].value;
  const loserId = (
    interactionData
      .options?.[0] as APIApplicationCommandInteractionDataSubcommandOption
  ).options?.[2].value;

  // TODO: Add more input validation

  const userCollection = db.collection("users");
  const inHouseLeaderboard = db.collection("in_house_leaderboard");

  const currentListDocRef = inHouseLeaderboard.doc(game);
  const currentListDoc = await currentListDocRef.get();
  let ranking = [];
  let didHoldGround = false;
  if (currentListDoc.exists) {
    const currentList = currentListDoc.data();

    // check if both ids exist in user list
    // TODO: Not working
    const winnerDoc = await userCollection.doc(`${winnerId}`).get();
    const loserDoc = await userCollection.doc(`${loserId}`).get();

    if (!winnerDoc.exists) {
      throw new Error(`<@!${winnerId}> has not registered any profiles`);
    }
    if (!loserDoc.exists) {
      throw new Error(`<@!${loserId}> has not registered any profiles`);
    }
    if (!winnerDoc.exists && !loserDoc.exists) {
      throw new Error(
        `<@!${winnerId}> and <@!${loserId}> have not registered any profiles`
      );
    }

    // lower index = higher rank
    ranking = currentList?.ranking;
    const winnerIndex = ranking.findIndex((user: any) => user.id === winnerId);
    const loserIndex = ranking.findIndex((user: any) => user.id === loserId);

    // If both players are not in the ranking, add them
    if (winnerIndex === -1 && loserIndex === -1) {
      ranking.push({
        id: winnerId,
        wins: 1,
        losses: 0
      });
      ranking.push({
        id: loserId,
        wins: 0,
        losses: 1
      });
    }
    // If winner is not in the ranking, add them and update loser
    else if (winnerIndex === -1) {
      ranking[loserIndex].losses++;
      ranking.splice(loserIndex, 0, {
        id: winnerId,
        wins: 1,
        losses: 0
      });
    }
    // If loser is not in the ranking, add them and update winner
    else if (loserIndex === -1) {
      ranking.push({
        id: loserId,
        wins: 0,
        losses: 1
      });
      ranking[winnerIndex].wins++;

      // since loser is not in the ranking, winner holds ground
      didHoldGround = true;
    }
    // If both players are in the ranking, update their wins and losses
    // and swap them if winner has lower rank
    else {
      ranking[winnerIndex].wins++;
      ranking[loserIndex].losses++;

      // swap the winner with loser if winner has lower rank
      if (winnerIndex > loserIndex) {
        const winner = ranking.splice(winnerIndex, 1)[0];
        ranking.splice(loserIndex, 0, winner);
      } else {
        didHoldGround = true;
      }
    }

    await currentListDocRef.set({ ranking });
  } else {
    ranking = [
      {
        id: winnerId,
        wins: 1,
        losses: 0
      },
      {
        id: loserId,
        wins: 0,
        losses: 1
      }
    ];
    await currentListDocRef.set({
      ranking
    });
  }

  /* ---------------------------- SHOW UPDATED ROWS --------------------------- */

  const userIds = ranking.map((user: any) => user.id);
  const filteredUserCollection = db
    .collection("users")
    .where("__name__", "in", userIds);
  const usersDocs = await filteredUserCollection.get();
  const userMap = usersDocs.docs.reduce(
    (acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    },
    {} as Record<string, any>
  );

  const winnerIndex = ranking.findIndex((user: any) => user.id === winnerId);
  const loserIndex = ranking.findIndex((user: any) => user.id === loserId);
  const updatedTable = generateAoe4InHouseLeaderboard(ranking, userMap, {
    winnerIndex,
    loserIndex,
    didHoldGround
  });

  // TODO: Customize lb message and icon based on win, stand-ground
  const winningText = didHoldGround
    ? `<@!${winnerId}> hold's his ground at rank ${winnerIndex + 1} while <@!${loserId}> returns home to rank ${loserIndex + 1}`
    : `<@!${winnerId}> moved up to rank ${winnerIndex + 1} knocking <@!${loserId}> down to rank ${loserIndex + 1}`;

  return {
    content:
      `Congratulations 🎉 <@!${winnerId}> on winning the game! We hope <@!${loserId}> will fight back next time ⚔️! GG\n` +
      `${winningText}\n\n` +
      `**${GAME_NAMES[game]} In House Leaderboard** (Updated)` +
      "```" +
      updatedTable +
      "```"
  };
};
