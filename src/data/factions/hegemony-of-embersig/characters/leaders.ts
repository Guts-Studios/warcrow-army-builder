
import { Unit } from "@/types/army";

export const hegemonyCharactersLeaders: Unit[] = [
  {
    id: "hetman",
    name: "Hetman",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Human", description: "Human race" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    highCommand: true,
    imageUrl: "/art/card/hetman_card.jpg"
  },
  {
    id: "corporal",
    name: "Corporal",
    faction: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Human, Infantry)", description: "Can join Human Infantry units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/corporal_card.jpg"
  }
];
