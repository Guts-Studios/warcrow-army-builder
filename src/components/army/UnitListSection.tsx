
import { useState } from "react";
import { Unit, SortOption } from "@/types/army";
import UnitCard from "../UnitCard";
import SortControls from "./SortControls";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter units based on search query
  const filteredUnits = factionUnits.filter(unit => 
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (unit.keywords && unit.keywords.some(keyword => 
      typeof keyword === 'string' 
        ? keyword.toLowerCase().includes(searchQuery.toLowerCase())
        : keyword.name.toLowerCase().includes(searchQuery.toLowerCase())
    )) ||
    (unit.specialRules && unit.specialRules.some(rule => 
      rule.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  );

  // Sort filtered units
  const sortedUnits = [...filteredUnits].sort((a, b) => {
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
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search units by name, keywords, or special rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 bg-warcrow-accent/50 border-warcrow-gold/70 text-warcrow-text placeholder:text-warcrow-muted"
          />
        </div>
        <SortControls sortBy={sortBy} onSortChange={(value) => setSortBy(value)} />
      </div>
      
      {sortedUnits.length > 0 ? (
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
      ) : (
        <div className="py-8 text-center">
          <p className="text-warcrow-muted">No units match your search criteria.</p>
          <button 
            onClick={() => setSearchQuery("")}
            className="mt-2 text-warcrow-gold hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default UnitListSection;
