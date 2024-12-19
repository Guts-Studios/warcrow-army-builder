import { useState } from "react";
import { Unit } from "@/types/army";
import UnitCard from "./UnitCard";
import { units } from "@/data/factions";

interface ArmyListProps {
  selectedFaction: string;
}

const ArmyList = ({ selectedFaction }: ArmyListProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  const factionUnits = units.filter((unit) => unit.faction === selectedFaction);
  
  const handleAdd = (unitId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [unitId]: (prev[unitId] || 0) + 1,
    }));
  };

  const handleRemove = (unitId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [unitId]: Math.max((prev[unitId] || 0) - 1, 0),
    }));
  };

  const totalPoints = factionUnits.reduce(
    (total, unit) => total + unit.pointsCost * (quantities[unit.id] || 0),
    0
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {factionUnits.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            quantity={quantities[unit.id] || 0}
            onAdd={() => handleAdd(unit.id)}
            onRemove={() => handleRemove(unit.id)}
          />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-warcrow-background border-t border-warcrow-gold p-4">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-warcrow-text">Total Army Points:</span>
          <span className="text-warcrow-gold text-xl font-bold">{totalPoints} pts</span>
        </div>
      </div>
    </div>
  );
};

export default ArmyList;