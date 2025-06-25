
import { Unit } from "@/types/army";

export const syenannTroops: Unit[] = [
  {
    id: "grove-curtailers",
    name: "Grove Curtailers",
    name_es: "Atajadores De La Algaba",
    pointsCost: 35,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Elf", description: "" },
      { name: "Syenann", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: ["Disarmed"],
    tournamentLegal: true,
    imageUrl: "/art/card/grove_curtailers_card.jpg"
  },
  {
    id: "protectors-of-the-forest",
    name: "Protectors of the Forest",
    name_es: "Protectores De La Foresta",
    pointsCost: 25,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Elf", description: "" },
      { name: "Infantry", description: "" },
      { name: "Syenann", description: "" }
    ],
    highCommand: false,
    availability: 3,
    command: 0,
    specialRules: ["Displace (4)"],
    tournamentLegal: true,
    imageUrl: "/art/card/protectors_of_the_forest_card.jpg"
  },
  {
    id: "shadows-of-the-yew",
    name: "Shadows of the Yew",
    name_es: "Sombras Del Tejo",
    pointsCost: 35,
    faction: "syenann",
    faction_id: "syenann",
    keywords: [
      { name: "Elf", description: "" },
      { name: "Infantry", description: "" },
      { name: "Shadow", description: "" },
      { name: "Syenann", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Preferred Terrain (Rugged or Forest)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Place (5)"],
    tournamentLegal: true,
    imageUrl: "/art/card/shadows_of_the_yew_card.jpg"
  }
];
