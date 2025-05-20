
import { Unit } from "@/types/army";

export const northernTribesHighCommand: Unit[] = [
  {
    id: "wrathmane",
    name: "Wrathmane",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry, Orc)", description: "" },
      { name: "Elite", description: "" },
      { name: "Raging", description: "" },
    ],
    specialRules: ["Vulnerable", "Frightened", "Disarmed", "Displace (3)"],
    highCommand: true,
    imageUrl: "/art/card/wrathmane_card.jpg"
  },
  {
    id: "ahlwardt-ice-bear",
    name: "Ahlwardt, Ice Bear",
    faction: "northern-tribes",
    pointsCost: 60,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Varank", description: "" },
      { name: "Berserker Rage", description: "" },
      { name: "Dispel", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Skin Changers)", description: "" },
    ],
    specialRules: ["Vulnerable"],
    highCommand: true,
    imageUrl: "/art/card/ahlwardt_ice_bear_card.jpg"
  },
  {
    id: "alborc",
    name: "Alborc",
    faction: "northern-tribes",
    pointsCost: 50,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Orc", description: "" },
      { name: "Elite", description: "" },
      { 
        name: "Join (Infantry, Orc | Infantry, Varank)", 
        description: "" 
      },
    ],
    specialRules: ["Vulnerable", "Dispel (D)"],
    highCommand: true,
    imageUrl: "/art/card/alborc_card.jpg"
  }
];
