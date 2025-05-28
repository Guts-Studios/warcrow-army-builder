
import { Unit } from "@/types/army";
import { northernTribesTroops } from "./troops";
import { northernTribesCharacters } from "./characters";
import { northernTribesHighCommand } from "./highCommand";

export const northernTribesUnits: Unit[] = [
  ...northernTribesTroops,
  ...northernTribesCharacters,
  ...northernTribesHighCommand
];
