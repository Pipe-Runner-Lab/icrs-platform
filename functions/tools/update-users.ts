import * as commands from "../src/constants/command-list";
import fetch from "node-fetch";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({
  credential: applicationDefault()
});

const db = getFirestore();

/**
 * This file is meant to be run from the command line, and is not used by the
 * application server. It's allowed to use node.js primitives, and only needs
 * to be run once.
 */

const token = process.env.DISCORD_BOT_TOKEN;
const applicationId = process.env.DISCORD_APPLICATION_ID;

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
async function updateAllUsernames() {
  // get all usernames

  const ids = await db.collection("users").get();
  await Promise.all(
    ids.docs.map((doc) =>
      updateUsername(`https://discord.com/api/v10/users/${doc.id}`)
    )
  );
}

/**
 * Register all commands in a specific guild.  This is useful for testing
 * commands before deploying them globally.
 * @param {string} url
 */
async function updateUsername(url) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: `Bot ${token}`
    },
    method: "GET"
  });

  if (response.ok) {
    const userData = await response.json();
    const userRef = db.collection("users").doc(userData.id);
    await userRef.set(
      {
        profile: {
          username: userData.username,
          displayName: userData.global_name,
          nickname: ""
        }
      },
      {
        merge: true
      }
    );
  } else {
    throw new Error("Failed to fetch user data");
  }
}

// TODO Delete commands

await updateAllUsernames();
