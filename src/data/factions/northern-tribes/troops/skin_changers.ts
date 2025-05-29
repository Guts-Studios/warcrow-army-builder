
import { Unit } from "@/types/army";

export const skin_changers: Unit = {
  id: "skin_changers",
  name: "Skin Changers",
  pointsCost: 35,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Varank", description: "" },
    { name: "Fearless", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Scout"],
  imageUrl: "/art/card/skin_changers_card.jpg"
};
