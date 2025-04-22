
import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useSearch } from "@/contexts/SearchContext";

export const RulesSearch = () => {
  const { searchTerm, setSearchTerm, caseSensitive, setCaseSensitive } = useSearch();

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search rules..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="case-sensitive"
          checked={caseSensitive}
          onCheckedChange={setCaseSensitive}
        />
        <Label htmlFor="case-sensitive" className="text-sm flex items-center gap-2">
          Case sensitive search
          <span className="text-xs px-2 py-0.5 rounded-full bg-warcrow-accent/20">
            {caseSensitive ? "ON" : "OFF"}
          </span>
        </Label>
      </div>
    </div>
  );
};
