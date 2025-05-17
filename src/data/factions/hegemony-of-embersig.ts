
import { Unit } from "../../types/army";
import { hegemonyTroops } from "./hegemony/troops";
import { hegemonyOfEmbersigCharacters } from "./hegemony-of-embersig/characters";
import { hegemonyHighCommand } from "./hegemony/high-command";

export const hegemonyOfEmbersigUnits: Unit[] = [
  ...hegemonyTroops,
  ...hegemonyOfEmbersigCharacters,
  ...hegemonyHighCommand
];
