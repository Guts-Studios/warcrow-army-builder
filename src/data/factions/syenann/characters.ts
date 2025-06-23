
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
      "Character",
      "Elf"
    ],
    specialRules: [
      "Disarmed"
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
      "Character",
      "Elf",
      "Nemorous",
      "Syenann",
      "Join (Infantry Synann)",
      "Spellcaster"
    ],
    specialRules: [
      "Vulnerable",
      "Slowed",
      "Disarmed",
      "Frightened"
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
      "Character",
      "Elf",
      "Spellcaster",
      "Syenann"
    ],
    specialRules: [
      "Slowed"
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
