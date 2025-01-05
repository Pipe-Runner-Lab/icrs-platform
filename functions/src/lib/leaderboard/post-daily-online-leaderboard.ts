const postMessageToDiscord = async (message: string) => {
  const baseURL = `https://discord.com/api/v10/channels/${process.env.NODE_ENV === "development" ? process.env.TEST_LEADERBOARD_CHANNEL_ID : process.env.LEADERBOARD_CHANNEL_ID}/messages`;

  try {
    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`
      },
      body: JSON.stringify({ content: message })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

export const postDailyOnlineLeaderboard = async () => {
  const message = "The daily leaderboard is here!";
  await postMessageToDiscord(message);
};
