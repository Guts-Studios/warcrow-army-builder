
import { Unit } from "@/types/army";

export const lotta: Unit = {
  id: "lotta",
  name: "Lotta",
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
  specialRules: ["Disarmed", "Slowed", "Vulnerable", "Displaced (X)", "Placed (X)"],
  imageUrl: "/art/card/lotta_card.jpg"
};
