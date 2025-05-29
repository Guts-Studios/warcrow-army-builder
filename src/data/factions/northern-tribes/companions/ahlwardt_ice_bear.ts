
import { Unit } from "@/types/army";

export const ahlwardt_ice_bear: Unit = {
  id: "ahlwardt_ice_bear",
  name: "Ahlwardt Ice Bear",
  pointsCost: 35,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Beast", description: "" },
    { name: "Companion", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Companion"],
  imageUrl: "/art/card/ahlwardt_ice_bear_card.jpg"
};
