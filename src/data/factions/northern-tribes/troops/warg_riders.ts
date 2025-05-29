
import { Unit } from "@/types/army";

export const warg_riders: Unit = {
  id: "warg_riders",
  name: "Warg Riders",
  pointsCost: 35,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Cavalry", description: "" },
    { name: "Orc", description: "" },
    { name: "Bloodlust", description: "" },
    { name: "Preferred Terrain (Rugged)", description: "" },
    { name: "Raging", description: "" }
  ],
  highCommand: false,
  availability: 2,
  command: 0,
  specialRules: ["Vulnerable", "Repeat a Die"],
  imageUrl: "/art/card/warg_riders_card.jpg"
};
