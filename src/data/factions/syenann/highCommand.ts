
import { Unit } from "@/types/army";

export const syenannHighCommand: Unit[] = [
  {
    id: "grand-captain",
    name: "Grand Captain",
    pointsCost: 30,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "High Command", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Join (Infantry, Syenann)", description: "Can join Infantry Syenann units" },
      { name: "Preferred Terrain (Rugged | Forest)", description: "Gains bonuses in rugged or forest terrain" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Preferred Terrain"],
    imageUrl: "/art/card/grand_captain_card.jpg"
  },
  {
    id: "lioslaith-coic-caledhee",
    name: "Lioslaith Coic Caledhee",
    pointsCost: 30,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "High Command", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Infantry, Syenann)", description: "Can join Infantry Syenann units" }
    ],
    highCommand: true,
    availability: 1,
    command: 1,
    specialRules: ["Place (3)", "Vulnerable"],
    imageUrl: "/art/card/lioslaith_coic_caledhee_card.jpg"
  }
];
