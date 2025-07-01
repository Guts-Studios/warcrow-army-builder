import { Unit } from "@/types/army";

export const engineer: Unit = {
  id: "engineer",
  name: "Engineer",
  name_es: "Ingeniera",
  pointsCost: 15,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Character", description: "" },
    { name: "Ghent", description: "" },
    { name: "Dwarf", description: "" },
    { name: "Dispel (BLU)", description: "" },
    { name: "Join (Infantry)", description: "" },
    { name: "Join (War Machine)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: [],
  tournamentLegal: true,
  imageUrl: "/art/card/engineer_card.jpg"
};