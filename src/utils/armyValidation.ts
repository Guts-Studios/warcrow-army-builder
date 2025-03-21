
import { Unit, SelectedUnit } from "@/types/army";

export const validateHighCommandAddition = (selectedUnits: SelectedUnit[], newUnit: Unit): boolean => {
  if (!newUnit.highCommand) return true;
  
  const existingHighCommand = selectedUnits.some(unit => unit.highCommand);
  return !existingHighCommand;
};
