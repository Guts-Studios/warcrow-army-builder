
import { Unit } from "../../../types/army";
import { hegemonyCharactersLeaders } from "./characters/leaders";
import { hegemonyOfEmbersigSupports } from "./characters/supports";
import { hegemonyCharactersElites } from "./characters/elites";
import { hegemonyCharactersSpecialists } from "./characters/specialists";
// Remove vercana import

export const hegemonyOfEmbersigCharacters: Unit[] = [
  // Remove vercana from the array
  ...hegemonyCharactersLeaders,
  ...hegemonyOfEmbersigSupports,
  ...hegemonyCharactersElites,
  ...hegemonyCharactersSpecialists
];
