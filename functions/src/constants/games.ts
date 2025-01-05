export enum GAMES {
  AOE4 = "aoe_4",
  DOTA2 = "dota_2"
}

export const GAME_NAMES: Record<string, string> = {
  [GAMES.AOE4]: "Age of Empires IV",
  [GAMES.DOTA2]: "Dota 2"
};

export const AOE4_RANKING = {
  bronze_1: "Bnz 1",
  bronze_2: "Bnz 2",
  bronze_3: "Bnz 3",
  silver_1: "Slv 1",
  silver_2: "Slv 2",
  silver_3: "Slv 3",
  gold_1: "Gld 1",
  gold_2: "Gld 2",
  gold_3: "Gld 3",
  platinum_1: "Plt 1",
  platinum_2: "Plt 2",
  platinum_3: "Plt 3",
  diamond_1: "Dmd 1",
  diamond_2: "Dmd 2",
  diamond_3: "Dmd 3",
  conqueror_1: "Cqr 1",
  conqueror_2: "Cqr 2",
  conqueror_3: "Cqr 3",
  unranked: "Unranked"
};
