import { Unit, SelectedUnit } from "@/types/army";

export const validateUnitAddition = (
  unit: Unit,
  currentQuantity: number,
  availability: number
): boolean => {
  return currentQuantity < availability;
};

export const getUpdatedQuantities = (
  unitId: string,
  currentQuantities: Record<string, number>,
  isAdding: boolean
): Record<string, number> => {
  const currentQuantity = currentQuantities[unitId] || 0;
  
  if (isAdding) {
    return {
      ...currentQuantities,
      [unitId]: Math.min(currentQuantity + 1, 9),
    };
  } else {
    return {
      ...currentQuantities,
      [unitId]: Math.max(currentQuantity - 1, 0),
    };
  }
};

export const updateSelectedUnits = (
  selectedUnits: SelectedUnit[],
  unit: Unit | undefined,
  isAdding: boolean
): SelectedUnit[] => {
  if (!unit) return selectedUnits;

  const existingUnit = selectedUnits.find((u) => u.id === unit.id);
  
  if (isAdding) {
    if (existingUnit) {
      return selectedUnits.map((u) =>
        u.id === unit.id
          ? { ...u, quantity: Math.min(u.quantity + 1, 9) }
          : u
      );
    }
    return [...selectedUnits, { ...unit, quantity: 1 }];
  } else {
    const updatedUnits = selectedUnits.map((u) =>
      u.id === unit.id ? { ...u, quantity: u.quantity - 1 } : u
    );
    return updatedUnits.filter((u) => u.quantity > 0);
  }
};