
import { Unit } from "@/types/army";

export const northernTribesCompanions: Unit[] = [
  {
    id: "coal",
    name: "Coal",
    pointsCost: 20,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Join (Iriavik)", description: "" },
      { name: "Companion", description: "A unit that must be assigned to a specific character or unit type." }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed", "Fix a Die"],
    companion: "iriavik restless pup",
    imageUrl: "/art/card/coal_card.jpg"
  }
];
