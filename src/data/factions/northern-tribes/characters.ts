
import { Unit } from "@/types/army";
import { northernTribesLeaders } from "./characters/leaders";
import { northernTribesSupports } from "./characters/supports";
import { northernTribesElites } from "./characters/elites";
import { northernTribesSpecialists } from "./characters/specialists";
// Remove the direct import of vercana since she's a mercenary that should be imported from a central location
// import { vercana } from "./characters/vercana";

export const northernTribesCharacters: Unit[] = [
  // Remove vercana from here as she'll be imported via the mercenaries logic
  ...northernTribesLeaders,
  ...northernTribesSupports,
  ...northernTribesElites,
  ...northernTribesSpecialists
];
