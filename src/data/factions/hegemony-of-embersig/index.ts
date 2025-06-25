
import { Unit } from "@/types/army";
import { hegemonyOfEmbersigTroops } from "./troops";
import { hegemonyOfEmbersigCharacters } from "./characters";
import { hegemonyOfEmbersigHighCommand } from "./highCommand";
import { hegemonyOfEmbersigCompanions } from "./companions";

export const hegemonyOfEmbersigUnits: Unit[] = [
  ...hegemonyOfEmbersigTroops,
  ...hegemonyOfEmbersigCharacters,
  ...hegemonyOfEmbersigHighCommand,
  ...hegemonyOfEmbersigCompanions
];
