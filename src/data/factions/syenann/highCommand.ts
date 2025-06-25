
import { Unit } from "@/types/army";

export const syenannHighCommand: Unit[] = [
  {
    id: "grand_captain",
    name: "Grand Captain",
    name_es: "Gran Capitan",
    pointsCost: 30,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "High Command", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Syenann", description: "" },
      { name: "Join (Infantry Syenann)", description: "" },
      { name: "Preferred Terrain (Rugged or Forest)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Preferred Terrain"],
    tournamentLegal: true,
    imageUrl: "/art/card/grand_captain_card.jpg"
  },
  {
    id: "lioslaith_coic_caledhee",
    name: "Lioslaith Coic Caledhee",
    name_es: "Lioslaith Coic Caledhee",
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
      { name: "Join (Infantry Syenann)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 1,
    specialRules: ["Place (3)", "Vulnerable"],
    tournamentLegal: true,
    imageUrl: "/art/card/lioslaith_coic_caledhee_card.jpg"
  }
];
