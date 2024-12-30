import Table from "cli-table";

export const swap = (ranking: object[], idx1: number, id2: number) => {
  const temp = ranking[idx1];
  ranking[idx1] = ranking[id2];
  ranking[id2] = temp;
};

export const generateInHouseLeaderboard = (
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
