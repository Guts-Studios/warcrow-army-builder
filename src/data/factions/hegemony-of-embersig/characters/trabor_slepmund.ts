import { Unit } from "@/types/army";

export const trabor_slepmund: Unit = {
  id: "trabor-slepmund",
  name: "Trabor Slepmund",
  name_es: "Trabor Slepmund",
  pointsCost: 30,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Character", description: "" },
    { name: "Colossal Company", description: "" },
    { name: "Dwarf", description: "" },
    { name: "Ghent", description: "" },
    { name: "Dispel (BLU)", description: "" },
    { name: "Join (War Rig)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Disarmed"],
  tournamentLegal: false,
  imageUrl: "/art/card/trabor_slepmund_card.jpg"
};