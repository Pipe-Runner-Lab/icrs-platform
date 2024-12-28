import type { AppCommand } from "../utils/types";
import { LEADERBOARD } from "../constants/command-list";
import { GAMES } from "../constants/games";
import Table from "cli-table";

export default {
  ...LEADERBOARD,
  callback: async ({ interaction, db }) => {
    const subcommand = interaction?.data?.options?.[0]?.name;
    if (subcommand === "local") {
      return {
        content: "Local Leaderboard"
      };
    }

    const registered = await db.collection("users").get();
    const users = registered.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    const reducedUsers = users.reduce((acc, user) => {
      for (const [profileId, profile] of Object.entries(user[GAMES.AOE4])) {
        acc[profileId] = {
          userId: user.id,
          ...profile as {}
        };
      }
      return acc;
    }, {}) as Record<string,{ userId: string; rating: number; name: string }>;

    const leaderboard = Object.values(reducedUsers).sort((a, b) => {
      if (!a?.rating || !b?.rating) return 0;
      return b.rating - a.rating;
    })
    .slice(0, 20);

    const table = new Table({
      head: ["User", "Name", "Rating"],
    });
    table.push(...leaderboard.map((user) => [`<@!${user.userId}>`, user.name, user.rating.toString()]));
    
    return {
      embeds: [
        {
          title: "Leaderboard",
          description: table.toString(),
          color: 0x00ffe0
        }
      ]
    };
  }
} satisfies AppCommand;
