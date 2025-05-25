
import { Unit } from "@/types/army";
import { hegemonyOfEmbersigUnits as importedUnits } from "./hegemony-of-embersig";

// Explicitly set faction for all Hegemony units to ensure consistency
const processedUnits = importedUnits.map(unit => ({
  ...unit,
  faction: 'hegemony-of-embersig'
}));

export { processedUnits as hegemonyOfEmbersigUnits };
