
import { Unit } from "@/types/army";
import { syenannTroops } from "./troops";
import { syenannCharacters } from "./characters";
import { syenannHighCommand } from "./highCommand";
import { syenannCompanions } from "./companions";

console.log('[Syenann Index] Loading Syenann units...');
console.log('[Syenann Index] Troops:', syenannTroops.length, syenannTroops.map(u => u.name));
console.log('[Syenann Index] Characters:', syenannCharacters.length, syenannCharacters.map(u => u.name));
console.log('[Syenann Index] High Command:', syenannHighCommand.length, syenannHighCommand.map(u => u.name));
console.log('[Syenann Index] Companions:', syenannCompanions.length, syenannCompanions.map(u => u.name));

export const syenannUnits: Unit[] = [
  ...syenannTroops,
  ...syenannCharacters,
  ...syenannHighCommand,
  ...syenannCompanions
];

console.log('[Syenann Index] Total Syenann units exported:', syenannUnits.length, syenannUnits.map(u => u.name));
