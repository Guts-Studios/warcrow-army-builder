
import { Unit } from "@/types/army";

export const scionsOfYaldabaothHighCommand: Unit[] = [
  {
    id: "master-keorl",
    name: "Master Keorl",
    name_es: "Maestro Keorl",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" },
      { name: "High Command", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Intimidating (2)", description: "" },
      { name: "Spellcaster", description: "" },
      { name: "Join (Infantry, Living Flesh)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Frightened", "Vulnerable", "Dispel (GRN)"],
    tournamentLegal: true,
    imageUrl: "/art/card/master_keorl_card.jpg"
  },
  {
    id: "master-nepharim",
    name: "Master Nepharim",
    name_es: "Maestro Nepharim",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Darkminded", description: "" },
      { name: "Elf", description: "" },
      { name: "High Command", description: "" },
      { name: "Intimidating (2)", description: "" },
      { name: "Spellcaster", description: "" },
      { name: "Join (Infantry, Dead Flesh)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Place (5)"],
    tournamentLegal: true,
    imageUrl: "/art/card/master_nepharim_card.jpg"
  },
  {
    id: "nuada",
    name: "Nuada",
    name_es: "Nuada",
    pointsCost: 55,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Alven", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "High Commander", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Heal", "Bloodlust", "Fearless", "Slowed"],
    tournamentLegal: true,
    imageUrl: "/art/card/nuada_card.jpg"
  },
  {
    id: "progenitor-sculptor",
    name: "Progenitor Sculptor",
    name_es: "Progenitor Escultor",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" },
      { name: "High Command", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Intimidating (2)", description: "" },
      { name: "Spellcaster", description: "" },
      { name: "Join (Infantry Living Flesh)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Frightened", "Vulnerable", "Dispel (GRN)"],
    tournamentLegal: true,
    imageUrl: "/art/card/progenitor_sculptor_card.jpg"
  }
];
