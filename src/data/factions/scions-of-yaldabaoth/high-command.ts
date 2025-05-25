
import { Unit } from "@/types/army";

export const scionsOfYaldabaothHighCommand: Unit[] = [
  {
    id: "master-keorl",
    name: "Master Keorl",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Darkminded", description: "Darkminded trait" },
      { name: "High Command", description: "High command unit" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Intimidating (2)", description: "Causes strong fear in nearby enemies" },
      { name: "Spellcaster", description: "Can cast spells" },
      { name: "Join (Infantry, Living Flesh)", description: "Can join Infantry Living Flesh units" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Frightened", "Vulnerable", "Dispel (GRN)"],
    imageUrl: "/art/card/master_keorl_card.jpg"
  },
  {
    id: "progenitor-sculptor",
    name: "Progenitor Sculptor",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Darkminded", description: "Darkminded trait" },
      { name: "High Command", description: "High command unit" }, 
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Intimidating (2)", description: "Causes fear in nearby enemies" },
      { name: "Spellcaster", description: "Can cast spells" },
      { name: "Join (Infantry, Living Flesh)", description: "Can join Infantry Living Flesh units" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Frightened", "Vulnerable", "Dispel (GRN)"],
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
      { name: "Elf", description: "Elf race" },
      { name: "High Commander", description: "High command unit" },
      { name: "Elite", description: "Elite unit" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Heal", "Bloodlust", "Fearless", "Slowed"],
    imageUrl: "/art/card/nuada_card.jpg"
  }
];
