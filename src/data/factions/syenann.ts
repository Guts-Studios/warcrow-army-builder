
import { Unit } from "../../types/army";
import { syenannTroops } from "./syenann/troops";
import { syenannCharacters } from "./syenann/characters";
import { syenannHighCommand } from "./syenann/high-command";
import { syenannMercenaries } from "./mercenaries";

export const syenannUnits: Unit[] = [
  ...syenannTroops,
  ...syenannCharacters,
  ...syenannHighCommand,
  ...syenannMercenaries
];
