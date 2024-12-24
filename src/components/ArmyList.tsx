import { useState, useEffect } from "react";
import { Unit, SelectedUnit, SavedList, SortOption } from "@/types/army";
import UnitCard from "./UnitCard";
import { units } from "@/data/factions";
import { useToast } from "./ui/use-toast";
import ListManagement from "./ListManagement";
import SelectedUnits from "./SelectedUnits";
import { validateHighCommandAddition } from "@/utils/armyValidation";
import SortControls from "./army/SortControls";
import HighCommandAlert from "./army/HighCommandAlert";
import TotalPoints from "./army/TotalPoints";
import FactionSelector from "./FactionSelector";
import { useIsMobile } from "@/hooks/use-mobile";

interface ArmyListProps {
  selectedFaction: string;
  onFactionChange: (faction: string) => void;
  onUnitsChange: (units: SelectedUnit[]) => void;
  onListNameChange: (name: string | null) => void;
}

const ArmyList = ({ 
  selectedFaction, 
  onFactionChange,
  onUnitsChange,
  onListNameChange 
}: ArmyListProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [listName, setListName] = useState("");
  const [currentListName, setCurrentListName] = useState<string | null>(null);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("points-asc");
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const factionUnits = units.filter((unit) => unit.faction === selectedFaction);
  
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

  useEffect(() => {
    const lists = localStorage.getItem("armyLists");
    if (lists) {
      setSavedLists(JSON.parse(lists));
    }
  }, []);

  const handleAdd = (unitId: string) => {
    const unit = factionUnits.find((u) => u.id === unitId);
    if (!unit) return;

    if (!validateHighCommandAddition(selectedUnits, unit)) {
      setShowHighCommandAlert(true);
      return;
    }

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

  const handleNewList = () => {
    setQuantities({});
    setSelectedUnits([]);
    setListName("");
    setCurrentListName(null);
    toast({
      title: "New List Created",
      description: "Started a new empty list",
    });
  };

  const handleSaveList = () => {
    if (!listName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your list",
        variant: "destructive",
      });
      return;
    }

    const newList: SavedList = {
      id: Date.now().toString(),
      name: listName,
      faction: selectedFaction,
      units: selectedUnits,
    };

    const updatedLists = [...savedLists, newList];
    setSavedLists(updatedLists);
    localStorage.setItem("armyLists", JSON.stringify(updatedLists));
    setCurrentListName(listName);

    toast({
      title: "Success",
      description: "Army list saved successfully",
    });
    setListName("");
  };

  const handleLoadList = (list: SavedList) => {
    setSelectedUnits(list.units);
    const newQuantities: Record<string, number> = {};
    list.units.forEach((unit) => {
      newQuantities[unit.id] = unit.quantity;
    });
    setQuantities(newQuantities);
    setCurrentListName(list.name);
    
    toast({
      title: "Success",
      description: `Loaded army list: ${list.name}`,
    });
  };

  useEffect(() => {
    onUnitsChange(selectedUnits);
  }, [selectedUnits, onUnitsChange]);

  useEffect(() => {
    onListNameChange(currentListName);
  }, [currentListName, onListNameChange]);

  return (
    <>
      <HighCommandAlert 
        open={showHighCommandAlert} 
        onOpenChange={setShowHighCommandAlert} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20 md:pb-16">
        <div className="space-y-4 order-2 md:order-1">
          <SortControls sortBy={sortBy} onSortChange={(value) => setSortBy(value)} />
          <div className="grid grid-cols-1 gap-4">
            {sortedUnits.map((unit) => (
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

        <div className="space-y-4 order-1 md:order-2">
          <ListManagement
            listName={listName}
            currentListName={currentListName}
            onListNameChange={setListName}
            onSaveList={handleSaveList}
            onLoadList={handleLoadList}
            onNewList={handleNewList}
            savedLists={savedLists}
            selectedFaction={selectedFaction}
            selectedUnits={selectedUnits}
          />
          
          {isMobile && (
            <FactionSelector
              selectedFaction={selectedFaction}
              onFactionChange={onFactionChange}
            />
          )}
          
          <h2 className="text-2xl font-bold text-warcrow-gold mb-4 hidden md:block">
            Selected Units
          </h2>
          
          <h2 className="text-2xl font-bold text-warcrow-gold mb-4 block md:hidden mt-8">
            Selected Units
          </h2>

          <SelectedUnits
            selectedUnits={selectedUnits}
            onRemove={handleRemove}
          />
        </div>
      </div>

      <TotalPoints selectedUnits={selectedUnits} />
    </>
  );
};

export default ArmyList;