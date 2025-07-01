import { Unit } from "@/types/army";

export const rumpy_ride: Unit = {
  id: "rumpy-ride",
  name: "Rumpy Ride",
  name_es: "Cabalgachepas",
  pointsCost: 45,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Character", description: "" },
    { name: "Red Cap", description: "" },
    { name: "Dispel (BLU BLK)", description: "" },
    { name: "Elite", description: "" },
    { name: "Join (Red Caps Infantry Spellcaster)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 2,
  specialRules: [],
  tournamentLegal: true,
  imageUrl: "/art/card/rumpy_ride_card.jpg"
};