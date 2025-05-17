
import { Unit } from "@/types/army";

export const hegemonyCharactersLeaders: Unit[] = [
  {
    id: "grand-captain",
    name: "Grand Captain",
    pointsCost: 45,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Leader", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Inspire"],
    imageUrl: "/art/card/grand_captain_card.jpg"
  }
];
