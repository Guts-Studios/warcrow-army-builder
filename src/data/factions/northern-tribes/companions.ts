
import { Unit } from "@/types/army";

export const northernTribesCompanions: Unit[] = [
  {
    id: "coal",
    name: "Coal",
    name_es: "Tizon",
    pointsCost: 20,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Companion", description: "" },
      { name: "Join (Iriavik)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed", "Fix a Die"],
    companion: "iriavik restless pup",
    tournamentLegal: false,
    imageUrl: "/art/card/coal_card.jpg"
  }
];
