
import { Unit } from "@/types/army";
import { vercana } from "./characters/vercana";

export const scionsOfYaldabaothCharacters: Unit[] = [
  {
    id: "master-keorl",
    name: "Master Keorl",
    pointsCost: 40,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Character", description: "Character unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Elite", description: "Elite unit" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Command (1)", "Repeat a Die"],
    imageUrl: "/art/card/master_keorl_card.jpg"
  },
  {
    id: "progenitor-sculptor",
    name: "Progenitor Sculptor",
    pointsCost: 45,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Character", description: "Character unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Elite", description: "Elite unit" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Place (6)", "Repeat a Die"],
    imageUrl: "/art/card/progenitor_sculptor_card.jpg"
  },
  {
    id: "nuada",
    name: "Nuada",
    pointsCost: 55,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Alven", description: "Alven race" },
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Heal", "Bloodlust", "Fearless", "Slowed"],
    imageUrl: "/art/card/nuada_card.jpg"
  },
  vercana
];
