
import { Unit } from "@/types/army";

export const northernTribesHighCommand: Unit[] = [
  {
    id: "ahlwardt-ice-bear",
    name: "Ahlwardt, Ice Bear",
    name_es: "Ahlwardt, Oso De Hielo",
    pointsCost: 60,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Varank", description: "" },
      { name: "Beserker Rage", description: "" },
      { name: "Dispel", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Skin Changers)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Vulnerable"],
    tournamentLegal: true,
    imageUrl: "/art/card/ahlwardt_ice_bear_card.jpg"
  },
  {
    id: "alborc",
    name: "Alborc",
    name_es: "Alborc",
    pointsCost: 50,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry Orc)", description: "" },
      { name: "Join (Infantry Varank)", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Vulnerable", "Dispel (D)"],
    tournamentLegal: true,
    imageUrl: "/art/card/alborc_card.jpg"
  },
  {
    id: "wrathmane",
    name: "Wrathmane",
    name_es: "Plaje De Ira",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry Orc)", description: "" },
      { name: "Elite", description: "" },
      { name: "Raging", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Vulnerable", "Frightened", "Disarmed", "Displace (3)"],
    tournamentLegal: true,
    imageUrl: "/art/card/wrathmane_card.jpg"
  }
];
