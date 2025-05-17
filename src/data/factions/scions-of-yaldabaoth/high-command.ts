
import { Unit } from "@/types/army";

export const scionsOfYaldabaothHighCommand: Unit[] = [
  {
    id: "master-nepharim",
    name: "Master Nepharim",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Character", description: "Character unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Elite", description: "Elite unit" },
      { name: "Intimidating (1)", description: "Causes fear in nearby enemies" }
    ],
    highCommand: true,
    availability: 1,
    specialRules: ["Command (2)", "Repeat a Die"],
    command: 2,
    imageUrl: "/art/card/master_nepharim_card.jpg"
  }
];
