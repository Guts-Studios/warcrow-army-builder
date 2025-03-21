
import { Unit } from "@/types/army";

export const scionsOfYaldabaothHighCommand: Unit[] = [
  {
    id: "nuada",
    name: "Nuada",
    pointsCost: 55,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Alven", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "High Commander", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: true,
    availability: 1,
    specialRules: ["Heal", "Bloodlust", "Fearless", "Slowed"],
    command: 3,
    imageUrl: "/art/card/nuada_card.jpg"
  },
  {
    id: "master-keorl",
    name: "Master Keorl",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
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
    specialRules: ["Frightened", "Vulnerable", "Dispel (GRN)"],
    command: 3,
    imageUrl: "/art/card/master_keorl_card.jpg"
  },
  {
    id: "master-nepharim",
    name: "Master Nepharim",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
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
    specialRules: ["Place (5)"],
    command: 3,
    imageUrl: "/art/card/master_nepharim_card.jpg"
  }
];
