
import { Unit } from "../../types/army";
import { scionsOfYaldabaothTroops } from "./scions-of-yaldabaoth/troops";
import { scionsOfYaldabaothCharacters } from "./scions-of-yaldabaoth/characters";
import { scionsOfYaldabaothHighCommand } from "./scions-of-yaldabaoth/highCommand";

export const scionsOfYaldabaothUnits: Unit[] = [
  ...scionsOfYaldabaothTroops,
  ...scionsOfYaldabaothCharacters,
  ...scionsOfYaldabaothHighCommand
];
