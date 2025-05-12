
import { Faction } from "../types/army";
import { northernTribesUnits } from "./factions/northern-tribes";
import { hegemonyOfEmbersigUnits } from "./factions/hegemony-of-embersig";
import { scionsOfYaldabaothUnits } from "./factions/scions-of-yaldabaoth";
import { syenannUnits } from "./factions/syenann";

// Define fallback factions in case the database fetch fails
export const factions: Faction[] = [
  { id: "northern-tribes", name: "Northern Tribes" },
  { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
  { id: "scions-of-yaldabaoth", name: "Scions of Yaldabaoth" },
  { id: "syenann", name: "Sÿenann" }
];

// Export units from all factions
export const units = [...northernTribesUnits, ...hegemonyOfEmbersigUnits, ...scionsOfYaldabaothUnits, ...syenannUnits];
