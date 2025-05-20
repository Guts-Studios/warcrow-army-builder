
import { Unit } from "../../types/army";
import { northernTribesTroops } from "./northern-tribes/troops";
import { northernTribesCharacters } from "./northern-tribes/characters";
import { northernTribesHighCommand } from "./northern-tribes/high-command";

// Explicitly set faction for all Northern Tribes units to ensure consistency
const processedTroops = northernTribesTroops.map(unit => ({
  ...unit,
  faction: 'northern-tribes'
}));
const processedCharacters = northernTribesCharacters.map(unit => ({
  ...unit,
  faction: 'northern-tribes'
}));
const processedHighCommand = northernTribesHighCommand.map(unit => ({
  ...unit,
  faction: 'northern-tribes'
}));

export const northernTribesUnits: Unit[] = [
  ...processedTroops,
  ...processedCharacters,
  ...processedHighCommand
];
