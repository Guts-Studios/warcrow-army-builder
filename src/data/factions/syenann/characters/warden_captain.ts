import { Unit } from "@/types/army";

export const warden_captain: Unit = {
  id: "warden_captain",
  name: "Warden Captain",
  name_es: "Capitan Custodio",
  pointsCost: 30,
  faction: "syenann",
  faction_id: "syenann",
  keywords: [
    { name: "Character", description: "" },
    { name: "Infantry", description: "" },
    { name: "Nemorous", description: "" },
    { name: "Syenann", description: "" },
    { name: "Elite", description: "" },
    { name: "Join (Syena Wardens)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: ["Place (5)", "Shove (5)", "Repeat a Die", "Disarmed"],
  tournamentLegal: true,
  imageUrl: "/art/card/warden_captain_card.jpg"
};