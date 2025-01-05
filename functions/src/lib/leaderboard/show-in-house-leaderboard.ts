import {
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteractionData
} from "@discordjs/core";
import { getFirestore } from "firebase-admin/firestore";
import { validateGame } from "../helpers/validator";
import { GAME_NAMES } from "../../constants/games";
import { generateAoe4InHouseLeaderboard } from "./utils";

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

  const table = generateAoe4InHouseLeaderboard(
    inHouseLeaderboard?.ranking,
    userMap
  );

  return {
    content:
      `**${GAME_NAMES[game]} In House Leaderboard**` + "```" + table + "```"
  };
};
