
import { Unit } from "@/types/army";

export const vercana: Unit = {
  id: "vercana-scions",
  name: "Vercana",
  pointsCost: 30,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Human", description: "Human race" },
    { name: "Character", description: "Character unit type" },
    { name: "Mercenary", description: "Can be hired by different factions" },
    { name: "Ambusher", description: "Can ambush enemy units" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Place (5)"],
  imageUrl: "/art/card/vercana_card.jpg"
};
