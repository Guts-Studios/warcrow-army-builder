import { Unit } from "@/types/army";

export const lady_telia: Unit = {
  id: "lady-télia",
  name: "Lady Télia",
  name_es: "Lady Télia",
  pointsCost: 25,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Character", description: "" },
    { name: "Human", description: "" },
    { name: "Elite", description: "" },
    { name: "Scout", description: "" },
    { name: "Join (Arquebusiers)", description: "" },
    { name: "Join (Pioneers)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 2,
  specialRules: ["Frightened", "Aim", "Repeat a Die"],
  tournamentLegal: true,
  imageUrl: "/art/card/lady_telia_card.jpg"
};