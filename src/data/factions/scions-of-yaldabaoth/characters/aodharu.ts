import { Unit } from "@/types/army";

export const aodharu: Unit = {
  id: "aodharu",
  name: "Aodharu",
  name_es: "Aodharu",
  pointsCost: 30,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Dead Flesh", description: "" },
    { name: "Risen", description: "" },
    { name: "Bloodlust", description: "" },
    { name: "Dispel (BLK BLK)", description: "" },
    { name: "Golem", description: "" },
    { name: "Intimidating (2)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Frightened"],
  tournamentLegal: true,
  imageUrl: "/art/card/aodharu_card.jpg"
};