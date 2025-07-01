import { Unit } from "@/types/army";

export const oona: Unit = {
  id: "oona",
  name: "Oona",
  name_es: "Oona",
  pointsCost: 25,
  faction: "syenann",
  faction_id: "syenann",
  keywords: [
    { name: "Ashen", description: "" },
    { name: "Character", description: "" },
    { name: "Colossal Company", description: "" },
    { name: "Elf", description: "" },
    { name: "Nemourous", description: "" },
    { name: "Syenann", description: "" },
    { name: "Intimidating (1)", description: "" },
    { name: "Spellcaster", description: "" },
    { name: "Tinge", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Slowed"],
  tournamentLegal: false,
  imageUrl: "/art/card/oona_card.jpg"
};