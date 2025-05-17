
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigSupports: Unit[] = [
  {
    id: "technician-adept",
    name: "Technician Adept",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Repair"],
    imageUrl: "/art/card/technician_adept_card.jpg"
  },
  {
    id: "psychic-nullifier",
    name: "Psychic Nullifier",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Psychic Shield"],
    imageUrl: "/art/card/psychic_nullifier_card.jpg"
  },
  {
    id: "auxiliary-medic",
    name: "Auxiliary Medic",
    pointsCost: 25,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Medic"],
    imageUrl: "/art/card/auxiliary_medic_card.jpg"
  }
];
