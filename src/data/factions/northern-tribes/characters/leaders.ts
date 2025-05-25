
import { Unit } from "@/types/army";

export const northernTribesLeaders: Unit[] = [
  {
    id: "contender",
    name: "Contender",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry, Orc)", description: "" },
      { name: "Raging", description: "" },
    ],
    specialRules: ["Vulnerable", "Shove (5)", "Attract (5)"],
    highCommand: false,
    imageUrl: "/art/card/contender_card.jpg"
  },
  {
    id: "evoker",
    name: "Evoker",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Spellcaster", description: "" },
    ],
    specialRules: ["Intimidating (X)", "Flee", "Slowed"],
    highCommand: false,
    imageUrl: "/art/card/evoker_card.jpg"
  },
  {
    id: "hersir",
    name: "Hersir",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Berserker Rage", description: "" },
      { name: "Fearless", description: "" },
      { name: "Join (Infantry, Varank)", description: "" },
    ],
    specialRules: ["Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/hersir_card.jpg"
  },
  {
    id: "njord-the-merciless",
    name: "Njord, The Merciless",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Berserker Rage", description: "" },
      { name: "Join (Infantry, Varank)", description: "" },
    ],
    specialRules: ["Frightened", "Raging", "Fearless"],
    highCommand: false,
    imageUrl: "/art/card/njord_the_merciless_card.jpg"
  },
  {
    id: "eskold-the-executioner",
    name: "Eskold the Executioner",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Join (Infantry, Varank| Cavalry Warg)", description: "" },
      { name: "Elite", description: "" },
    ],
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/eskold_the_executioner_card.jpg"
  }
];
