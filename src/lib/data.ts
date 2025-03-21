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
  game: 'Age of Empires' | 'DOTA2';
  eventHighlights?: string[];
  additionalInfo?: string[];
  sponsors?: Sponsor[];
  patrons?: Patron[];
  youtubeLink?: string;
  twitchLink?: string;
}

export const events: Event[] = [
  {
    id: "1",
    title: "ICRS // Age of Empires // Free For All",
    color: colors.teal,
    cover:
      "https://media.wired.com/photos/6172e44f8acfc2aaa8454fbe/master/w_2240,c_limit/Age%20of%20Empires%20IV_3_4K.jpg",
    description: "Welcome to the first ICRS event of the year! We will be playing Age of Empires in a Free For All format. Top 3 players will receive a prize!",
    date: new Date("2021-09-01"),
    registrationLink: "https://forms.gle/3g4Qv9W9Qq4jF4uG6",
    game: 'Age of Empires',
    eventHighlights: [
      "Free For All",
      "Top 3 players receive a prize",
    ],
    additionalInfo: [
      "The event will be streamed on our Twitch channel",
      "The event will be hosted on our Discord server",
    ]
    ,
    sponsors: [
      {
        name: "Game Syndrome",
        logo: "https://lh3.googleusercontent.com/a-/ALV-UjXlTsMdTpRcWiqvGClQT6xQ3lO6uh4KwjKozXIksFE05XJH2xM=w60-h60-p-rp-mo-br100",
      }
    ],
    patrons: [
      {name:"Pipe Runner", amount: 100},
    ],
  }
];

