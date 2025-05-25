
import { Unit } from "@/types/army";
import { hegemonyOfEmbersigUnits } from "./hegemony-of-embersig";

// Explicitly set faction for all Hegemony units to ensure consistency
const processedUnits = hegemonyOfEmbersigUnits.map(unit => ({
  ...unit,
  faction: 'hegemony-of-embersig'
}));

export { processedUnits as hegemonyOfEmbersigUnits };
