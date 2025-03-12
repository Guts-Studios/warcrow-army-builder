
import { Unit } from "@/types/army";

export const syenannTroops: Unit[] = [
  {
    id: "protectors-of-the-forest",
    name: "Protectors of the Forest",
    pointsCost: 25,
    faction: "syenann",
    keywords: [
      { name: "Elf", description: "" },
      { name: "Infantry", description: "" },
      { name: "Syenann", description: "" }
    ],
    highCommand: false,
    availability: 3,
    imageUrl: "/art/portrait/protectors_of_the_forest_portrait.jpg",
    specialRules: ["Displace (4)"]
  },
  {
    id: "shadows-of-the-yew",
    name: "Shadows of the Yew",
    pointsCost: 35,
    faction: "syenann",
    keywords: [
      { name: "Elf", description: "" },
      { name: "Infantry", description: "" },
      { name: "Shadow", description: "" },
      { name: "Syenann", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Preferred Terrain (Rugged | Forest)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/portrait/shadows_of_the_yew_portrait.jpg",
    specialRules: ["Place (5)"]
  },
  {
    id: "grove-curtailers",
    name: "Grove Curtailers",
    pointsCost: 35,
    faction: "syenann",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Elf", description: "" },
      { name: "Syenann", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 2,
    imageUrl: "/art/portrait/grove_curtailers_portrait.jpg"
  }
];
