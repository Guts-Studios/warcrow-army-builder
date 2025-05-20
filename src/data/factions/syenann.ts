
import { Unit } from "../../types/army";
import { syenannTroops } from "./syenann/troops";
import { syenannCharacters } from "./syenann/characters";
import { syenannHighCommand } from "./syenann/high-command";

export const syenannUnits: Unit[] = [
  ...syenannTroops,
  ...syenannCharacters,
  ...syenannHighCommand
];
