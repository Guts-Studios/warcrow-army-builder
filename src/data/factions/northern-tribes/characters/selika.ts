
import { Unit } from "@/types/army";

export const selika: Unit = {
  id: "selika",
  name: "Selika",
  pointsCost: 30,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Varank", description: "" },
    { name: "Ambusher", description: "" },
    { name: "Join (Infantry Varank)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: [],
  imageUrl: "/art/card/selika_card.jpg"
};
