import { Unit } from "@/types/army";

export const harvester: Unit = {
  id: "harvester",
  name: "Harvester",
  name_es: "Segador",
  pointsCost: 40,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Dead Flesh", description: "" },
    { name: "Risen", description: "" },
    { name: "Elf", description: "" },
    { name: "Dispel (BLK)", description: "" },
    { name: "Golem", description: "" },
    { name: "Intimidating (2)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Frightened"],
  tournamentLegal: true,
  imageUrl: "/art/card/harvester_card.jpg"
};