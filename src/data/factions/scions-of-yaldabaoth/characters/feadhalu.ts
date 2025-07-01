import { Unit } from "@/types/army";

export const feadhalu: Unit = {
  id: "feadhalu",
  name: "Feadhalu",
  name_es: "Feadhalu",
  pointsCost: 30,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Living Flesh", description: "" },
    { name: "Ambusher", description: "" },
    { name: "Dispel (BLK)", description: "" },
    { name: "Golem", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Frightened", "Place (7)"],
  tournamentLegal: true,
  imageUrl: "/art/card/feadhalu_card.jpg"
};