import { Unit } from "../../../types/army";

export const syenannCharacters: Unit[] = [
  {
    id: "alula",
    name: "Alula",
    faction: "syenann",
    faction_id: "syenann",
    pointsCost: 20,
    availability: 1,
    command: 1,
    highCommand: false,
    keywords: [
      { name: "Character", category: "unit_type" },
      { name: "Elf", category: "race" }
    ],
    specialRules: [
      { name: "Disarmed", category: "condition" }
    ],
    characteristics: []
  },
  {
    id: "aoidos",
    name: "Aoidos",
    faction: "syenann",
    faction_id: "syenann",
    pointsCost: 20,
    availability: 1,
    command: 0,
    highCommand: false,
    keywords: [
      { name: "Character", category: "unit_type" },
      { name: "Elf", category: "race" },
      { name: "Nemorous", category: "trait" },
      { name: "Syenann", category: "faction" },
      { name: "Join (Infantry Synann)", category: "ability" },
      { name: "Spellcaster", category: "ability" }
    ],
    specialRules: [
      { name: "Vulnerable", category: "condition" },
      { name: "Slowed", category: "condition" },
      { name: "Disarmed", category: "condition" },
      { name: "Frightened", category: "condition" }
    ],
    characteristics: []
  },
  {
    id: "druid",
    name: "Druid",
    faction: "syenann",
    faction_id: "syenann",
    pointsCost: 25,
    availability: 1,
    command: 0,
    highCommand: false,
    keywords: [
      { name: "Character", category: "unit_type" },
      { name: "Elf", category: "race" },
      { name: "Spellcaster", category: "ability" },
      { name: "Syenann", category: "faction" }
    ],
    specialRules: [
      { name: "Slowed", category: "condition" }
    ],
    characteristics: []
  },
  {
    id: "syenann-captain",
    name: "Syenann Captain",
    faction: "syenann",
    faction_id: "syenann",
    pointsCost: 20,
    availability: 1,
    command: 1,
    highCommand: false,
    keywords: [
      "Character",
      "Infantry", 
      "Syenann",
      "Aim",
      "Join (Infantry, Syenann)"
    ],
    specialRules: [
      "Repeat a Die"
    ],
    characteristics: []
  },
  {
    id: "warden-captain",
    name: "Warden Captain",
    faction: "syenann",
    faction_id: "syenann",
    pointsCost: 30,
    availability: 1,
    command: 1,
    highCommand: false,
    keywords: [
      "Character",
      "Infantry",
      "Nemorous",
      "Syenann",
      "Elite",
      "Join (Syena Wardens)"
    ],
    specialRules: [
      "Place (5)",
      "Shove (5)",
      "Repeat a Die",
      "Disarmed"
    ],
    characteristics: []
  }
];
