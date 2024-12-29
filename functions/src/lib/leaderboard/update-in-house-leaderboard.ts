import {
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteractionData
} from "@discordjs/core";
import { getFirestore } from "firebase-admin/firestore";
import { validateGame } from "../helpers/validator";
import { swap } from "./utils";

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
        "<@!${winnerId}> and <@!${loserId}> have not registered any profiles"
      );
    }

    // lower index = higher rank
    const ranking = currentList?.ranking;
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
      ranking.push({
        id: winnerId,
        wins: 1,
        losses: 0
      });
      ranking[loserIndex].losses++;

      // swap the winner with loser if winner has higher index
      if (loserIndex < ranking.length - 1)
        swap(ranking, loserIndex, ranking.length - 1);
    }

    // If loser is not in the ranking, add them and update winner
    else if (loserIndex === -1) {
      ranking.push({
        id: loserId,
        wins: 0,
        losses: 1
      });
      ranking[winnerIndex].wins++;
    }

    // If both players are in the ranking, update their wins and losses
    // and swap them if winner has lower rank
    else {
      ranking[winnerIndex].wins++;
      ranking[loserIndex].losses++;

      // swap the winner with loser if winner has lower rank
      if (winnerIndex > loserIndex) swap(ranking, winnerIndex, loserIndex);
    }

    await currentListDocRef.set({ ranking });
  } else {
    await currentListDocRef.set({
      ranking: [
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
      ]
    });
  }

  return {
    content: `Congratulations 🎉 <@!${winnerId}> on winning the game! We hope <@!${loserId}> will fight back next time ⚔️! GG`
  };
};
