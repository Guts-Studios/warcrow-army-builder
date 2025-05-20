
import { Unit } from "@/types/army";
import { hegemonyCharactersLeaders } from "./characters/leaders";
import { hegemonyCharactersSpecialists } from "./characters/specialists";
import { hegemonyCharactersElites } from "./characters/elites";
import { hegemonyOfEmbersigSupports } from "./characters/supports";
import { hegemonyOfEmbersigCompanions } from "./characters/companions";
import { vercana } from "./characters/vercana";

export const hegemonyOfEmbersigCharacters: Unit[] = [
  ...hegemonyCharactersLeaders,
  ...hegemonyCharactersSpecialists,
  ...hegemonyCharactersElites,
  ...hegemonyOfEmbersigSupports,
  ...hegemonyOfEmbersigCompanions,
  vercana
];
