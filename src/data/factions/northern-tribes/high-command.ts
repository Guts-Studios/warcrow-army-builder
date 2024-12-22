import { Unit } from "../../../types/army";

export const northernTribesHighCommand: Unit[] = [
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
    highCommand: true,
    imageUrl: "/src/art/card/wrathmane_card.jpg"
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
    highCommand: true,
    imageUrl: "/src/art/card/Ahlwardt_ice_bear_card.jpg"
  },
  {
    id: "alborc",
    name: "Alborc",
    faction: "northern-tribes",
    pointsCost: 50,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc | Infantry, Varank)", description: "Can join Infantry Orc or Infantry Varank units" },
      { name: "Elite", description: "Elite unit" },
    ],
    highCommand: true,
    imageUrl: "/src/art/card/alborc_card.jpg"
  },
  {
    id: "lotta",
    name: "Lotta",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/lotta_card.jpg"
  },
  {
    id: "njord",
    name: "Njord, The Merciless",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Beserker Rage", description: "Has Berserker Rage" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/Njord_the_merciless_card.jpg" 
  },
  {
    id: "ormuk",
    name: "Ormuk",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "Orc", description: "Orc race" },
      { name: "Bloodlust", description: "Has Bloodlust" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Elite", description: "Elite unit" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/ormuk_card.jpg"
  },
  {
    id: "iriavik",
    name: "Iriavik Restless Pup",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "Nemorous", description: "Nemorous race" },
      { name: "Varank", description: "Varank race" },
      { name: "Ambusher", description: "Has ambush abilities" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Preferred Terrain (Rugged)", description: "Gains advantages in rugged terrain" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/iriavik_restless_pup_card.jpg"
  },
  {
    id: "coal",
    name: "Coal",
    faction: "northern-tribes",
    pointsCost: 20,
    availability: 1,
    keywords: [
      { name: "Companion - Join (Iriavik)", description: "Companion that can join Iriavik" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/coal_a_card.jpg"
  }
];
