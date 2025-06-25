
import { Unit } from "@/types/army";

export const syenannCharacters: Unit[] = [
  {
    id: "alula",
    name: "Alula",
    name_es: "Alula",
    pointsCost: 20,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Disarmed"],
    tournamentLegal: true,
    imageUrl: "/art/card/alula_card.jpg"
  },
  {
    id: "aoidos",
    name: "Aoidos",
    name_es: "Aedo",
    pointsCost: 20,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Join (Infantry Synann)", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Vulnerable", "Slowed", "Disarmed", "Frightened"],
    tournamentLegal: true,
    imageUrl: "/art/card/aoidos_card.jpg"
  },
  {
    id: "darach-wildling",
    name: "Darach Wildling",
    name_es: "Darach Brutamontes",
    pointsCost: 35,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Aim", description: "" },
      { name: "Ambusher", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    tournamentLegal: false,
    imageUrl: "/art/card/darach_wildling_card.jpg"
  },
  {
    id: "druid",
    name: "Druid",
    name_es: "Druida",
    pointsCost: 25,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Spellcaster", description: "" },
      { name: "Syenann", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed"],
    tournamentLegal: true,
    imageUrl: "/art/card/druid_card.jpg"
  },
  {
    id: "oona",
    name: "Oona",
    name_es: "Oona",
    pointsCost: 25,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Ashen", description: "" },
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Elf", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Intimidating (1)", description: "" },
      { name: "Spellcaster", description: "" },
      { name: "Tinge", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed"],
    tournamentLegal: false,
    imageUrl: "/art/card/oona_card.jpg"
  },
  {
    id: "syenann-captain",
    name: "Syenann Captain",
    name_es: "Capitan Syenann",
    pointsCost: 20,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Infantry", description: "" },
      { name: "Syenann", description: "" },
      { name: "Aim", description: "" },
      { name: "Join (Infantry, Syenann)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Repeat a Die"],
    tournamentLegal: true,
    imageUrl: "/art/card/syenann_captain_card.jpg"
  },
  {
    id: "vercana",
    name: "Vercana",
    name_es: "Vercana",
    pointsCost: 30,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Mercenary", description: "" },
      { name: "Ambusher", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Place (5)"],
    tournamentLegal: false,
    imageUrl: "/art/card/vercana_card.jpg"
  },
  {
    id: "warden-captain",
    name: "Warden Captain",
    name_es: "Capitan Custodio",
    pointsCost: 30,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Infantry", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Syena Wardens)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Place (5)", "Shove (5)", "Repeat a Die", "Disarmed"],
    tournamentLegal: true,
    imageUrl: "/art/card/warden_captain_card.jpg"
  },
  {
    id: "ynyr-dara-lainn",
    name: "Ynyr Dara Lainn",
    name_es: "Ynyr Dara Lainn",
    pointsCost: 35,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Syenann", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Place (10)", "Shove (4)"],
    tournamentLegal: true,
    imageUrl: "/art/card/ynyr_dara_lainn_card.jpg"
  }
];
