import { Unit } from "@/types/army";

export const overseer: Unit = {
  id: "overseer",
  name: "Overseer",
  name_es: "Capataz",
  pointsCost: 25,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Character", description: "" },
    { name: "Red Cap", description: "" },
    { name: "Join (Gobblers, Bugbowls, Osseous)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 2,
  specialRules: ["Shove (4)", "Slowed", "Place (10)"],
  tournamentLegal: true,
  imageUrl: "/art/card/overseer_card.jpg"
};