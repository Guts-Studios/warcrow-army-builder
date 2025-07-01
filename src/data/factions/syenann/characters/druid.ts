import { Unit } from "@/types/army";

export const druid: Unit = {
  id: "druid",
  name: "Druid",
  name_es: "Druida",
  pointsCost: 25,
  faction: "syenann",
  faction_id: "syenann",
  keywords: [
    { name: "Character", description: "" },
    { name: "Elf", description: "" },
    { name: "Nemorous", description: "" },
    { name: "Spellcaster", description: "" },
    { name: "Syenann", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Slowed"],
  tournamentLegal: true,
  imageUrl: "/art/card/druid_card.jpg"
};