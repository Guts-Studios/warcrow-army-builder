import { Unit } from "@/types/army";

export const aide: Unit = {
  id: "aide",
  name: "Aide",
  name_es: "Legado",
  pointsCost: 25,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Aestari", description: "" },
    { name: "Character", description: "" },
    { name: "Elf", description: "" },
    { name: "Fearless", description: "" },
    { name: "Spellcaster", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Place (10)"],
  tournamentLegal: true,
  imageUrl: "/art/card/aide_card.jpg"
};