
import { Unit } from "@/types/army";

export const northernTribesHighCommand: Unit[] = [
  {
    id: "chief-of-the-northlands",
    name: "Chief of the Northlands",
    pointsCost: 50,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Orc", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Infantry, Orc)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Fearless", "Raging"],
    imageUrl: "/art/card/chief_of_the_northlands_card.jpg"
  },
  {
    id: "varank-chieftain",
    name: "Varank Chieftain",
    pointsCost: 45,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Varank", description: "" },
      { name: "Join (Infantry, Varank)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Scout", "Preferred Terrain (Rugged)"],
    imageUrl: "/art/card/varank_chieftain_card.jpg"
  }
];
