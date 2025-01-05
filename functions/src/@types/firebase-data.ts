import { GAMES, AOE4_RANKING } from "../constants/games";

// derived from discord
export type Profile = {
  displayName: string;
  nickname: string;
  username: string;
};

export type AOE4Ratings = Record<
  string,
  {
    name: string;
    rmSoloElo: number;
    rmSoloTitle: keyof typeof AOE4_RANKING;
    rmTeamElo: number;
    rmTeamTitle: keyof typeof AOE4_RANKING;
  }
>;

export type User = {
  profile: Profile;
  [GAMES.AOE4]: AOE4Ratings;
};

export type WithId<T> = T & { id: string };
