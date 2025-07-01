import { Unit } from "@/types/army";

export const naergon_caladren: Unit = {
  id: "naergon-caladren",
  name: "Naergon Caladren",
  name_es: "Naergon Caladren",
  pointsCost: 15,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Aestari", description: "" },
    { name: "Character", description: "" },
    { name: "Colossal Company", description: "" },
    { name: "Elf", description: "" },
    { name: "Spellcaster", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Place (5)", "Disarmed", "Displace (5)", "Frightened"],
  tournamentLegal: false,
  imageUrl: "/art/card/naergon_caladren_card.jpg"
};