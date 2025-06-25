
import { Unit } from "@/types/army";

export const northernTribesCompanions: Unit[] = [
  {
    id: "coal",
    name: "Coal",
    name_es: "Tizon",
    pointsCost: 20,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Companion", description: "" },
      { name: "Join (Iriavik)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Slowed", "Fix a Die"],
    companion: "iriavik restless pup",
    tournamentLegal: false,
    imageUrl: "/art/card/coal_card.jpg"
  },
  {
    id: "iriavik-restless-pup",
    name: "Iriavik Restless Pup",
    name_es: "Iriavik Cachorro Impaciente",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Nemorous", description: "" },
      { name: "Varank", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Slowed", "Place (3)", "Immune to State", "Frightened"],
    tournamentLegal: false,
    imageUrl: "/art/card/iriavik_restless_pup_card.jpg"
  },
  {
    id: "ormuk",
    name: "Ormuk",
    name_es: "Ormuk",
    pointsCost: 35,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Orc", description: "" },
      { name: "Bloodlust", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    tournamentLegal: false,
    imageUrl: "/art/card/ormuk_card.jpg"
  },
  {
    id: "vercana",
    name: "Vercana",
    name_es: "Vercana",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Mercenary", description: "" },
      { name: "Ambusher", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Place (5)"],
    tournamentLegal: false,
    imageUrl: "/art/card/vercana_card.jpg"
  }
];
