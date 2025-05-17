
import { Unit } from "@/types/army";

export const hegemonyCharactersSpecialists: Unit[] = [
  {
    id: "pioneer",
    name: "Pioneer",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Specialist", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Engineer"],
    imageUrl: "/art/card/pioneers_card.jpg"
  }
];
