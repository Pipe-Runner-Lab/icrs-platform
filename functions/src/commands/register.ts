import type { AppCommand } from "../utils/types";
import * as aoe4world from "../utils/aoe4world";

export default {
  name: "register",
  description: "Register a new user",
  options: [
    {
      name: "game-username",
      description: "The user to register",
      type: 3,
      required: true
    }
  ],
  callback: async ({ interaction, db }) => {
    if (interaction.guild_id != process.env.ICRS_GUILD_ID) {
      return {
        content: "This command is only available in the ICRS guild"
      };
    }
    const username =
      interaction.data.options && (interaction.data.options[0].value as string);
    if (!username) {
      return null;
    }
    const userId = interaction.member?.user?.id;
    if (!userId) {
      return {
        content: "Could not find user"
      };
    }

    const profileId = await aoe4world.getProfileId(username);
    if (!profileId) {
      return {
        content: "Could not find profile"
      };
    }

    await db.collection("registered").doc(userId).set({
      userId,
      profileId
    });
    return {
      content: "User Registered Sucessfully"
    };
  }
} satisfies AppCommand;
