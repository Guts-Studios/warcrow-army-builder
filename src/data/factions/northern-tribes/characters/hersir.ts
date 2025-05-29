
import { Unit } from "@/types/army";

export const hersir: Unit = {
  id: "hersir",
  name: "Hersir",
  pointsCost: 25,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Varank", description: "" },
    { name: "Beserker Rage", description: "" },
    { name: "Fearless", description: "" },
    { name: "Join (Infantry Varank)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Disarmed"],
  imageUrl: "/art/card/hersir_card.jpg"
};
