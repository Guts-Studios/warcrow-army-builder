
import { Unit } from "@/types/army";
import { hegemonyOfEmbersigHighCommand } from "./high-command";
import { hegemonyOfEmbersigCharacters } from "./characters";
// Add other unit type imports as they exist

export const hegemonyOfEmbersigUnits: Unit[] = [
  ...hegemonyOfEmbersigHighCommand,
  ...hegemonyOfEmbersigCharacters
  // Add other unit types as they exist
];
