
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import SymbolCreationForm from "./SymbolCreationForm";
import SymbolList from "./SymbolList";
import SymbolDetailView from "./SymbolDetailView";
import { toast } from "sonner";

interface SymbolConfig {
  symbol: string;
  fontChar: string;
  color: string;
}

const symbolConfigs: SymbolConfig[] = [
  { symbol: '🔴', fontChar: 'w', color: '#FF3850' }, // Red symbol
  { symbol: '🟠', fontChar: 'q', color: '#FF8C00' }, // Orange symbol
  { symbol: '🟢', fontChar: '9', color: '#22C55E' }, // Green symbol
  { symbol: '⚫', fontChar: '7', color: '#000000' }, // Black symbol
  { symbol: '🔵', fontChar: '8', color: '#3B82F6' }, // Blue symbol
  { symbol: '🟡', fontChar: '0', color: '#FACC15' }, // Yellow symbol
  { symbol: '⭐', fontChar: '1', color: '#FFD700' }, // Star symbol
];

const SymbolExplorer: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(48);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbolConfig, setSelectedSymbolConfig] = useState<SymbolConfig | null>(null);
  const [symbols, setSymbols] = useState<SymbolConfig[]>(symbolConfigs);
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredSymbols = searchQuery
    ? symbols.filter((config) => {
        return (
          config.symbol.includes(searchQuery) || 
          config.fontChar.includes(searchQuery) ||
          config.color.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : symbols;

  useEffect(() => {
    if (symbols.length > 0 && !selectedSymbolConfig) {
      setSelectedSymbolConfig(symbols[0]);
    }
  }, [selectedSymbolConfig, symbols]);

  const handleAddSymbol = (symbol: SymbolConfig) => {
    // Add the new symbol
    const newSymbols = [...symbols, symbol];
    setSymbols(newSymbols);
    setSelectedSymbolConfig(symbol);
    setShowAddForm(false);
    toast.success("New symbol added successfully!");
  };

  return (
    <div className="space-y-6 bg-black p-6 rounded-lg">
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div>
            <SymbolCreationForm 
              symbols={symbols}
              onAddSymbol={handleAddSymbol}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
            />
            
            <SymbolList 
              symbols={filteredSymbols}
              selectedSymbolConfig={selectedSymbolConfig}
              setSelectedSymbolConfig={setSelectedSymbolConfig}
              fontSize={fontSize}
            />
          </div>
        </div>
        
        <div>
          <SymbolDetailView 
            selectedSymbolConfig={selectedSymbolConfig}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        </div>
      </div>
    </div>
  );
};

export default SymbolExplorer;
