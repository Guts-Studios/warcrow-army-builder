
import { Unit } from "../../types/army";
import { scionsOfYaldabaothTroops } from "./scions-of-yaldabaoth/troops";
import { scionsOfYaldabaothCharacters } from "./scions-of-yaldabaoth/characters";

export const scionsOfYaldabaothUnits: Unit[] = [
  ...scionsOfYaldabaothTroops,
  ...scionsOfYaldabaothCharacters
];
