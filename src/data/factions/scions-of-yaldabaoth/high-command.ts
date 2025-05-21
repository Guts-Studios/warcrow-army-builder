
import { Unit } from "@/types/army";

export const scionsOfYaldabaothHighCommand: Unit[] = [
  {
    id: "master-nepharim",
    name: "Master Nepharim",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Darkminded", description: "Darkminded trait" },
      { name: "Elf", description: "Elf race" },
      { name: "Intimidating (2)", description: "Causes strong fear in nearby enemies" },
      { name: "Spellcaster", description: "Can cast spells" },
      { name: "Join (Infantry, Dead Flesh)", description: "Can join Infantry Dead Flesh units" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Place (5)"],
    imageUrl: "/art/card/master_nepharim_card.jpg"
  },
  {
    id: "master-keorl",
    name: "Master Keorl",
    pointsCost: 55,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Darkminded", description: "Darkminded trait" },
      { name: "Human", description: "Human race" },
      { name: "Intimidating (3)", description: "Causes strong fear in nearby enemies" },
      { name: "Spellcaster", description: "Can cast spells" },
      { name: "Join (Infantry, Dead Flesh)", description: "Can join Infantry Dead Flesh units" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Place (5)", "Imbue"],
    imageUrl: "/art/card/master_keorl_card.jpg"
  }
];
