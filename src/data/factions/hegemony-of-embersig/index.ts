
import { Unit } from "@/types/army";
import { hegemonyOfEmbersigHighCommand } from "./high-command";
import { hegemonyOfEmbersigCharacters } from "./characters";
import { hegemonyOfEmbersigTroops } from "./troops";
import { hegemonyOfEmbersigCompanions } from "./companions";

export const hegemonyOfEmbersigUnits: Unit[] = [
  ...hegemonyOfEmbersigHighCommand,
  ...hegemonyOfEmbersigCharacters,
  ...hegemonyOfEmbersigTroops,
  ...hegemonyOfEmbersigCompanions
];
