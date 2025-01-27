import * as React from 'react';
import { Session } from '@supabase/supabase-js';
import { useState } from 'react';
import { factions } from '@/data/factions';
import { SortOption, SelectedUnit } from '@/types/army';
import FactionSelector from '../FactionSelector';
import SelectedUnitsSection from './SelectedUnitsSection';
import UnitListSection from './UnitListSection';
import TotalPoints from './TotalPoints';
import ListManagement from '../ListManagement';

interface ArmyBuilderProps {
  session: Session | null;
}

export const ArmyBuilder: React.FC<ArmyBuilderProps> = ({ session }) => {
  const [selectedFaction, setSelectedFaction] = useState<string | null>(null);
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [currentListName, setCurrentListName] = useState<string | null>(null);

  const handleFactionSelect = (factionId: string) => {
    setSelectedFaction(factionId);
    setSelectedUnits([]);
    setQuantities({});
    setCurrentListName(null);
  };

  const handleAddUnit = (unitId: string) => {
    const faction = factions.find(f => f.id === selectedFaction);
    if (!faction) return;

    const unit = units.find(u => u.id === unitId);
    if (!unit) return;

    const newQuantity = (quantities[unitId] || 0) + 1;
    setQuantities(prev => ({ ...prev, [unitId]: newQuantity }));

    const existingUnit = selectedUnits.find(u => u.id === unitId);
    if (existingUnit) {
      setSelectedUnits(prev =>
        prev.map(u =>
          u.id === unitId ? { ...u, quantity: newQuantity } : u
        )
      );
    } else {
      setSelectedUnits(prev => [
        ...prev,
        { ...unit, quantity: 1 }
      ]);
    }
  };

  const handleRemoveUnit = (unitId: string) => {
    const currentQuantity = quantities[unitId] || 0;
    if (currentQuantity <= 1) {
      const newQuantities = { ...quantities };
      delete newQuantities[unitId];
      setQuantities(newQuantities);
      setSelectedUnits(prev => prev.filter(u => u.id !== unitId));
    } else {
      setQuantities(prev => ({
        ...prev,
        [unitId]: currentQuantity - 1
      }));
      setSelectedUnits(prev =>
        prev.map(u =>
          u.id === unitId
            ? { ...u, quantity: currentQuantity - 1 }
            : u
        )
      );
    }
  };

  const factionUnits = selectedFaction
    ? units.filter(unit => unit.faction === selectedFaction)
    : [];

  return (
    <div className="space-y-6">
      <FactionSelector
        selectedFaction={selectedFaction}
        onSelect={handleFactionSelect}
      />
      
      {selectedFaction && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <UnitListSection
            factionUnits={factionUnits}
            quantities={quantities}
            onAdd={handleAddUnit}
            onRemove={handleRemoveUnit}
          />
          <SelectedUnitsSection
            selectedUnits={selectedUnits}
            currentListName={currentListName}
            onRemove={handleRemoveUnit}
          />
        </div>
      )}

      {selectedUnits.length > 0 && (
        <>
          <ListManagement
            selectedUnits={selectedUnits}
            selectedFaction={selectedFaction}
            session={session}
            onListLoad={(name) => setCurrentListName(name)}
            onListClear={() => {
              setSelectedUnits([]);
              setQuantities({});
              setCurrentListName(null);
            }}
          />
          <TotalPoints selectedUnits={selectedUnits} />
        </>
      )}
    </div>
  );
};

export default ArmyBuilder;