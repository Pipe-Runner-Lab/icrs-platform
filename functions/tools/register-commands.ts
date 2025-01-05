import * as commands from "../src/constants/command-list";
import fetch from "node-fetch";

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server. It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

const token = process.env.DISCORD_BOT_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;
const guildId = process.env.ICRS_GUILD_ID;

if (!token) {
  throw new Error("The DISCORD_BOT_TOKEN environment variable is required.");
}
if (!applicationId) {
  throw new Error(
    "The DISCORD_APPLICATION_ID environment variable is required."
  );
}

/**
 * Register all commands globally.  This can take o(minutes), so wait until
 * you're sure these are the commands you want.
 */
async function registerGlobalCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/guilds/${guildId}/commands`;

  await registerCommands(url);
}

/**
 * Register all commands in a specific guild.  This is useful for testing
 * commands before deploying them globally.
 * @param {string} url
 */
async function registerCommands(url) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bot ${token}`
    },
    method: "PUT",
    body: JSON.stringify(
      // in order to filter our "default"
      Object.values(commands).filter((command) => command.name)
    )
  });

  if (response.ok) {
    console.log("Registered all commands");
  } else {
    console.error("Error registering commands");
    const text = await response.text();
    console.error(text);
  }
  return response;
}

// TODO Delete commands

await registerGlobalCommands();
