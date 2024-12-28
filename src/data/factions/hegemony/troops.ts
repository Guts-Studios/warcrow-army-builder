import { Unit } from "../../../types/army";

export const hegemonyTroops: Unit[] = [
  {
    id: "agressors",
    name: "Agressors",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
    ],
    highCommand: false,
    imageUrl: "/art/card/agressors_card.jpg"
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    faction: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 3,
    command: 0,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
    ],
    specialRules: ["Cancel a symbol", "Disarmed", "Shove (2)", "Displace (4)"],
    highCommand: false,
    imageUrl: "/art/card/black_legion_bucklemen_card.jpg"
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Cover", description: "Provides cover" },
      { name: "Immovable", description: "Cannot be moved" },
    ],
    specialRules: ["Shove (3)"],
    highCommand: false,
    imageUrl: "/art/card/bulwarks_card.jpg"
  },
  {
    id: "pioneers",
    name: "Pioneers",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Dwarf", description: "Dwarf race" },
      { name: "Ghent", description: "Ghent faction" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Scout", description: "Has scouting abilities" },
    ],
    specialRules: ["Shove (3)", "Disarmed", "Trap", "Slowed"],
    highCommand: false,
    imageUrl: "/art/card/pioneers_card.jpg"
  }
];