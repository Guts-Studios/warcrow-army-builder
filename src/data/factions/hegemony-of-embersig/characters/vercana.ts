
import { Unit } from "@/types/army";

export const vercana: Unit = {
  id: "vercana",
  name: "Vercana",
  pointsCost: 30,
  faction: "hegemony-of-embersig",
  keywords: [
    { name: "Character", description: "" },
    { name: "Human", description: "" },
    { name: "Mercenary", description: "" },
    { name: "Ambusher", description: "" }
  ],
  availability: 1,
  command: 0,
  specialRules: ["Place (5)"],
  imageUrl: "/art/card/vercana_card_en.jpg"
};
