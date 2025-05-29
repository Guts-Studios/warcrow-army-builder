
import { Unit } from "@/types/army";

export const contender: Unit = {
  id: "contender",
  name: "Contender",
  pointsCost: 25,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Orc", description: "" },
    { name: "Join (Infantry Orc)", description: "" },
    { name: "Raging", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Vulnerable", "Shove (5)", "Attract (5)"],
  imageUrl: "/art/card/contender_card.jpg"
};
