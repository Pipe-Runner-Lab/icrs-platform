import {
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteractionData
} from "@discordjs/core";
import { getFirestore } from "firebase-admin/firestore";
import Table from "cli-table";
import { validateGame } from "../helpers/validator";

export const showInHouseLeaderboard = async (
  interactionData: APIChatInputApplicationCommandInteractionData
): Promise<
  | {
      content: string;
    }
  | {
      embeds: [
        {
          title: string;
          description: string;
          color: number;
        }
      ];
    }
> => {
  const game = (
    interactionData
      .options?.[0] as APIApplicationCommandInteractionDataSubcommandOption
  ).options?.[0].value as string;
  validateGame(game);

  const db = getFirestore();
  const inHouseLeaderboardRef = db.collection("in_house_leaderboard").doc(game);
  const inHouseLeaderboardDoc = await inHouseLeaderboardRef.get();

  if (!inHouseLeaderboardDoc.exists) {
    throw new Error("No leaderboard found for this game");
  }

  const inHouseLeaderboard = inHouseLeaderboardDoc.data();
  const userIds = inHouseLeaderboard?.ranking.map((user: any) => user.id);

  const userCollection = db
    .collection("users")
    .where("__name__", "in", userIds);
  const usersDocs = await userCollection.get();
  const userMap = usersDocs.docs.reduce(
    (acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    },
    {} as Record<string, any>
  );

  const table = new Table({
    head: ["User", "Ranking", "Wins", "Total Games", "Win Rate"]
  });
  table.push(
    ...(inHouseLeaderboard?.ranking ?? []).map((user: any, idx: number) => [
      userMap[user.id].profile?.displayName,
      idx + 1,
      user.wins.toString(),
      (user.wins + user.losses).toString(),
      ((user.wins / (user.wins + user.losses)) * 100).toFixed(2) + "%"
    ])
  );

  // return {
  //   embeds: [
  //     {
  //       title: "Leaderboard",
  //       description: "```" + table.toString() + "```",
  //       color: 0x00ffe0
  //     }
  //   ]
  // };

  return {
    content: "```" + table.toString() + "```"
  };
};
