
import { Unit } from "@/types/army";

export const battle_scarred: Unit = {
  id: "battle_scarred",
  name: "Battle-Scarred",
  pointsCost: 40,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Orc", description: "" },
    { name: "Raging", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Slowed", "Vulnerable", "Frightened", "Disarmed"],
  imageUrl: "/art/card/battle-scarred_card.jpg"
};
