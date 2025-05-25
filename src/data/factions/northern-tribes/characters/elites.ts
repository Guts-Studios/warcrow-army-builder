
import { Unit } from "@/types/army";

export const northernTribesElites: Unit[] = [
  {
    id: "prime-warrior",
    name: "Prime Warrior",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry, Orc)", description: "" },
      { name: "Raging", description: "" },
    ],
    specialRules: ["Frightened", "Vulnerable", "Slowed", "Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/prime_warrior_card.jpg"
  },
  {
    id: "ormuk",
    name: "Ormuk",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Orc", description: "" },
      { name: "Bloodlust", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Raging", description: "" },
    ],
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/ormuk_card.jpg"
  },
  {
    id: "revenant",
    name: "Revenant",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Immovable", description: "" },
      { name: "Intimidating (1)", description: "" },
    ],
    specialRules: ["Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/revenant_card.jpg"
  }
];
