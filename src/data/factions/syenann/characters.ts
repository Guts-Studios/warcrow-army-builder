
import { Unit } from "@/types/army";
import { vercana } from "./characters/vercana";

export const syenannCharacters: Unit[] = [
  vercana,
  {
    id: "aoidos",
    name: "Aoidos",
    pointsCost: 20,
    faction: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Join (Infantry, Synann)", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/card/aoidos_card.jpg",
    specialRules: ["Vulnerable", "Slowed", "Disarmed", "Frightened"]
  },
  {
    id: "druid",
    name: "Druid",
    pointsCost: 25,
    faction: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Spellcaster", description: "" },
      { name: "Syenann", description: "" }
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/card/druid_card.jpg",
    specialRules: ["Slowed"]
  },
  {
    id: "ynyr-dara-lainn",
    name: "Ynyr Dara Lainn",
    pointsCost: 35,
    faction: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Syenann", description: "" },
      { name: "Scout", description: "" },
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    imageUrl: "/art/card/ynyr_dara_lainn_card.jpg",
    specialRules: ["Place (10)", "Shove (4)"]
  },
  {
    id: "alula",
    name: "Alula",
    pointsCost: 20,
    faction: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Syenann", description: "" },
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    imageUrl: "/art/card/alula_card.jpg",
    specialRules: ["Disarmed"],
  },
  {
    id: "darach-wildling",
    name: "Darach Wilding",
    pointsCost: 35,
    faction: "syenann",
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
    imageUrl: "/art/card/darach_wildling_card.jpg",
    specialRules: []
  },
  {
    id: "oona",
    name: "Oona",
    pointsCost: 25,
    faction: "syenann",
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
    imageUrl: "/art/card/oona_card.jpg",
    specialRules: ["Slowed"]
  }
];
