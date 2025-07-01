import { Unit } from "@/types/army";

export const alula: Unit = {
  id: "alula",
  name: "Alula",
  name_es: "Alula",
  pointsCost: 20,
  faction: "syenann",
  faction_id: "syenann",
  keywords: [
    { name: "Character", description: "" },
    { name: "Elf", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Disarmed"],
  tournamentLegal: true,
  imageUrl: "/art/card/alula_card.jpg"
};