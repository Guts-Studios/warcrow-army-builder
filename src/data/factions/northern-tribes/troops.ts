
import { Unit } from "@/types/army";

export const northernTribesTroops: Unit[] = [
  {
    id: "battle-scarred",
    name: "Battle-Scarred",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Orc", description: "" },
      { name: "Raging", description: "" },
    ],
    specialRules: ["Slowed", "Vulnerable", "Frightened", "Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/battle-scarred_card_en.jpg"
  },
  {
    id: "orc-hunters",
    name: "Orc Hunters",
    faction: "northern-tribes",
    pointsCost: 20,
    availability: 3,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Orc", description: "" },      
    ],
    specialRules: ["Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/orc_hunters_card_en.jpg"
  },
  {
    id: "skin-changers",
    name: "Skin Changers",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Varank", description: "" },
      { name: "Fearless", description: "" },
    ],
    specialRules: ["Scout"],
    highCommand: false,
    imageUrl: "/art/card/skin_changers_card_en.jpg"
  },
  {
    id: "ice-archers",
    name: "Ice Archers",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Varank", description: "" },
    ],
    specialRules: ["Slowed"],
    highCommand: false,
    imageUrl: "/art/card/ice_archers_card_en.jpg"
  },
  {
    id: "tundra-marauders",
    name: "Tundra Marauders",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Varank", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" },
      { name: "Scout", description: "" },
    ],
    specialRules: ["Displace (3)", "Rugged", "Trap"],
    highCommand: false,
    imageUrl: "/art/card/tundra_marauders_card_en.jpg"
  },
  {
    id: "warg-riders",
    name: "Warg Riders",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Cavalry", description: "" },
      { name: "Orc", description: "" },  
      { name: "Bloodlust", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" },
      { name: "Raging", description: "" }
    ],
    specialRules: ["Vulnerable", "Repeat a Die"],
    highCommand: false,
    imageUrl: "/art/card/warg_riders_card_en.jpg"
  }
];
