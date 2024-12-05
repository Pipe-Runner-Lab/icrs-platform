import type { AppCommand } from "./utils/types";
import * as aoe4world from "./utils/aoe4world";

export const register = {
    name: "register",
    description: "Register a new user",
    options: [
        {
            name: "game-username",
            description: "The user to register",
            type: 3,
            required: true
        },

    ],
    callback: async ({interaction, db}) => {
        if (interaction.guild_id != process.env.ICRS_GUILD_ID) {
            return {
                content: "This command is only available in the ICRS guild",
            }
        }
        const username = interaction.data.options && interaction.data.options[0].value as string;
        if (!username) {
            return;
        }
        const userIdStr = interaction.member?.user?.id;
        if (!userIdStr) {
            return {
                content: "Could not find user",
            }
        }
        const userId = Number(userIdStr);
        const snapshot = await db.collection("users").where("userId", "==", userId).get();
        if (!snapshot.empty) {
            return {
                content: "User already registered",
            }
        }

        const profileId = await aoe4world.getProfileId(username);
        if (!profileId) {
            return {
                content: "Could not find profile",
            }
        }

        await db.collection("users").add({
            userId,
            profileId,
        });
        return {
            content: "User Registered Sucessfully",
        }
    }
} satisfies AppCommand;