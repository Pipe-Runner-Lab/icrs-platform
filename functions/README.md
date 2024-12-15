# 1. ICRS Dicord Bot

- [1. ICRS Dicord Bot](#1-icrs-dicord-bot)
  - [1.1. Commands](#11-commands)
  - [1.2. Local Development](#12-local-development)

## 1.1. Commands

`npm run register`

This command registers all the commands supported by the bot in Discord's registry. This needs to be done only once (or whenever a new command is added).

## 1.2. Local Development

We take advantage of the emulators provided by Firebase to test the bot locally. To do this, follow the steps below:

1. Start the Firebase emulators by running `npm run serve`.
2. Port forward the emulator to the public internet using `npm run tunnel`.

The `tunnel` command will provide you with a public URL that you can use to interact with the bot. We need to post this URL in the Discord Developer Portal to receive events from Discord.

**Note:** The url provided only forward the base URL. For interacting with the `/interactions` endpoint, you need to append the part displayed on the CLI that follows the base URL. For examples, `https://d133-89-10-209-177.ngrok-free.app/icrs-platform/us-central1/interactions` where `https://d133-89-10-209-177.ngrok-free.app` is the base URL.
