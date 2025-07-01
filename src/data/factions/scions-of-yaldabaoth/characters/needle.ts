import { Unit } from "@/types/army";

export const needle: Unit = {
  id: "needle",
  name: "Needle",
  name_es: "Aguja",
  pointsCost: 25,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Character", description: "" },
    { name: "Darkminded", description: "" },
    { name: "Elf", description: "" },
    { name: "Dead Flesh", description: "" },
    { name: "Dispel (BLU BLK)", description: "" },
    { name: "Join (Living Flesh Dead Flesh)", description: "" },
    { name: "Spellcaster", description: "" }
  ],
  highCommand: false,
  availability: 3,
  command: 1,
  specialRules: ["Heal", "Frightened"],
  tournamentLegal: true,
  imageUrl: "/art/card/needle_card.jpg"
};