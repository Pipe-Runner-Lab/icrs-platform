// https://aoe4world.com/api#players

/* eslint-disable require-jsdoc */
async function apiCall(
  endpoint: string,
  queryParams: Record<string, any> = {}
) {
  const url = new URL(`https://aoe4world.com/api/v0/${endpoint}`);
  for (const [key, value] of Object.entries(queryParams)) {
    url.searchParams.append(key, value);
  }
  const response = await fetch(url.toString());
  return await response.json();
}

export async function searchPlayer(id: string): Promise<{
  name: string;
  profile_id: number;
  avatar?: string;
} | null> {
  const data = await apiCall(`players/${id}`);
  if (data.error) {
    return null;
  }
  return {
    name: data.name,
    profile_id: data.profile_id,
    avatar: data.avatars?.full ?? undefined
  };
}

export async function getProfileId(username: string): Promise<number | void> {
  const data = await apiCall("players/search", {
    query: username,
    exact: true
  });
  if (data.players.length == 0) {
    return;
  }

  return data.players[0].profile_id;
}

export async function getSoloLeaderboard(profileIds: number[]): Promise<Record<string, {
  rating: number;
  name: string;
}>> {
  const result = {} as Record<string, {
    rating: number;
    name: string;
  }>;
  
  const chunks = [];
  for (let i = 0; i < profileIds.length; i += 50) {
    chunks.push(profileIds.slice(i, i + 50));
  }

  for (const chunk of chunks) {
    const data = await apiCall("leaderboards/rm_solo", {
      profile_id: chunk.join(",")
    });

    for (const player of data.players) {
      result[player.profile_id] = {
        rating: player.rating,
        name: player.name
      };
    }
  }

  return result;
}
