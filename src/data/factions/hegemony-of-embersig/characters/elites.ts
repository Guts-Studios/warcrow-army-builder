
import { Unit } from "@/types/army";

export const hegemonyCharactersElites: Unit[] = [
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Ranged Attack"],
    imageUrl: "/art/card/black_legion_arquebusiers_card.jpg"
  }
];
