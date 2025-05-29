
import { Unit } from "@/types/army";

export const evoker: Unit = {
  id: "evoker",
  name: "Evoker",
  pointsCost: 25,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Orc", description: "" },
    { name: "Spellcaster", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Intimidating (X)", "Flee", "Slowed"],
  imageUrl: "/art/card/evoker_card.jpg"
};
