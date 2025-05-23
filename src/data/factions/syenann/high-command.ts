
import { Unit } from "@/types/army";

export const syenannHighCommand: Unit[] = [
  {
    id: "grand-captain",
    name: "Grand Captain",
    pointsCost: 30,
    faction: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "High Command", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Join (Infantry, Syenann)", description: "" },
      { name: "Preferred Terrain (Rugged | Forest)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    imageUrl: "/art/card/grand_captain_card.jpg",
    specialRules: ["Preferred Terrain"]
  },
  {
    id: "lioslaith-coic-caledhee",
    name: "Lioslaith Coic Caledhee",
    pointsCost: 30,
    faction: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "High Command", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Infantry, Syenann)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 1,
    imageUrl: "/art/card/lioslaith_coic_caledhee_card.jpg",
    specialRules: ["Place (3)", "Vulnerable"]
  }
];
