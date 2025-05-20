
import { Unit } from "@/types/army";

export const vercana: Unit = {
  id: "vercana-hegemony",
  name: "Vercana",
  pointsCost: 30,
  faction: "hegemony-of-embersig",
  keywords: [
    { name: "Character", description: "Character unit type" },
    { name: "Human", description: "Human race" },
    { name: "Mercenary", description: "Mercenary unit" },
    { name: "Ambusher", description: "Has ambush abilities" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Place (5)"],
  imageUrl: "/art/card/vercana_card.jpg"
};
