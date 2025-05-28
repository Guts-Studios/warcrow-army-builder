
import { Unit } from "@/types/army";

export const northernTribesHighCommand: Unit[] = [
  {
    id: "wrathmane",
    name: "Wrathmane",
    pointsCost: 55,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry, Orc)", description: "" },
      { name: "Elite", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: [],
    imageUrl: "/art/card/wrathmane_card.jpg"
  },
  {
    id: "alborc",
    name: "Alborc",
    pointsCost: 60,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry, Orc | Infantry, Varank)", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: [],
    imageUrl: "/art/card/alborc_card.jpg"
  }
];
