import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { factions } from "@/data/factions";

interface FactionSelectorProps {
  selectedFaction: string;
  onFactionChange: (faction: string) => void;
}

const FactionSelector = ({ selectedFaction, onFactionChange }: FactionSelectorProps) => {
  return (
    <div className="w-full max-w-xs mx-auto mb-8">
      <Select value={selectedFaction} onValueChange={onFactionChange}>
        <SelectTrigger className="w-full bg-warcrow-accent text-warcrow-text border-warcrow-gold">
          <SelectValue placeholder="Select a faction" />
        </SelectTrigger>
        <SelectContent className="bg-warcrow-accent border-warcrow-gold">
          {factions.map((faction) => (
            <SelectItem
              key={faction.id}
              value={faction.id}
              className="text-warcrow-text hover:bg-warcrow-gold hover:text-warcrow-background cursor-pointer"
            >
              {faction.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FactionSelector;