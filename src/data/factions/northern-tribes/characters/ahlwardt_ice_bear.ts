
import { Unit } from "@/types/army";

export const ahlwardt_ice_bear: Unit = {
  id: "ahlwardt_ice_bear",
  name: "Ahlwardt, Ice Bear",
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
  imageUrl: "/art/card/ahlwardt_ice_bear_card.jpg"
};
