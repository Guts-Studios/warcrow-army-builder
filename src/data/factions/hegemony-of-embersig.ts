
import { Unit } from "../../types/army";
import { hegemonyOfEmbersigTroops } from "./hegemony-of-embersig/troops";
import { hegemonyOfEmbersigCharacters } from "./hegemony-of-embersig/characters";
import { hegemonyOfEmbersigHighCommand } from "./hegemony-of-embersig/high-command";
import { hegemonyMercenaries } from "./mercenaries";

export const hegemonyOfEmbersigUnits: Unit[] = [
  ...hegemonyOfEmbersigTroops,
  ...hegemonyOfEmbersigCharacters,
  ...hegemonyOfEmbersigHighCommand,
  ...hegemonyMercenaries
];
