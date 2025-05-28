
import { Unit } from "@/types/army";

export const vercana: Unit = {
  id: "vercana-northern-tribes",
  name: "Vercana",
  pointsCost: 30,
  faction: "northern-tribes",
  keywords: [
    { name: "Human", description: "" },
    { name: "Character", description: "" },
    { name: "Mercenary", description: "" },
    { name: "Ambusher", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Place (5)"],
  imageUrl: "/art/card/vercana_card.jpg"
};
