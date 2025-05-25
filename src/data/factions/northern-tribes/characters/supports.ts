
import { Unit } from "@/types/army";

export const northernTribesSupports: Unit[] = [
  {
    id: "darkmaster",
    name: "Darkmaster",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK, BLK)", description: "" },
      { name: "Join (Hunters)", description: "" },
    ],
    specialRules: ["Scout", "Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/darkmaster_card.jpg"
  },
  {
    id: "wisemane",
    name: "Wisemane",
    faction: "northern-tribes",
    pointsCost: 15,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Fearless", description: "" },
      { name: "Join (Infantry, Orc)", description: "" },
    ],
    specialRules: ["Vulnerable", "Fix a Die"],
    highCommand: false,
    imageUrl: "/art/card/wisemane_card.jpg"
  },
  {
    id: "tattooist",
    name: "Tattooist",
    faction: "northern-tribes",
    pointsCost: 15,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Join (Infantry, Varank)", description: "" },
      { name: "Elite", description: "" },
    ],
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/tattooist_card.jpg"
  },
  {
    id: "coal",
    name: "Coal",
    faction: "northern-tribes",
    pointsCost: 20,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Companion", description: "" },
      { name: "Join (Iriavik)", description: "" },
    ],
    specialRules: ["Slowed", "Fix a Die"],
    highCommand: false,
    imageUrl: "/art/card/coal_card.jpg",
    companion: "iriavik-restless-pup"
  }
];
