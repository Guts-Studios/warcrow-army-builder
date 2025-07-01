
import { Unit } from "@/types/army";
import { northernTribesTroops } from "./troops";
import { northernTribesCharacters } from "./characters/index";
import { northernTribesHighCommand } from "./highCommand";
import { northernTribesCompanions } from "./companions";

export const northernTribesUnits: Unit[] = [
  ...northernTribesTroops,
  ...northernTribesCharacters,
  ...northernTribesHighCommand,
  ...northernTribesCompanions
];
