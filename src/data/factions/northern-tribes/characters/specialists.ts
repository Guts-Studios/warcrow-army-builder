
import { Unit } from "@/types/army";

export const northernTribesSpecialists: Unit[] = [
  {
    id: "iriavik-restless-pup",
    name: "Iriavik Restless Pup",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Varank", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" },
    ],
    specialRules: ["Slowed", "Place (3)", "Immune to State", "Frightened"],
    highCommand: false,
    imageUrl: "/art/card/iriavik_restless_pup_card.jpg"
  },
  {
    id: "lotta",
    name: "Lotta",
    faction: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry, Orc)", description: "" },
      { name: "Raging", description: "" },
    ],
    specialRules: ["Disarmed", "Slowed", "Vulnerable", "Displace (X)", "Place (X)"],
    highCommand: false,
    imageUrl: "/art/card/lotta_card.jpg"
  },
  {
    id: "selika",
    name: "Selika",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Varank", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Join (Infantry, Varank)", description: "" },
    ],
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/selika_card.jpg"
  }
];
