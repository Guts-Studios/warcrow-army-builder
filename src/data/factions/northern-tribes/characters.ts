import { Unit } from "../../../types/army";

export const northernTribesCharacters: Unit[] = [
  {
    id: "hersir",
    name: "Hersir",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 2,
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "Varank", description: "This unit has the Varank keyword" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/hersir_card.jpg"
  },
  {
    id: "prime-warrior",
    name: "Prime Warrior",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 2,
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "Orc", description: "This unit has the Orc keyword" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/prime_warrior_card.jpg"
  },
  {
    id: "wisemane",
    name: "Wisemane",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "Varank", description: "This unit has the Varank keyword" },
      { name: "Dispel", description: "This unit can dispel magic" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
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