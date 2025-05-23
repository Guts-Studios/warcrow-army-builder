
import { Unit } from "@/types/army";

export const scionsOfYaldabaothHighCommand: Unit[] = [
  // Master Keorl
  {
    id: "master_keorl",
    name: "Master Keorl",
    faction: "scions-of-yaldabaoth",
    pointsCost: 50,
    availability: 1,
    highCommand: true,
    command: 3,
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" },
      { name: "High Command", description: "" },
      { name: "Living Flesh", description: "" }
    ],
    specialRules: ["Intimidating (2)", "Spellcaster", "Join (Infantry, Living Flesh)"],
    imageUrl: "/art/card/master_keorl_card.jpg"
  },
  // Master Nepharim
  {
    id: "master_nepharim",
    name: "Master Nepharim",
    faction: "scions-of-yaldabaoth",
    pointsCost: 50,
    availability: 1,
    highCommand: true,
    command: 3,
    keywords: [
      { name: "Character", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Darkminded", description: "" },
      { name: "Elf", description: "" },
      { name: "High Command", description: "" }
    ],
    specialRules: ["Intimidating (2)", "Spellcaster", "Join (Infantry, Dead Flesh)"],
    imageUrl: "/art/card/master_nepharim_card.jpg"
  },
  // Nuada
  {
    id: "nuada",
    name: "Nuada",
    faction: "scions-of-yaldabaoth",
    pointsCost: 55,
    availability: 1,
    highCommand: true,
    command: 3,
    keywords: [
      { name: "Alven", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "High Commander", description: "" }
    ],
    specialRules: ["Elite"],
    imageUrl: "/art/card/nuada_card.jpg"
  },
  // Progenitor Sculptor
  {
    id: "progenitor_sculptor",
    name: "Progenitor Sculptor",
    faction: "scions-of-yaldabaoth",
    pointsCost: 30,
    availability: 1,
    highCommand: true,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" },
      { name: "High Command", description: "" },
      { name: "Living Flesh", description: "" }
    ],
    specialRules: ["Intimidating (2)", "Spellcaster", "Join (Infantry, Living Flesh)"],
    imageUrl: "/art/card/progenitor_sculptor_card.jpg"
  }
  // Marhael The Refused has been removed as he belongs to Hegemony faction
];
