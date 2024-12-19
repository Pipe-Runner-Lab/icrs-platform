import type { AppCommand } from "../utils/types";
import * as aoe4world from "../utils/aoe4world";
import { LEADERBOARD } from "../constants/command-list";

export default {
  ...LEADERBOARD,
  callback: async ({ interaction, db, api }) => {
    const subcommand = interaction?.data?.options?.[0]?.name;
    if (subcommand === "online") {
      return {
        content: "Online Leaderboard"
      };
    }

    const registered = await db.collection("registered").get();
    const users = registered.docs.map((doc) => doc.data());

    // We should prolly cache api calls to avoid rate limiting
    const ratings = (
      await Promise.all(
        users.map(async (user) => {
          const solo = await aoe4world.getSoloLeaderboard(user.profileId);
          if (!solo) {
            return null;
          }
          return {
            userId: user.userId,
            ...solo
          };
        })
      )
    ).filter((rating) => !!rating);

    const leaderboard = (
      await Promise.all(
        ratings
          .filter((user) => !!user)
          .map(async (user) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const discordUser = await api.users.get(user!.userId);
            return {
              ...user,
              username: discordUser?.username
            };
          })
      )
    )
      .filter((user) => user.username)
      .slice(0, 20)
      .sort((a, b) => {
        if (!a?.rating || !b?.rating) return 0;
        return b.rating - a.rating;
      });

    return {
      embeds: [
        {
          title: "Leaderboard",
          fields: leaderboard.map((user) => ({
            name: user.username,
            value: `${user.name} - ${user.rating}`,
            inline: false
          })),
          color: 0x00ffe0
        }
      ]
    };
  }
} satisfies AppCommand;
