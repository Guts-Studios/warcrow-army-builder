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
    imageUrl: "/src/art/card/ahlwardt_card.jpg"
  }
];