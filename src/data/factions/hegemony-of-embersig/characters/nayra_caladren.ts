import { Unit } from "@/types/army";

export const nayra_caladren: Unit = {
  id: "nayra-caladren",
  name: "Nayra Caladren",
  name_es: "Nayra Caladren",
  pointsCost: 35,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Aestari", description: "" },
    { name: "Character", description: "" },
    { name: "Colossal Company", description: "" },
    { name: "Elf", description: "" },
    { name: "Elite", description: "" },
    { name: "Fearless", description: "" },
    { name: "Spellcaster", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Disarmed", "Slowed", "Vulnerable"],
  tournamentLegal: false,
  imageUrl: "/art/card/nayra_caladren_card.jpg"
};