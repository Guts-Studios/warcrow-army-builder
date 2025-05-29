
import { Unit } from "@/types/army";

export const darkmaster: Unit = {
  id: "darkmaster",
  name: "Darkmaster",
  pointsCost: 30,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Orc", description: "" },
    { name: "Ambusher", description: "" },
    { name: "Dispel (BLK BLK)", description: "" },
    { name: "Join (Hunters)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Scout", "Disarmed"],
  imageUrl: "/art/card/darkmaster_card.jpg"
};
