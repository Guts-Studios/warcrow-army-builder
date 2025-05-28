
import { Unit } from "@/types/army";

export const northernTribesTroops: Unit[] = [
  {
    id: "battle-scarred",
    name: "Battle-Scarred",
    pointsCost: 40,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed", "Vulnerable", "Frightened", "Disarmed"],
    imageUrl: "/art/card/battle-scarred_card.jpg"
  },
  {
    id: "ice-archers",
    name: "Ice Archers",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed"],
    imageUrl: "/art/card/ice-archers_card.jpg"
  },
  {
    id: "orc-hunters",
    name: "Orc Hunters",
    pointsCost: 20,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." }
    ],
    highCommand: false,
    availability: 3,
    command: 0,
    specialRules: ["Vulnerable"],
    imageUrl: "/art/card/orc-hunters_card.jpg"
  },
  {
    id: "skin-changers",
    name: "Skin Changers",
    pointsCost: 35,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." },
      { name: "Fearless", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Scout"],
    imageUrl: "/art/card/skin-changers_card.jpg"
  },
  {
    id: "tundra-marauders",
    name: "Tundra Marauders",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." },
      { name: "Preferred Terrain (Rugged)", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: ["Displace (3)", "Rugged", "Trap"],
    imageUrl: "/art/card/tundra-marauders_card.jpg"
  },
  {
    id: "warg-riders",
    name: "Warg Riders",
    pointsCost: 35,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Cavalry", description: "Units that ride upon mounts such as horses or other creatures for rapid movement on the battlefield." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Bloodlust", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: ["Vulnerable", "Repeat a Die"],
    imageUrl: "/art/card/warg-riders_card.jpg"
  }
];
