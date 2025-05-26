
import { Unit } from "@/types/army";
import { hegemonyOfEmbersigUnits as importedUnits } from "./hegemony-of-embersig/index";

// Explicitly set faction and faction_id for all Hegemony units to ensure consistency
const processedUnits = importedUnits.map(unit => ({
  ...unit,
  faction: 'hegemony-of-embersig',
  faction_id: 'hegemony-of-embersig'
}));

export { processedUnits as hegemonyOfEmbersigUnits };
