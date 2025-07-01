import { Unit } from "@/types/army";

export const corporal: Unit = {
  id: "corporal",
  name: "Corporal",
  name_es: "Cabo",
  pointsCost: 15,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Character", description: "" },
    { name: "Human", description: "" },
    { name: "Join (Human Infantry)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 2,
  specialRules: [],
  tournamentLegal: true,
  imageUrl: "/art/card/corporal_card.jpg"
};