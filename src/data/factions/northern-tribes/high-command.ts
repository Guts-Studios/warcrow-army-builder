import { Unit } from "@/types/army";

export const northernTribesHighCommand: Unit[] = [
  {
    id: "ahlwardt",
    name: "Ahlwardt, Ice Bear",
    pointsCost: 60,
    faction: "northern-tribes",
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "High Command", description: "This unit is part of the High Command" },
      { name: "Varank", description: "This unit has the Varank keyword" },
      { name: "Beserker Rage", description: "This unit has Beserker Rage" },
      { name: "Dispel", description: "This unit can dispel magic" },
      { name: "Elite", description: "This unit is elite" },
      { name: "Join (Skin Changers)", description: "Can join Skin Changers units" },
    ],
    highCommand: true,
    availability: 1,
    imageUrl: "art/card/ahlwardt_ice_bear_card.jpg"
  },
  {
    id: "alborc",
    name: "Alborc",
    pointsCost: 50,
    faction: "northern-tribes",
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "High Command", description: "This unit is part of the High Command" },
      { name: "Orc", description: "This unit has the Orc keyword" },
      { name: "Elite", description: "This unit is elite" },
      { 
        name: "Join (Infantry, Orc | Infantry, Varank)", 
        description: "Can join Infantry Orc or Infantry Varank units" 
      },
    ],
    highCommand: true,
    availability: 1,
    imageUrl: "art/card/alborc_card.jpg"
  },
  {
    id: "njord",
    name: "Njord, The Merciless",
    pointsCost: 40,
    faction: "northern-tribes",
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "Varank", description: "This unit has the Varank keyword" },
      { name: "Beserker Rage", description: "This unit has Beserker Rage" },
      { name: "Join (Infantry, Varank)", description: "Can join Infantry Varank units" },
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "art/card/njord_the_merciless_card.jpg"
  },
  {
    id: "new-unit-1",
    name: "New Unit 1",
    pointsCost: 45,
    faction: "northern-tribes",
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "New Keyword", description: "Description of new keyword" },
    ],
    highCommand: false,
    availability: 2,
    imageUrl: "art/card/new_unit_1_card.jpg"
  },
  {
    id: "new-unit-2",
    name: "New Unit 2",
    pointsCost: 55,
    faction: "northern-tribes",
    keywords: [
      { name: "Character", description: "This unit is a character" },
      { name: "Another Keyword", description: "Description of another keyword" },
    ],
    highCommand: true,
    availability: 1,
    imageUrl: "art/card/new_unit_2_card.jpg"
  },
];
