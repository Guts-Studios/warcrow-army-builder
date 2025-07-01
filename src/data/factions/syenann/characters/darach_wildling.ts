import { Unit } from "@/types/army";

export const darach_wildling: Unit = {
  id: "darach_wildling",
  name: "Darach Wildling",
  name_es: "Darach Brutamontes",
  pointsCost: 35,
  faction: "syenann",
  faction_id: "syenann",
  keywords: [
    { name: "Character", description: "" },
    { name: "Elf", description: "" },
    { name: "Colossal Company", description: "" },
    { name: "Nemorous", description: "" },
    { name: "Syenann", description: "" },
    { name: "Aim", description: "" },
    { name: "Ambusher", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: [],
  tournamentLegal: false,
  imageUrl: "/art/card/darach_wildling_card.jpg"
};