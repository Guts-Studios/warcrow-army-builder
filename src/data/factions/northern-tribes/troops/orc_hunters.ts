
import { Unit } from "@/types/army";

export const orc_hunters: Unit = {
  id: "orc_hunters",
  name: "Orc Hunters",
  pointsCost: 20,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Orc", description: "" }
  ],
  highCommand: false,
  availability: 3,
  command: 0,
  specialRules: ["Vulnerable"],
  imageUrl: "/art/card/orc_hunters_card.jpg"
};
