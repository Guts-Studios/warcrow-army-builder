
import { Unit } from "@/types/army";

export const wrathmane: Unit = {
  id: "wrathmane",
  name: "Wrathmane",
  pointsCost: 30,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "High Command", description: "" },
    { name: "Orc", description: "" },
    { name: "Join (Infantry Orc)", description: "" },
    { name: "Elite", description: "" },
    { name: "Raging", description: "" }
  ],
  highCommand: true,
  availability: 1,
  command: 2,
  specialRules: ["Vulnerable", "Frightened", "Disarmed", "Displace (3)"],
  imageUrl: "/art/card/wrathmane_card.jpg"
};
