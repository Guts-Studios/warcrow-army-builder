
import { Unit } from "@/types/army";

export const tundra_marauders: Unit = {
  id: "tundra_marauders",
  name: "Tundra Marauders",
  pointsCost: 30,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Varank", description: "" },
    { name: "Preferred Terrain (Rugged)", description: "" },
    { name: "Scout", description: "" }
  ],
  highCommand: false,
  availability: 2,
  command: 0,
  specialRules: ["Displace (3)", "Rugged", "Trap"],
  imageUrl: "/art/card/tundra_marauders_card.jpg"
};
