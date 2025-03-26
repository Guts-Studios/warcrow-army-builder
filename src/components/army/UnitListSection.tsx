
import { useState } from "react";
import { Unit, SortOption } from "@/types/army";
import UnitCard from "../UnitCard";
import SortControls from "./SortControls";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { characteristicDefinitions } from "@/data/characteristicDefinitions";

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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);

  // Get all unique characteristics across all units
  const allCharacteristics = Array.from(
    new Set(
      factionUnits.flatMap(unit => 
        unit.keywords
          .filter(k => 
            ["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
             "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
             "Construct", "Undead", "Mounted", "High Command"].includes(
               typeof k === 'string' ? k : k.name
             )
          )
          .map(k => typeof k === 'string' ? k : k.name)
      )
    )
  ).sort();

  // Get all unique keywords (excluding characteristics)
  const allKeywords = Array.from(
    new Set(
      factionUnits.flatMap(unit => 
        unit.keywords
          .filter(k => 
            !["Infantry", "Character", "Companion", "Colossal Company", "Orc", "Human", 
              "Dwarf", "Ghent", "Aestari", "Elf", "Varank", "Nemorous", "Beast", 
              "Construct", "Undead", "Mounted", "High Command"].includes(
                typeof k === 'string' ? k : k.name
              )
          )
          .map(k => typeof k === 'string' ? k : k.name)
      )
    )
  ).sort();

  const handleCharacteristicToggle = (characteristic: string) => {
    setSelectedCharacteristics(prev => {
      if (prev.includes(characteristic)) {
        return prev.filter(c => c !== characteristic);
      } else {
        return [...prev, characteristic];
      }
    });
  };

  // Filter units based on search query and selected characteristics
  const filteredUnits = factionUnits.filter(unit => {
    // Text search filter
    const matchesSearch = searchQuery === "" || 
      unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (unit.keywords && unit.keywords.some(keyword => {
        const keywordName = typeof keyword === 'string' ? keyword : keyword.name;
        return keywordName.toLowerCase().includes(searchQuery.toLowerCase());
      })) ||
      (unit.specialRules && unit.specialRules.some(rule => 
        rule.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    // Characteristic filter
    const matchesCharacteristics = selectedCharacteristics.length === 0 || 
      selectedCharacteristics.every(characteristic => {
        const hasCharacteristic = unit.keywords.some(keyword => {
          const keywordName = typeof keyword === 'string' ? keyword : keyword.name;
          return keywordName === characteristic;
        });
        const isHighCommand = characteristic === "High Command" && unit.highCommand;
        
        return hasCharacteristic || isHighCommand;
      });

    return matchesSearch && matchesCharacteristics;
  });

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
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-warcrow-gold hover:text-warcrow-gold/80 focus:outline-none"
            aria-label="Toggle filters"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
        
        {showFilters && (
          <div className="p-3 bg-warcrow-background/80 border border-warcrow-gold/30 rounded-md space-y-3">
            <h3 className="text-sm font-semibold text-warcrow-gold">Filter by Characteristics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allCharacteristics.map(characteristic => (
                <div key={characteristic} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`characteristic-${characteristic}`}
                    checked={selectedCharacteristics.includes(characteristic)}
                    onCheckedChange={() => handleCharacteristicToggle(characteristic)}
                    className="data-[state=checked]:bg-warcrow-gold data-[state=checked]:text-black border-warcrow-gold/70"
                  />
                  <label 
                    htmlFor={`characteristic-${characteristic}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-warcrow-text"
                  >
                    {characteristic}
                  </label>
                </div>
              ))}
            </div>
            
            {selectedCharacteristics.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedCharacteristics([])}
                  className="text-xs text-warcrow-gold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        )}
        
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
            onClick={() => {
              setSearchQuery("");
              setSelectedCharacteristics([]);
            }}
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
