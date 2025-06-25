
import { Unit } from "@/types/army";

export const vercana: Unit = {
  id: "vercana-scions-of-yaldabaoth",
  name: "Vercana",
  name_es: "Vercana",
  pointsCost: 30,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Character", description: "" },
    { name: "Human", description: "" },
    { name: "Mercenary", description: "" },
    { name: "Ambusher", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Place (5)"],
  tournamentLegal: false,
  imageUrl: "/art/card/vercana_card.jpg"
};
