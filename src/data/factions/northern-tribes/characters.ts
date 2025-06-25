
import { Unit } from "@/types/army";

export const northernTribesCharacters: Unit[] = [
  {
    id: "contender",
    name: "Contender",
    name_es: "Contendiente",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry Orc)", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Vulnerable", "Shove (5)", "Attract (5)"],
    tournamentLegal: true,
    imageUrl: "/art/card/contender_card.jpg"
  },
  {
    id: "darkmaster",
    name: "Darkmaster",
    name_es: "Amo De La Oscuridad",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK BLK)", description: "" },
      { name: "Join (Hunters)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Scout", "Disarmed"],
    tournamentLegal: true,
    imageUrl: "/art/card/darkmaster_card.jpg"
  },
  {
    id: "evoker",
    name: "Evoker",
    name_es: "Evocador",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Intimidating (X)", "Flee", "Slowed"],
    tournamentLegal: true,
    imageUrl: "/art/card/evoker_card.jpg"
  },
  {
    id: "hersir",
    name: "Hersir",
    name_es: "Hersir",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Beserker Rage", description: "" },
      { name: "Fearless", description: "" },
      { name: "Join (Infantry Varank)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Disarmed"],
    tournamentLegal: true,
    imageUrl: "/art/card/hersir_card.jpg"
  },
  {
    id: "prime-warrior",
    name: "Prime Warrior",
    name_es: "Guerrero Cenit",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry Orc)", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Frightened", "Vulnerable", "Slowed", "Disarmed"],
    tournamentLegal: true,
    imageUrl: "/art/card/prime_warrior_card.jpg"
  },
  {
    id: "revenant",
    name: "Revenant",
    name_es: "Ya Muerto",
    pointsCost: 40,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Immovable", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Vulnerable"],
    tournamentLegal: true,
    imageUrl: "/art/card/revenant_card.jpg"
  },
  {
    id: "tattooist",
    name: "Tattooist",
    name_es: "Tatuadora",
    pointsCost: 15,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Join (Infantry Varank)", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    tournamentLegal: true,
    imageUrl: "/art/card/tattooist_card.jpg"
  },
  {
    id: "wisemane",
    name: "Wisemane",
    name_es: "Pelaje De Sabiduria",
    pointsCost: 15,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Fearless", description: "" },
      { name: "Join (Infantry Orc)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Vulnerable", "Fix a Die"],
    tournamentLegal: true,
    imageUrl: "/art/card/wisemane_card.jpg"
  },
  {
    id: "eskold-the-executioner",
    name: "Eskold the Executioner",
    name_es: "Eskold El Ejecutor",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Join (Infantry Varank)", description: "" },
      { name: "Join (Calvary Warg)", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    tournamentLegal: true,
    imageUrl: "/art/card/eskold_the_executioner_card.jpg"
  },
  {
    id: "lotta",
    name: "Lotta",
    name_es: "Lotta",
    pointsCost: 25,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry Orc)", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Disarmed", "Slowed", "Vulnerable", "Displaced (X)", "Placed (X)"],
    tournamentLegal: true,
    imageUrl: "/art/card/lotta_card.jpg"
  },
  {
    id: "njord-the-merciless",
    name: "Njord, The Merciless",
    name_es: "Njord, El Despiadado",
    pointsCost: 40,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Beserker Rage", description: "" },
      { name: "Join (Infantry Varank)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 2,
    specialRules: ["Frightened", "Raging", "Fearless"],
    tournamentLegal: true,
    imageUrl: "/art/card/njord_the_merciless_card.jpg"
  },
  {
    id: "selika",
    name: "Selika",
    name_es: "Selika",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Join (Infantry Varank)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    tournamentLegal: true,
    imageUrl: "/art/card/selika_card.jpg"
  }
];
