import { Unit } from "../../types/army";
import { hegemonyTroops } from "./hegemony/troops";
import { hegemonyCharacters } from "./hegemony/characters";
import { hegemonyNamedCharacters } from "./hegemony/named-characters";

export const hegemonyOfEmbersigUnits: Unit[] = [
  ...hegemonyTroops,
  ...hegemonyCharacters,
  ...hegemonyNamedCharacters
];