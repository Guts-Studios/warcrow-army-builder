
import { Unit } from "@/types/army";
import { northernTribesLeaders } from "./leaders";
import { northernTribesSupports } from "./supports";
import { northernTribesElites } from "./elites";
import { northernTribesSpecialists } from "./specialists";
import { vercana } from "./vercana";

export const northernTribesCharacters: Unit[] = [
  vercana,
  ...northernTribesLeaders,
  ...northernTribesSupports,
  ...northernTribesElites,
  ...northernTribesSpecialists
];
