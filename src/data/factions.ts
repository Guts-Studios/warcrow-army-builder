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
    highCommand: false
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
    highCommand: false
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
    highCommand: false
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
    highCommand: false
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
    highCommand: false
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
    highCommand: false
  },
  {
    id: "wrathmane",
    name: "Wrathmane",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Elite", description: "Elite unit" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: true
  },
  {
    id: "ahlwardt",
    name: "Ahlwardt, Ice Bear",
    faction: "northern-tribes",
    pointsCost: 60,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Varank", description: "Varank race" },
      { name: "Beserker Rage", description: "Has Berserker Rage" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Elite", description: "Elite unit" },
      { name: "Join (Skin Changers)", description: "Can join Skin Changers units" },
    ],
    highCommand: true
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
    highCommand: false
  },
];