
import { Unit } from "@/types/army";

// For now, return empty array since the static unit files are incomplete
// The CSV data will be used instead via the database/CSV loading system
console.log('[Syenann Index] Using CSV data instead of static files for complete unit set');

export const syenannUnits: Unit[] = [];

console.log('[Syenann Index] Static units exported (using CSV instead):', syenannUnits.length);
