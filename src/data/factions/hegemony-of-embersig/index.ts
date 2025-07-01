
import { Unit } from "@/types/army";
import { hegemonyOfEmbersigTroops } from "./troops";
import { hegemonyOfEmbersigCharacters } from "./characters/index";
import { hegemonyOfEmbersigHighCommand } from "./high-command/index";
import { hegemonyOfEmbersigCompanions } from "./companions";

export const hegemonyOfEmbersigUnits: Unit[] = [
  ...hegemonyOfEmbersigTroops,
  ...hegemonyOfEmbersigCharacters,
  ...hegemonyOfEmbersigHighCommand,
  ...hegemonyOfEmbersigCompanions
];
