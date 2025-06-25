
import { Unit } from "@/types/army";
import { syenannTroops } from "./troops";
import { syenannCharacters } from "./characters";
import { syenannHighCommand } from "./highCommand";
import { syenannCompanions } from "./companions";

export const syenannUnits: Unit[] = [
  ...syenannTroops,
  ...syenannCharacters,
  ...syenannHighCommand,
  ...syenannCompanions
];
