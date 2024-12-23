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
    imageUrl: "/art/card/contender_card.jpg"
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
    imageUrl: "/art/card/darkmaster_card.jpg"
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
    imageUrl: "/art/card/evoker_card.jpg"
  },
  {
    id: "hersir",
    name: "Hersir",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Varank", description: "Varank race" },
      { name: "Beserker Rage", description: "Has Berserker Rage" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/hersir_card.jpg"
  },
  {
    id: "prime-warrior",
    name: "Prime Warrior",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false,
    imageUrl: "/art/card/prime_warrior_card.jpg"
  },
  {
    id: "wisemane",
    name: "Wisemane",
    faction: "northern-tribes",
    pointsCost: 15,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Orc", description: "Orc race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/wisemane_card.jpg"
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
    imageUrl: "/art/card/lotta_card.jpg"
  },
  {
    id: "coal",
    name: "Coal",
    faction: "northern-tribes",
    pointsCost: 20,
    availability: 1,
    keywords: [
      { name: "Companion", description: "Companion unit type" },
      { name: "Join (Iriavik)", description: "Can join Iriavik" },
    ],
    highCommand: false,
    imageUrl: "/art/card/coal_card.jpg"
  }
];