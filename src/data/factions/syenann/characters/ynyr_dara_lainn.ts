import { Unit } from "@/types/army";

export const ynyr_dara_lainn: Unit = {
  id: "ynyr_dara_lainn",
  name: "Ynyr Dara Lainn",
  name_es: "Ynyr Dara Lainn",
  pointsCost: 35,
  faction: "syenann",
  faction_id: "syenann",
  keywords: [
    { name: "Character", description: "" },
    { name: "Elf", description: "" },
    { name: "Syenann", description: "" },
    { name: "Scout", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Place (10)", "Shove (4)"],
  tournamentLegal: true,
  imageUrl: "/art/card/ynyr_dara_lainn_card.jpg"
};