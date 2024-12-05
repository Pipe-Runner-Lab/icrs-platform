import type { AppCommand } from "../utils/types";
import * as aoe4world from "../utils/aoe4world";

export default {
    name: "leaderboard",
    description: "Get the leaderboard",
    options: [
        {
            type: 1,
            name: "global",
            description: "Global leaderboard",
        },
        {
            type: 1,
            name: "online",
            description: "Guild leaderboard",
        },
    ],
    callback: async ({interaction, db, api}) => {
        const subcommand = interaction.data.options && interaction.data.options[0].name;
        if (subcommand == "online") {
            return {
                content: "Online Leaderboard",
            }
        }

        const reqistered = await db.collection("registered").get();
        const users = reqistered.docs.map(doc => doc.data());
        
        // We should prolly cache api calls to avoid rate limiting
        const ratings = (await Promise.all(users.map(async user => {
            const solo = await aoe4world.getSoloLeaderboard(user.profileId);
            if (!solo) {
                return;
            }
            return {
                userId: user.userId,
                ...solo
            }
        }))).filter(rating => rating != undefined);
        
        const leaderboard = (await Promise.all(ratings.map(async user => {
            const discordUser = await api.users.get(user.userId);
            return {
                ...user,
                username: discordUser?.username,
            }
        }))).filter(user => user.username).slice(0, 20).sort((a, b) => b.rating - a.rating);

        return {
            embeds: [
                {
                    title: "Leaderboard",
                    fields: leaderboard.map(user => ({
                        name: user.username,
                        value: `${user.name} - ${user.rating}`,
                        inline: false
                    })),
                    color: 0x00ffe0
                }
            ]
        }
    }
} satisfies AppCommand;