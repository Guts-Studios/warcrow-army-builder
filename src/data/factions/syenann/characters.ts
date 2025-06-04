import { Unit } from "@/types/army";

export const syenannCharacters: Unit[] = [
  {
    id: "alula",
    name: "Alula",
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
    imageUrl: "/art/card/alula_card.jpg"
  },
  {
    id: "aoidos",
    name: "Aoidos",
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
    imageUrl: "/art/card/aoidos_card.jpg"
  },
  {
    id: "darach-wilding",
    name: "Darach Wilding",
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
    imageUrl: "/art/card/darach_wilding_card.jpg"
  },
  {
    id: "druid",
    name: "Druid",
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
    imageUrl: "/art/card/druid_card.jpg"
  },
  {
    id: "oona",
    name: "Oona",
    pointsCost: 25,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Ashen", description: "" },
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Elf", description: "" },
      { name: "Nemourous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Intimidating (1)", description: "" },
      { name: "Spellcaster", description: "" },
      { name: "Tinge", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed"],
    imageUrl: "/art/card/oona_card.jpg"
  },
  {
    id: "vercana-syenann",
    name: "Vercana",
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
    imageUrl: "/art/card/vercana_card.jpg"
  },
  {
    id: "ynyr-dara-lainn",
    name: "Ynyr Dara Lainn",
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
    imageUrl: "/art/card/ynyr_dara_lainn_card.jpg"
  }
];
