
import { Unit } from "@/types/army";
import { northernTribesLeaders } from "./leaders";
import { northernTribesSupports } from "./supports";
import { northernTribesElites } from "./elites";
import { northernTribesSpecialists } from "./specialists";
// Remove direct import of vercana since she'll come via mercenaries

export const northernTribesCharacters: Unit[] = [
  // Remove vercana from here as she'll be imported via the mercenaries logic
  ...northernTribesLeaders,
  ...northernTribesSupports,
  ...northernTribesElites,
  ...northernTribesSpecialists
];
