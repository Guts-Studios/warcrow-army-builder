import { Unit } from "../../../types/army";

export const northernTribesCharacters: Unit[] = [
  {
    id: "contender",
    name: "Contender",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "Orc", description: "This unit has the Orc keyword" },
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
      { name: "Character", description: "This unit is a character" },
      { name: "Orc", description: "This unit has the Orc keyword" },
      { name: "Ambusher", description: "Has the Ambusher ability" },
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
      { name: "Character", description: "This unit is a character" },
      { name: "Orc", description: "This unit has the Orc keyword" },
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
      { name: "Character", description: "This unit is a character" },
      { name: "Varank", description: "This unit has the Varank keyword" },
      { name: "Beserker Rage", description: "Has Beserker Rage" },
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
      { name: "Character", description: "This unit is a character" },
      { name: "Orc", description: "This unit has the Orc keyword" },
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
      { name: "Character", description: "This unit is a character" },
      { name: "Orc", description: "This unit has the Orc keyword" },
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
      { name: "Character", description: "This unit is a character" },
      { name: "Orc", description: "This unit has the Orc keyword" },
      { name: "Join (Infantry, Orc)", description: "Can join Infantry Orc units" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false,
    imageUrl: "/art/card/lotta_card.jpg"
  },
  {
    id: "njord-the-merciless",
    name: "Njord, The Merciless",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "Varank", description: "This unit has the Varank keyword" },
      { name: "Beserker Rage", description: "Has Beserker Rage" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/njord_the_merciless_card.jpg"
  },
  {
    id: "ormuk",
    name: "Ormuk",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "Orc", description: "This unit has the Orc keyword" },
      { name: "Bloodlust", description: "Has the Bloodlust ability" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Elite", description: "Elite unit" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Raging", description: "Has the Raging ability" },
    ],
    highCommand: false,
    imageUrl: "/art/card/ormuk_card.jpg"
  },
  {
    id: "iriavik",
    name: "Iriavik Restless Pup",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "Nemorous", description: "Has the Nemorous keyword" },
      { name: "Varank", description: "This unit has the Varank keyword" },
      { name: "Ambusher", description: "Has the Ambusher ability" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Preferred Terrain (Rugged)", description: "Gains advantages in rugged terrain" },
    ],
    highCommand: false,
    imageUrl: "/art/card/iriavik_restless_pup_card.jpg"
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