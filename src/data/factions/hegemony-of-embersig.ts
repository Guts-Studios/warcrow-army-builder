
import { Unit } from "@/types/army";
import { hegemonyOfEmbersigTroops } from "./hegemony-of-embersig/troops";
import { hegemonyOfEmbersigCharacters } from "./hegemony-of-embersig/characters";
import { hegemonyOfEmbersigHighCommand } from "./hegemony-of-embersig/high-command";

// Explicitly set faction for all Hegemony units to ensure consistency
const processedTroops = hegemonyOfEmbersigTroops.map(unit => ({
  ...unit,
  faction: 'hegemony-of-embersig'
}));
const processedCharacters = hegemonyOfEmbersigCharacters.map(unit => ({
  ...unit,
  faction: 'hegemony-of-embersig'
}));
const processedHighCommand = hegemonyOfEmbersigHighCommand.map(unit => ({
  ...unit,
  faction: 'hegemony-of-embersig'
}));

export const hegemonyOfEmbersigUnits: Unit[] = [
  ...processedTroops,
  ...processedCharacters,
  ...processedHighCommand
];
