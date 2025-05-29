
import { Unit } from "@/types/army";

export const alborc: Unit = {
  id: "alborc",
  name: "Alborc",
  pointsCost: 50,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "High Command", description: "" },
    { name: "Orc", description: "" },
    { name: "Join (Infantry Orc)", description: "" },
    { name: "Join (Infantry Varank)", description: "" },
    { name: "Elite", description: "" }
  ],
  highCommand: true,
  availability: 1,
  command: 3,
  specialRules: ["Vulnerable", "Dispel (D)"],
  imageUrl: "/art/card/alborc_card.jpg"
};
