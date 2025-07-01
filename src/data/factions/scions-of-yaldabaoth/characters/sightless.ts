import { Unit } from "@/types/army";

export const sightless: Unit = {
  id: "sightless",
  name: "Sightless",
  name_es: "Cegaton",
  pointsCost: 15,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Character", description: "" },
    { name: "Red Cap", description: "" },
    { name: "Dispel (BLU)", description: "" },
    { name: "Join (Red Cap, Infantry)", description: "" }
  ],
  highCommand: false,
  availability: 3,
  command: 0,
  specialRules: [],
  tournamentLegal: true,
  imageUrl: "/art/card/sightless_card.jpg"
};