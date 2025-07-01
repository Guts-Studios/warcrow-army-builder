import { Unit } from "@/types/army";

export const frostfire_herald: Unit = {
  id: "frostfire-herald",
  name: "Frostfire Herald",
  name_es: "Heraldo Del Fuego Gelido",
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
  command: 0,
  specialRules: ["Slowed", "Impassable"],
  tournamentLegal: true,
  imageUrl: "/art/card/frostfire_herald_card.jpg"
};