
import { Unit } from "@/types/army";

export const wisemane: Unit = {
  id: "wisemane",
  name: "Wisemane",
  pointsCost: 15,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Orc", description: "" },
    { name: "Fearless", description: "" },
    { name: "Join (Infantry Orc)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Vulnerable", "Fix a Die"],
  imageUrl: "/art/card/wisemane_card.jpg"
};
