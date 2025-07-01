import { Unit } from "@/types/army";

export const syenann_captain: Unit = {
  id: "syenann_captain",
  name: "Syenann Captain",
  name_es: "Capitan Syenann",
  pointsCost: 20,
  faction: "syenann",
  faction_id: "syenann",
  keywords: [
    { name: "Character", description: "" },
    { name: "Infantry", description: "" },
    { name: "Syenann", description: "" },
    { name: "Aim", description: "" },
    { name: "Join (Infantry, Syenann)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Repeat a Die"],
  tournamentLegal: true,
  imageUrl: "/art/card/syenann_captain_card.jpg"
};