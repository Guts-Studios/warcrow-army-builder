import { Unit } from "@/types/army";

export const validateHighCommandAddition = (selectedUnits: Unit[], newUnit: Unit): boolean => {
  if (!newUnit.highCommand) return true;
  
  const existingHighCommand = selectedUnits.some(unit => unit.highCommand);
  return !existingHighCommand;
};