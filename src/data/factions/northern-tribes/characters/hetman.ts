
import { Unit } from "@/types/army";

export const hetman: Unit = {
  id: "hetman",
  name: "Hetman",
  pointsCost: 20,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Orc", description: "" },
    { name: "Join (Infantry Orc)", description: "" }
  ],
  highCommand: false,
  availability: 2,
  command: 1,
  specialRules: [],
  imageUrl: "/art/card/hetman_card.jpg"
};
