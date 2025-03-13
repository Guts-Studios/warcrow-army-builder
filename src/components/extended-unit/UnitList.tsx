
import { useState } from "react";
import { ExtendedUnit } from "@/types/extended-unit";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UnitListProps {
  units: ExtendedUnit[];
}

const UnitList = ({ units }: UnitListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [factionFilter, setFactionFilter] = useState("all");
  const navigate = useNavigate();

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFaction = factionFilter === "all" || unit.faction === factionFilter;
    return matchesSearch && matchesFaction;
  });

  const factions = [
    { id: "northern-tribes", name: "Northern Tribes" },
    { id: "hegemony-of-embersig", name: "Hegemony of Embersig" },
    { id: "scions-of-yaldabaoth", name: "Scions of Yaldabaoth" },
    { id: "syenann", name: "Sÿenann" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-warcrow-muted" />
          <Input
            placeholder="Search units..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={factionFilter} onValueChange={setFactionFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by faction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Factions</SelectItem>
            {factions.map(faction => (
              <SelectItem key={faction.id} value={faction.id}>
                {faction.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnits.map(unit => (
          <Card key={unit.id} className="bg-warcrow-accent hover:bg-warcrow-accent/80 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <CardTitle className="text-warcrow-gold flex justify-between items-center">
                <span>{unit.name}</span>
                <span className="text-base">{unit.pointsCost} pts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="text-sm text-warcrow-muted">
                  <span className="font-semibold text-warcrow-text">Faction:</span>{" "}
                  {factions.find(f => f.id === unit.faction)?.name}
                </div>
                <div className="flex flex-wrap gap-2">
                  {unit.keywords.slice(0, 3).map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-warcrow-background text-xs rounded">
                      {keyword.name}
                    </span>
                  ))}
                  {unit.keywords.length > 3 && (
                    <span className="px-2 py-1 bg-warcrow-background text-xs rounded">
                      +{unit.keywords.length - 3} more
                    </span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
                  onClick={() => navigate(`/playmode/${unit.id}`)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredUnits.length === 0 && (
        <div className="text-center py-8 text-warcrow-muted">
          No units found matching your search criteria.
        </div>
      )}
    </div>
  );
};

export default UnitList;
