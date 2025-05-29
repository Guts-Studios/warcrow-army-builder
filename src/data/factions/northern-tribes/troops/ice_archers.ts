
import { Unit } from "@/types/army";

export const ice_archers: Unit = {
  id: "ice_archers",
  name: "Ice Archers",
  pointsCost: 25,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Varank", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Slowed"],
  imageUrl: "/art/card/ice_archers_card.jpg"
};
