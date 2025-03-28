import { colors } from "./colors";

interface Sponsor {
  name: string;
  logo: string;
}

interface Patron {
  name: string;
  amount: number;
}

export interface Event {
  id: string;
  title: string;
  color: (typeof colors)[keyof typeof colors];
  cover: string;
  description: string;
  date: Date;
  registrationLink?: string;
  game: "Age of Empires" | "DOTA2";
  eventHighlights?: string[];
  additionalInfo?: string[];
  sponsors?: Sponsor[];
  patrons?: Patron[];
  youtubeLink?: string;
  twitchLink?: string;
  prizePool?: number;
  isDateTentative?: boolean;
}

export const events: Event[] = [
  {
    id: "1",
    title: "8 Angry Men #1 // AOE 4 - FFA Tournament",
    color: colors.teal,
    cover:
      "https://media.wired.com/photos/6172e44f8acfc2aaa8454fbe/master/w_2240,c_limit/Age%20of%20Empires%20IV_3_4K.jpg",
    description:
      "Join us for the first Free For All tournament of ICRS. Whether you are a beginner or a pro, this is your chance to showcase your art of base building and military tactics. This is an international tournament and is open to all players of all nationalities and backgrounds.",
    date: new Date("2025-04-06"),
    isDateTentative: true,
    registrationLink: "https://www.start.gg/tournament/icrs-8-angry-men-1",
    game: "Age of Empires",
    eventHighlights: [
      "FFA Format with some really fun point system.", 
      "Top 3 players receive a prize from a pool of $100.",
      "To promote new players, there will be an ELO cap for the participants. The details will be available in the registration form."],
    additionalInfo: [
      "The event will be streamed and cast on our Twitch channel and Youtube channel.",
      "The event will be hosted on our Discord server.",
      "Rulebook will be available on the registration page.",
    ],
    sponsors: [
      {
        name: "Game Syndrome",
        logo: "https://lh3.googleusercontent.com/a-/ALV-UjXlTsMdTpRcWiqvGClQT6xQ3lO6uh4KwjKozXIksFE05XJH2xM=w60-h60-p-rp-mo-br100",
      },
    ],
    patrons: [
      { 
        name: "Pipe Runner",
        amount: 50 }, 
      {
        name: "Magma",
        amount: 50,
      }
    ],
    prizePool: 100,
  },
];
