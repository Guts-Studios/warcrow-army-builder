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
  },
  {
    id: "warriors",
    name: "Warriors",
    pointsCost: 100,
    faction: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Melee", description: "Specializes in close combat" },
    ],
    availability: 5,
    highCommand: false,
    imageUrl: "/src/art/card/Warriors_card.jpg"
  },
  {
    id: "archers",
    name: "Archers",
    pointsCost: 90,
    faction: "northern-tribes",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Ranged", description: "Specializes in ranged combat" },
    ],
    availability: 4,
    highCommand: false,
    imageUrl: "/src/art/card/Archers_card.jpg"
  },
  {
    id: "cavalry",
    name: "Cavalry",
    pointsCost: 120,
    faction: "northern-tribes",
    keywords: [
      { name: "Cavalry", description: "Fast moving unit type" },
      { name: "Melee", description: "Specializes in close combat" },
    ],
    availability: 2,
    highCommand: false,
    imageUrl: "/src/art/card/Cavalry_card.jpg"
  }
];
