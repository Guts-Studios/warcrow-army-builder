
import { Unit } from "@/types/army";

export const syenannCharacters: Unit[] = [
  {
    id: "alula",
    name: "Alula",
    pointsCost: 20,
    faction: "syenann",
    faction_id: "syenann",
    characteristics: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
    ],
    keywords: [],
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
    characteristics: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" }
    ],
    keywords: [
      { name: "Join (Infantry, Synann)", description: "Can join Infantry Syenann units" },
      { name: "Spellcaster", description: "Can cast spells" }
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
    characteristics: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" }
    ],
    keywords: [
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
    characteristics: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Syenann", description: "" }
    ],
    keywords: [
      { name: "Spellcaster", description: "Can cast spells" }
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
    characteristics: [
      { name: "Ashen", description: "" },
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Elf", description: "" },
      { name: "Nemourous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Tinge", description: "" }
    ],
    keywords: [
      { name: "Intimidating (1)", description: "Causes fear in nearby enemies" },
      { name: "Spellcaster", description: "Can cast spells" }
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
    characteristics: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Mercenary", description: "Can be hired by different factions" }
    ],
    keywords: [
      { name: "Ambusher", description: "Has ambush abilities" }
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
    characteristics: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Syenann", description: "" }
    ],
    keywords: [
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Place (10)", "Shove (4)"],
    imageUrl: "/art/card/ynyr_dara_lainn_card.jpg"
  }
];
