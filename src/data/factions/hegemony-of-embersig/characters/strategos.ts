import { Unit } from "@/types/army";

export const strategos: Unit = {
  id: "strategos",
  name: "Strategos",
  name_es: "Strategos",
  pointsCost: 20,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Character", description: "" },
    { name: "Human", description: "" },
    { name: "Join (Infantry)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: [],
  tournamentLegal: true,
  imageUrl: "/art/card/strategos_card.jpg"
};