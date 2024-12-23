import { Unit } from "../../../types/army";

export const northernTribesTroops: Unit[] = [
  {
    id: "battle-scarred",
    name: "Battle-Scarred",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false,
    imageUrl: "/art/card/battle_scarred_card.jpg"
  },
  {
    id: "orc-hunters",
    name: "Orc Hunters",
    faction: "northern-tribes",
    pointsCost: 20,
    availability: 3,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false,
    imageUrl: "/art/card/orc_hunters_card.jpg"
  },
  {
    id: "skin-changers",
    name: "Skin Changers",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Fearless", description: "Has the Fearless ability" },
    ],
    highCommand: false,
    imageUrl: "/art/card/skin_changers_card.jpg"
  },
  {
    id: "tundra-marauders",
    name: "Tundra Marauders",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 2,
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Preferred Terrain (Rugged)", description: "Gains advantages in rugged terrain" },
      { name: "Scout", description: "Has scouting abilities" },
    ],
    highCommand: false,
    imageUrl: "/art/card/tundra_marauders_card.jpg"
  }
];