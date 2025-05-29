
import { Unit } from "@/types/army";

export const prime_warrior: Unit = {
  id: "prime_warrior",
  name: "Prime Warrior",
  pointsCost: 30,
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
  specialRules: ["Frightened", "Vulnerable", "Slowed", "Disarmed"],
  imageUrl: "/art/card/prime_warrior_card.jpg"
};
