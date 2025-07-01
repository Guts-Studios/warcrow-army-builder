import { Unit } from "@/types/army";

export const gunnery_corporal: Unit = {
  id: "gunnery-corporal",
  name: "Gunnery Corporal",
  name_es: "Cabo Tirador",
  pointsCost: 20,
  faction: "hegemony-of-embersig",
  faction_id: "hegemony-of-embersig",
  keywords: [
    { name: "Character", description: "" },
    { name: "Human", description: "" },
    { name: "Join (Arquebusiers)", description: "" },
    { name: "Join (Pioneers)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Repeat a die"],
  tournamentLegal: true,
  imageUrl: "/art/card/gunnery_corporal_card.jpg"
};