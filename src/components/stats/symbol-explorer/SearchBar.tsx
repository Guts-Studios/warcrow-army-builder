
import React from "react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <h2 className="text-xl font-semibold text-warcrow-gold">Game Symbol Explorer</h2>
      <div className="relative w-full sm:w-64">
        <Input
          type="text"
          placeholder="Search symbols..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-black/40 border border-warcrow-gold/30 text-white focus:border-warcrow-gold"
        />
      </div>
    </div>
  );
};

export default SearchBar;
