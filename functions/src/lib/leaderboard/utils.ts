import { AOE4_RANKING } from "../../constants/games";
import Table from "cli-table";

export const swap = (ranking: object[], idx1: number, id2: number) => {
  const temp = ranking[idx1];
  ranking[idx1] = ranking[id2];
  ranking[id2] = temp;
};

export const generateAoe4InHouseLeaderboard = (
  ranking: object[],
  userMap: Record<
    string,
    {
      profile: {
        displayName: string;
      };
    }
  >,
  updatedIndices?: {
    winnerIndex: number;
    loserIndex: number;
    didHoldGround: boolean;
  }
) => {
  const table = new Table({
    head: ["Player", "Ranking", "Wins", "Total Games", "Win Rate"]
  });

  const winEmoji = updatedIndices?.didHoldGround ? "🛡️" : "🔼";
  const loseEmoji = updatedIndices?.didHoldGround ? "❌" : "🔽";

  table.push(
    ...ranking.map((user: any, idx: number) => {
      let updateEmoji = "";

      if (updatedIndices?.winnerIndex === idx) {
        updateEmoji = ` ${winEmoji}`;
      }
      if (updatedIndices?.loserIndex === idx) {
        updateEmoji = ` ${loseEmoji}`;
      }

      return [
        userMap[user.id].profile?.displayName + updateEmoji,
        idx + 1,
        user.wins.toString(),
        (user.wins + user.losses).toString(),
        ((user.wins / (user.wins + user.losses)) * 100).toFixed(2) + "%"
      ];
    })
  );

  return table.toString();
};

export const generateAoe4OnlineLeaderboard = (
  ranking: {
    rmSoloElo: number;
    rmSoloTitle: string;
    rmTeamElo: number;
    rmTeamTitle: string;
    ign: string;
    name: string;
  }[]
) => {
  const table = new Table({
    head: ["Player", "Ranking", "IGN", "Solo ELO", "Team ELO"]
  });

  table.push(
    ...ranking.map((user: any, idx: number) => {
      return [
        user.name,
        idx + 1,
        user.ign,
        `${user.rmSoloElo ?? "N/A"} (${AOE4_RANKING[user.rmSoloTitle as keyof typeof AOE4_RANKING]})`,
        `${user.rmTeamElo ?? "N/A"} (${AOE4_RANKING[user.rmTeamTitle as keyof typeof AOE4_RANKING]})`
      ];
    })
  );

  return table.toString();
};
