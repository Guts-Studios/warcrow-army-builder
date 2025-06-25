
import { Unit } from "@/types/army";

export const northernTribesTroops: Unit[] = [
  {
    id: "battle-scarred",
    name: "Battle-Scarred",
    name_es: "Cicatrices De Batalla",
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
    specialRules: ["Slowed", "Vulnerable", "Frightened", "Disarmed"],
    tournamentLegal: true,
    imageUrl: "/art/card/battle-scarred_card.jpg"
  },
  {
    id: "ice-archers",
    name: "Ice Archers",
    name_es: "Arqueros De Hielo",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Varank", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Slowed"],
    tournamentLegal: true,
    imageUrl: "/art/card/ice_archers_card.jpg"
  },
  {
    id: "orc-hunters",
    name: "Orc Hunters",
    name_es: "Cazadores Orcos",
    pointsCost: 20,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Orc", description: "" }
    ],
    highCommand: false,
    availability: 3,
    specialRules: ["Vulnerable"],
    tournamentLegal: true,
    imageUrl: "/art/card/orc_hunters_card.jpg"
  },
  {
    id: "skin-changers",
    name: "Skin Changers",
    name_es: "Cambiaformas",
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
    specialRules: ["Scout"],
    tournamentLegal: true,
    imageUrl: "/art/card/skin_changers_card.jpg"
  },
  {
    id: "tundra-marauders",
    name: "Tundra Marauders",
    name_es: "Tundra Marauders",
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
    specialRules: ["Displace (3)", "Rugged", "Trap"],
    tournamentLegal: true,
    imageUrl: "/art/card/tundra_marauders_card.jpg"
  },
  {
    id: "warg-riders",
    name: "Warg Riders",
    name_es: "Jinetes De Huargo",
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
    specialRules: ["Vulnerable", "Repeat a Die"],
    tournamentLegal: true,
    imageUrl: "/art/card/warg_riders_card.jpg"
  }
];
