async function apiCall(endpoint: string, queryParams: Record<string, any> = {}) {
    const url = new URL(`https://aoe4world.com/api/v0/${endpoint}`);
    for (const [key, value] of Object.entries(queryParams)) {
        url.searchParams.append(key, value);
    }
    const response = await fetch(url.toString());
    return await response.json();
}

export async function getProfileId(username: string) {
    const data = await apiCall("players/search", {
        query: username,
        exact: true
    });
    if (data.players.length == 0) {
        return;
    }

    return data.players[0].profile_id;
};