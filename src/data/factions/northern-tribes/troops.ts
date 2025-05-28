
import { Unit } from "@/types/army";

export const northernTribesTroops: Unit[] = [
  {
    id: "battlescarred",
    name: "Battle-Scarred",
    pointsCost: 40,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Orc", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    imageUrl: "/art/card/battlescarred_card.jpg"
  },
  {
    id: "orc-hunters",
    name: "Orc Hunters",
    pointsCost: 20,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Orc", description: "" }
    ],
    highCommand: false,
    availability: 3,
    command: 0,
    specialRules: [],
    imageUrl: "/art/card/orc-hunters_card.jpg"
  },
  {
    id: "skin-changers",
    name: "Skin Changers",
    pointsCost: 35,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Varank", description: "" },
      { name: "Fearless", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    imageUrl: "/art/card/skin-changers_card.jpg"
  },
  {
    id: "ice-archers",
    name: "Ice Archers",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Varank", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    imageUrl: "/art/card/ice-archers_card.jpg"
  },
  {
    id: "tundra-marauders",
    name: "Tundra Marauders",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Varank", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: [],
    imageUrl: "/art/card/tundra-marauders_card.jpg"
  },
  {
    id: "warg-riders",
    name: "Warg Riders",
    pointsCost: 35,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Cavalry", description: "" },
      { name: "Orc", description: "" },
      { name: "Bloodlust", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: [],
    imageUrl: "/art/card/warg-riders_card.jpg"
  }
];
