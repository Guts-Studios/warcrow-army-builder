
import { Unit } from "@/types/army";
import { northernTribesLeaders } from "./characters/leaders";
import { northernTribesSupports } from "./characters/supports";
import { northernTribesElites } from "./characters/elites";
import { northernTribesSpecialists } from "./characters/specialists";
import { vercana } from "./characters/vercana";

export const northernTribesCharacters: Unit[] = [
  vercana,
  ...northernTribesLeaders,
  ...northernTribesSupports,
  ...northernTribesElites,
  ...northernTribesSpecialists
];
