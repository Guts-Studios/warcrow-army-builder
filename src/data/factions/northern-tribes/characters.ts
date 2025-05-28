
import { Unit } from "@/types/army";

export const northernTribesCharacters: Unit[] = [
  {
    id: "contender",
    name: "Contender",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Join (Infantry Orc)", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Vulnerable", "Shove (5)", "Attract (5)"],
    imageUrl: "/art/card/contender_card.jpg"
  },
  {
    id: "darkmaster",
    name: "Darkmaster",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK BLK)", description: "" },
      { name: "Join (Hunters)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Scout", "Disarmed"],
    imageUrl: "/art/card/darkmaster_card.jpg"
  },
  {
    id: "eskold-the-executioner",
    name: "Eskold the Executioner",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." },
      { name: "Join (Infantry Varank)", description: "" },
      { name: "Join (Calvary Warg)", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: [],
    imageUrl: "/art/card/eskold-the-executioner_card.jpg"
  },
  {
    id: "evoker",
    name: "Evoker",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Intimidating (X)", "Flee", "Slowed"],
    imageUrl: "/art/card/evoker_card.jpg"
  },
  {
    id: "hersir",
    name: "Hersir",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." },
      { name: "Beserker Rage", description: "" },
      { name: "Fearless", description: "" },
      { name: "Join (Infantry Varank)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Disarmed"],
    imageUrl: "/art/card/hersir_card.jpg"
  },
  {
    id: "lotta",
    name: "Lotta",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Join (Infantry Orc)", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Disarmed", "Slowed", "Vulnerable", "Displaced (X)", "Placed (X)"],
    imageUrl: "/art/card/lotta_card.jpg"
  },
  {
    id: "njord-the-merciless",
    name: "Njord, The Merciless",
    pointsCost: 40,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." },
      { name: "Beserker Rage", description: "" },
      { name: "Join (Infantry Varank)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 2,
    specialRules: ["Frightened", "Raging", "Fearless"],
    imageUrl: "/art/card/njord-the-merciless_card.jpg"
  },
  {
    id: "ormuk",
    name: "Ormuk",
    pointsCost: 35,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Colossal Company", description: "" },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Bloodlust", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: [],
    imageUrl: "/art/card/ormuk_card.jpg"
  },
  {
    id: "prime-warrior",
    name: "Prime Warrior",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Join (Infantry Orc)", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Frightened", "Vulnerable", "Slowed", "Disarmed"],
    imageUrl: "/art/card/prime-warrior_card.jpg"
  },
  {
    id: "revenant",
    name: "Revenant",
    pointsCost: 40,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Immovable", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Vulnerable"],
    imageUrl: "/art/card/revenant_card.jpg"
  },
  {
    id: "selika",
    name: "Selika",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." },
      { name: "Ambusher", description: "" },
      { name: "Join (Infantry Varank)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    imageUrl: "/art/card/selika_card.jpg"
  },
  {
    id: "tattoist",
    name: "Tattoist",
    pointsCost: 15,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." },
      { name: "Join (Infantry Varank)", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    imageUrl: "/art/card/tattoist_card.jpg"
  },
  {
    id: "vercana",
    name: "Vercana",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Mercenary", description: "" },
      { name: "Ambusher", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Place (5)"],
    imageUrl: "/art/card/vercana_card.jpg"
  },
  {
    id: "wisemane",
    name: "Wisemane",
    pointsCost: 15,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Fearless", description: "" },
      { name: "Join (Infantry Orc)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Vulnerable", "Fix a Die"],
    imageUrl: "/art/card/wisemane_card.jpg"
  },
  {
    id: "wrathmane",
    name: "Wrathmane",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "High Command", description: "Characters with this characteristic automatically become your commander when included in your company." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." },
      { name: "Join (Infantry Orc)", description: "" },
      { name: "Elite", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Vulnerable", "Frightened", "Disarmed", "Displace (3)"],
    imageUrl: "/art/card/wrathmane_card.jpg"
  },
  {
    id: "iriavik-restless-pup",
    name: "Iriavik Restless Pup",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Colossal Company", description: "" },
      { name: "Nemorous", description: "Connected to the primal forces of nature." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Slowed", "Place (3)", "Immune to State", "Frightened"],
    imageUrl: "/art/card/iriavik-restless-pup_card.jpg"
  }
];
