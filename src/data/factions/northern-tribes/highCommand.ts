
import { Unit } from "@/types/army";

export const northernTribesHighCommand: Unit[] = [
  {
    id: "wrathmane",
    name: "Wrathmane",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Join (Infantry", description: "" },
      { name: "Orc)", description: "" },
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "High Command", description: "Characters with this characteristic automatically become your commander when included in your company." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Vulnerable", "Frightened", "Disarmed", "Displace (3)"],
    
    imageUrl: "/art/card/wrathmane_card.jpg"
  },
  {
    id: "ahlwardt-ice-bear",
    name: "Ahlwardt, Ice Bear",
    pointsCost: 60,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Beserker Rage", description: "" },
      { name: "Dispel", description: "" },
      { name: "Join  (Skin Changers)", description: "" },
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "High Command", description: "Characters with this characteristic automatically become your commander when included in your company." },
      { name: "Varank", description: "A proud warrior culture from the northern regions." }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: ["Vulnerable"],
    
    imageUrl: "/art/card/ahlwardt-ice-bear_card.jpg"
  },
  {
    id: "alborc",
    name: "Alborc",
    pointsCost: 50,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Join (Infantry", description: "" },
      { name: "Orc | Infantry", description: "" },
      { name: "Varank)", description: "" },
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "High Command", description: "Characters with this characteristic automatically become your commander when included in your company." },
      { name: "Orc", description: "A physically powerful race known for their martial prowess and tribal culture." }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Vulnerable", "Dispel (D)"],
    
    imageUrl: "/art/card/alborc_card.jpg"
  }
];
