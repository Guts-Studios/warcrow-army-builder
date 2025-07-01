import { Unit } from "@/types/army";

export const war_surgeon: Unit = {
  id: "war-surgeon",
  name: "War Surgeon",
  name_es: "Cirujano De Guerra",
  pointsCost: 15,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Character", description: "" },
    { name: "Human", description: "" },
    { name: "Join (Infantry)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: [],
  tournamentLegal: true,
  imageUrl: "/art/card/war_surgeon_card.jpg"
};