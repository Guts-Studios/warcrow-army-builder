
import { Unit } from "@/types/army";

export const iriavik_restless_pup: Unit = {
  id: "iriavik-restless-pup",
  name: "Iriavik Restless Pup",
  name_es: "Iriavik Cachorro Impaciente",
  pointsCost: 30,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Colossal Company", description: "" },
    { name: "Nemorous", description: "" },
    { name: "Varank", description: "" },
    { name: "Ambusher", description: "" },
    { name: "Dispel (BLK)", description: "" },
    { name: "Preferred Terrain (Rugged)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Slowed", "Place (3)", "Immune to State", "Frightened"],
  tournamentLegal: false,
  imageUrl: "/art/card/iriavik_restless_pup_card.jpg"
};
