
import { Unit, Faction } from "@/types/army";
import { northernTribesUnits } from "./northern-tribes";
import { syenannUnits } from "./syenann";
import { hegemonyOfEmbersigUnits } from "./hegemony-of-embersig";
import { scionsOfYaldabaothUnits } from "./scions-of-yaldabaoth";

// Combine all faction units
export const units: Unit[] = [
  ...northernTribesUnits,
  ...syenannUnits,
  ...hegemonyOfEmbersigUnits,
  ...scionsOfYaldabaothUnits
];

// Faction definitions with proper IDs
export const factions: Faction[] = [
  { id: "northern-tribes", name: "Northern Tribes" },
  { id: "syenann", name: "The Syenann" },
  { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
  { id: "scions-of-yaldabaoth", name: "Scions of Yaldabaoth" }
];

// Export individual faction units for direct access
export {
  northernTribesUnits,
  syenannUnits,
  hegemonyOfEmbersigUnits,
  scionsOfYaldabaothUnits
};
