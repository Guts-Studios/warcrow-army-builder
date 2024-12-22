import { Unit } from "../../../types/army";

export const northernTribesTroops: Unit[] = [
  {
    id: "pioneers",
    name: "Pioneers",
    pointsCost: 110,
    faction: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Melee", description: "Specializes in close combat" },
    ],
    availability: 3,
    highCommand: false,
    imageUrl: "/src/art/card/Pioneers_card.jpg"
  }
];