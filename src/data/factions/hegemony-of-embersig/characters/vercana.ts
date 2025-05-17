
import { Unit } from "@/types/army";

export const vercana: Unit = {
  id: "vercana-hegemony",
  name: "Vercana",
  pointsCost: 30,
  faction: "hegemony-of-embersig",
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
