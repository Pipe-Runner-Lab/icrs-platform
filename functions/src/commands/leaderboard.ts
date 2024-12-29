import type { AppCommand } from "../@types/discord-custom";
import { LEADERBOARD } from "../constants/command-list";
import { GAMES } from "../constants/games";
import Table from "cli-table";
import { updateInHouseLeaderboard } from "../lib/leaderboard/update-in-house-leaderboard";
import { showInHouseLeaderboard } from "../lib/leaderboard/show-in-house-leaderboard";
import { getFirestore } from "firebase-admin/firestore";
import { validateCredentials } from "../lib/helpers/validator";

export default {
  ...LEADERBOARD,
  callback: async ({ interaction }) => {
    const subcommand = interaction?.data?.options?.[0]?.name;
    if (subcommand === "in-house") {
      return showInHouseLeaderboard(interaction.data);
    }

    if (subcommand === "update-in-house") {
      validateCredentials(interaction, {
        adminLock: true
      });
      return updateInHouseLeaderboard(interaction.data);
    }

    const db = getFirestore();

    const registered = await db.collection("users").get();
    const users = registered.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    const reducedUsers = users.reduce((acc, user) => {
      for (const [profileId, profile] of Object.entries(user[GAMES.AOE4])) {
        acc[profileId] = {
          userId: user.id,
          ...(profile as object)
        };
      }
      return acc;
    }, {}) as Record<string, { userId: string; rating: number; name: string }>;

    const leaderboard = Object.values(reducedUsers)
      .sort((a, b) => {
        if (!a?.rating || !b?.rating) return 0;
        return b.rating - a.rating;
      })
      .slice(0, 20);

    const table = new Table({
      head: ["User", "Name", "Rating"]
    });
    table.push(
      ...leaderboard.map((user) => [
        `<@!${user.userId}>`,
        user.name,
        user.rating.toString()
      ])
    );

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
