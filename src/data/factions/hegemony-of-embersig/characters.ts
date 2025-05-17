
import { Unit } from "../../../types/army";
import { hegemonyCharactersLeaders } from "./characters/leaders";
import { hegemonyOfEmbersigSupports } from "./characters/supports";
import { hegemonyCharactersElites } from "./characters/elites";
import { hegemonyCharactersSpecialists } from "./characters/specialists";
import { vercana } from "./characters/vercana";

export const hegemonyOfEmbersigCharacters: Unit[] = [
  vercana,
  ...hegemonyCharactersLeaders,
  ...hegemonyOfEmbersigSupports,
  ...hegemonyCharactersElites,
  ...hegemonyCharactersSpecialists
];
