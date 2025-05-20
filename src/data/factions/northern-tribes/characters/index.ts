
import { Unit } from "@/types/army";
import { northernTribesLeaders } from "./leaders";
import { northernTribesSupports } from "./supports";
import { northernTribesElites } from "./elites";
import { northernTribesSpecialists } from "./specialists";
// Import of vercana is removed as she'll be imported via mercenaries

export const northernTribesCharacters: Unit[] = [
  // Vercana is removed from here and will be imported via the mercenaries logic
  ...northernTribesLeaders,
  ...northernTribesSupports,
  ...northernTribesElites,
  ...northernTribesSpecialists
];
