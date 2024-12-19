import { useState, useEffect } from "react";
import { Unit } from "@/types/army";
import UnitCard from "./UnitCard";
import { units } from "@/data/factions";
import { useToast } from "./ui/use-toast";
import ListManagement from "./ListManagement";
import SelectedUnits from "./SelectedUnits";
import { validateHighCommandAddition } from "@/utils/armyValidation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArmyListProps {
  selectedFaction: string;
}

interface SelectedUnit extends Unit {
  quantity: number;
}

interface SavedList {
  id: string;
  name: string;
  faction: string;
  units: SelectedUnit[];
}

type SortOption = "points-asc" | "points-desc" | "name-asc" | "name-desc";

const ArmyList = ({ selectedFaction }: ArmyListProps) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<SelectedUnit[]>([]);
  const [listName, setListName] = useState("");
  const [currentListName, setCurrentListName] = useState<string | null>(null);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("points-asc");
  const [showHighCommandAlert, setShowHighCommandAlert] = useState(false);
  const { toast } = useToast();
  
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

  const totalPoints = selectedUnits.reduce(
    (total, unit) => total + unit.pointsCost * unit.quantity,
    0
  );

  return (
    <>
      <AlertDialog open={showHighCommandAlert} onOpenChange={setShowHighCommandAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>High Command Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              Your army list can only include one High Command unit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20 md:pb-16">
        <div className="space-y-4 order-2 md:order-1">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-warcrow-gold">
              Available Units
            </h2>
            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as SortOption)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="points-asc">Points ↑</SelectItem>
                <SelectItem value="points-desc">Points ↓</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
            Selected Units
          </h2>
          
          <ListManagement
            listName={listName}
            currentListName={currentListName}
            onListNameChange={setListName}
            onSaveList={handleSaveList}
            onLoadList={handleLoadList}
            onNewList={handleNewList}
            savedLists={savedLists}
            selectedFaction={selectedFaction}
          />

          <SelectedUnits
            selectedUnits={selectedUnits}
            onRemove={handleRemove}
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-warcrow-background border-t border-warcrow-gold p-4">
          <div className="container max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-warcrow-text">Total Army Points:</span>
            <span className="text-warcrow-gold text-xl font-bold">
              {selectedUnits.reduce(
                (total, unit) => total + unit.pointsCost * unit.quantity,
                0
              )} pts
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArmyList;
