
import { Unit } from "@/types/army";

export const vercana: Unit = {
  id: "vercana",
  name: "Vercana",
  pointsCost: 30,
  faction: "northern-tribes",
  keywords: [
    { name: "Human", description: "" },
    { name: "Mercenary", description: "" },
    { name: "Character", description: "" },
    { name: "Ambusher", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Place (5)"],
  imageUrl: "/art/card/vercana_card.jpg"
};
