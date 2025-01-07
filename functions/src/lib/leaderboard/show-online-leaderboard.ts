import {
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteractionData
} from "@discordjs/core";
import { getFirestore } from "firebase-admin/firestore";
import { validateGame } from "../helpers/validator";
import { GAME_NAMES, GAMES } from "../../constants/games";
import { generateAoe4OnlineLeaderboard } from "./utils";
import { User, WithId } from "../../@types/firebase-data";
import { orderBy } from "lodash";
import { truncate } from "../../utils/common";

export const showOnlineLeaderboard = async (
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

  if (game === GAMES.AOE4) {
    const userDocRef = await db.collection("users").orderBy(game).get(); // using orderby to get user that have the "game" field

    const users = userDocRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as WithId<User>[];

    const onlineRanking = orderBy(
      users
        .flatMap((user) =>
          Object.values(user.aoe_4).map(({ name, ...rest }) => ({
            ign: name,
            name: user.profile.displayName,
            ...rest
          }))
        )
        .map((user) => ({
          ...user,
          rmSoloElo: user.rmSoloElo ?? 0,
          rmTeamElo: user.rmTeamElo ?? 0
        })),
      "rmSoloElo",
      "desc"
    );

    const table = truncate(generateAoe4OnlineLeaderboard(onlineRanking));

    return {
      content:
        `**${GAME_NAMES[game]} Online Leaderboard**` + "```" + table + "```"
    };
  }

  throw new Error("No leaderboard found for this game");
};
