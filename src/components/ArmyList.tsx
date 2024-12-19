import { useState } from "react";
import { Unit } from "@/types/army";
import UnitCard from "./UnitCard";
import { units } from "@/data/factions";
import { Button } from "./ui/button";
import { Minus } from "lucide-react";

interface ArmyListProps {
  selectedFaction: string;
}

interface SelectedUnit extends Unit {
  quantity: number;
}

const ArmyList = ({ selectedFaction }: ArmyListProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  
  const factionUnits = units.filter((unit) => unit.faction === selectedFaction);
  
  const handleAdd = (unitId: string) => {
    const unit = factionUnits.find((u) => u.id === unitId);
    if (!unit) return;

    setQuantities((prev) => ({
      ...prev,
      [unitId]: (prev[unitId] || 0) + 1,
    }));

    setSelectedUnits((prev) => {
      const existingUnit = prev.find((u) => u.id === unitId);
      if (existingUnit) {
        return prev.map((u) =>
          u.id === unitId ? { ...u, quantity: u.quantity + 1 } : u
        );
      }
      return [...prev, { ...unit, quantity: 1 }];
    });
  };

  const handleRemove = (unitId: string) => {
    setQuantities((prev) => ({
      ...prev,
      [unitId]: Math.max((prev[unitId] || 0) - 1, 0),
    }));

    setSelectedUnits((prev) => {
      const updatedUnits = prev.map((u) =>
        u.id === unitId ? { ...u, quantity: u.quantity - 1 } : u
      );
      return updatedUnits.filter((u) => u.quantity > 0);
    });
  };

  const totalPoints = selectedUnits.reduce(
    (total, unit) => total + unit.pointsCost * unit.quantity,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Available Units */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Available Units</h2>
        <div className="grid grid-cols-1 gap-4">
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
      </div>

      {/* Selected Units */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Selected Units</h2>
        <div className="bg-warcrow-accent rounded-lg p-4 space-y-2">
          {selectedUnits.map((unit) => (
            <div
              key={unit.id}
              className="flex items-center justify-between bg-warcrow-background p-2 rounded"
            >
              <div className="flex items-center gap-2">
                <span className="text-warcrow-text">
                  {unit.name} x{unit.quantity}
                </span>
                <span className="text-warcrow-muted">
                  ({unit.pointsCost * unit.quantity} pts)
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(unit.id)}
                className="h-8 w-8 text-warcrow-gold hover:text-warcrow-gold/80"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {selectedUnits.length === 0 && (
            <p className="text-warcrow-muted text-center py-4">
              No units selected
            </p>
          )}
        </div>
      </div>

      {/* Total Points Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-warcrow-background border-t border-warcrow-gold p-4">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <span className="text-warcrow-text">Total Army Points:</span>
          <span className="text-warcrow-gold text-xl font-bold">
            {totalPoints} pts
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArmyList;