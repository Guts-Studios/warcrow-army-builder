import { Unit } from "@/types/army";

export const orc_husk: Unit = {
  id: "orc-husk",
  name: "Orc Husk",
  name_es: "Cascara Orco",
  pointsCost: 10,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Dead Flesh", description: "" },
    { name: "Risen", description: "" },
    { name: "Golem", description: "" },
    { name: "Join (Infantry Dead Flesh)", description: "" }
  ],
  highCommand: false,
  availability: 2,
  command: 0,
  specialRules: ["Vulnerable", "Frightened", "Slowed", "Disarmed"],
  tournamentLegal: true,
  imageUrl: "/art/card/orc_husk_card.jpg"
};