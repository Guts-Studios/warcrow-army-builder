
import { Unit } from "@/types/army";
import { scionsOfYaldabaothTroops } from "./troops";
import { scionsOfYaldabaothCharacters } from "./characters";
import { scionsOfYaldabaothHighCommand } from "./highCommand";
import { scionsOfYaldabaothCompanions } from "./companions";

export const scionsOfYaldabaothUnits: Unit[] = [
  ...scionsOfYaldabaothTroops,
  ...scionsOfYaldabaothCharacters,
  ...scionsOfYaldabaothHighCommand,
  ...scionsOfYaldabaothCompanions
];
