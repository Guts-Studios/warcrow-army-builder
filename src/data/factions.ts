import { Faction, Unit } from "../types/army";

export const factions: Faction[] = [
  { id: "northern-tribes", name: "Northern Tribes" },
  { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
];

export const units: Unit[] = [
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
  },
  {
    id: "contender",
    name: "Contender",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
  },
  {
    id: "darkmaster",
    name: "Darkmaster",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Ambusher", description: "Has ambush abilities" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Join (Hunters)", description: "Can join Hunter units" },
    ],
  },
  {
    id: "agressors",
    name: "Agressors",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
    ],
  },
];