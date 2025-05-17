
import { Unit } from "@/types/army";

export const hegemonyCharactersElites: Unit[] = [
  {
    id: "nadezhda-lazard",
    name: "Nadezhda Lazard, Champion of Embersig",
    faction: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    specialRules: ["Disarmed", "Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/nadezhda_lazard_champion_of_embersig_card.jpg"
  },
  {
    id: "lady-telia",
    name: "Lady Telia",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Elite", description: "Elite unit" },
      { name: "Scout", description: "Has scouting abilities" },
      { name: "Join (Arquebusiers | Pioneers)", description: "Can join Arquebusiers or Pioneers units" },
    ],
    specialRules: ["Frightened", "Aim", "Repeat a Die"],
    highCommand: false,
    imageUrl: "/art/card/lady_telia_card.jpg"
  }
];
