import { Unit } from "../../../types/army";

export const northernTribesCharacters: Unit[] = [
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
    highCommand: false,
    imageUrl: "/src/art/card/contender_card.jpg"
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
    highCommand: false,
    imageUrl: "/src/art/card/darkmaster_card.jpg"
  },
  {
    id: "evoker",
    name: "Evoker",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    highCommand: false,
    imageUrl: "/src/art/card/evoker_card.jpg"
  }
];