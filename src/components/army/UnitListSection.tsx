import { useState } from "react";
import { Unit, SortOption } from "@/types/army";
import UnitCard from "../UnitCard";
import SortControls from "./SortControls";

interface UnitListSectionProps {
  factionUnits: Unit[];
  quantities: Record<string, number>;
  onAdd: (unitId: string) => void;
  onRemove: (unitId: string) => void;
}

const UnitListSection = ({ 
  factionUnits,
  quantities,
  onAdd,
  onRemove 
}: UnitListSectionProps) => {
  const [sortBy, setSortBy] = useState<SortOption>("points-asc");

  const sortedUnits = [...factionUnits].sort((a, b) => {
    switch (sortBy) {
      case "points-asc":
        return a.pointsCost - b.pointsCost;
      case "points-desc":
        return b.pointsCost - a.pointsCost;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-3">
      <SortControls sortBy={sortBy} onSortChange={(value) => setSortBy(value)} />
      <div className="grid grid-cols-1 gap-3">
        {sortedUnits.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            quantity={quantities[unit.id] || 0}
            onAdd={() => onAdd(unit.id)}
            onRemove={() => onRemove(unit.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default UnitListSection;