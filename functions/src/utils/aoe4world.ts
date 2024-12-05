async function apiCall(endpoint: string, queryParams: Record<string, any> = {}) {
    const url = new URL(`https://aoe4world.com/api/v0/${endpoint}`);
    for (const [key, value] of Object.entries(queryParams)) {
        url.searchParams.append(key, value);
    }
    const response = await fetch(url.toString());
    return await response.json();
}

export async function getProfileId(username: string): Promise<number|undefined> {
    const data = await apiCall("players/search", {
        query: username,
        exact: true
    });
    if (data.players.length == 0) {
        return;
    }

    return data.players[0].profile_id;
};

export async function getSoloLeaderboard(profileId: number): Promise<{
    rating: number,
    name: string
}> {
    const data =  await apiCall("leaderboards/rm_solo", {
        profile_id: profileId
    });
    return {
        rating: data.players[0].rating,
        name: data.players[0].name,
    }
}