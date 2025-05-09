
import { Faction } from "../types/army";
import { northernTribesUnits } from "./factions/northern-tribes";
import { hegemonyOfEmbersigUnits } from "./factions/hegemony-of-embersig";
import { scionsOfYaldabaothUnits } from "./factions/scions-of-yaldabaoth";
import { syenannUnits } from "./factions/syenann";

// Canonical faction definitions with standardized naming
export const factions: Faction[] = [
  { id: "northern-tribes", name: "Northern Tribes" },
  { id: "hegemony-of-embersig", name: "Hegemony" },
  { id: "scions-of-yaldabaoth", name: "Scions" },
  { id: "syenann", name: "Sÿenann" }
];

export const units = [...northernTribesUnits, ...hegemonyOfEmbersigUnits, ...scionsOfYaldabaothUnits, ...syenannUnits];
