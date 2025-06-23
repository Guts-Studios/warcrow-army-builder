
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
      { name: "Character", category: "unit_type" },
      { name: "Infantry", category: "unit_type" },
      { name: "Syenann", category: "faction" },
      { name: "Aim", category: "ability" },
      { name: "Join (Infantry, Syenann)", category: "ability" }
    ],
    specialRules: [
      { name: "Repeat a Die", category: "ability" }
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
      { name: "Character", category: "unit_type" },
      { name: "Infantry", category: "unit_type" },
      { name: "Nemorous", category: "trait" },
      { name: "Syenann", category: "faction" },
      { name: "Elite", category: "quality" },
      { name: "Join (Syena Wardens)", category: "ability" }
    ],
    specialRules: [
      { name: "Place (5)", category: "ability" },
      { name: "Shove (5)", category: "ability" },
      { name: "Repeat a Die", category: "ability" },
      { name: "Disarmed", category: "condition" }
    ],
    characteristics: []
  }
];
