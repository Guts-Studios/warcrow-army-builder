
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SymbolGrid } from "./SymbolGrid";
import { SymbolDetails } from "./SymbolDetails";
import { GameSymbol } from "@/components/stats/GameSymbol";

// Import the symbol configurations from UnitStatCard
interface SymbolConfig {
  symbol: string;
  fontChar: string;
  color: string;
}

// Define the symbol configurations that match what's in UnitStatCard.tsx
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

  // Filter symbols based on search query
  const filteredSymbols = searchQuery
    ? symbolConfigs.filter((config) => {
        return (
          config.symbol.includes(searchQuery) || 
          config.fontChar.includes(searchQuery) ||
          config.color.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : symbolConfigs;

  // If no symbol is selected initially, show the first one
  useEffect(() => {
    if (symbolConfigs.length > 0 && !selectedSymbolConfig) {
      setSelectedSymbolConfig(symbolConfigs[0]);
    }
  }, [selectedSymbolConfig]);

  return (
    <div className="space-y-6 bg-white" style={{ backgroundColor: 'white' }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-black">Game Symbol Explorer</h2>
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-gray-300 text-black focus:border-black"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div>
            <h3 className="text-black/90 text-sm mb-3 font-medium">
              Available Game Symbols <span className="text-black/60 text-xs font-normal">({filteredSymbols.length} symbols)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {filteredSymbols.map((config, index) => (
                <div
                  key={index}
                  className={`
                    p-3 rounded-md border transition-all cursor-pointer flex flex-col items-center
                    ${selectedSymbolConfig === config 
                      ? "bg-black/10 border-black" 
                      : "bg-white border-gray-300 hover:bg-black/5"}
                  `}
                  onClick={() => setSelectedSymbolConfig(config)}
                >
                  <div className="mb-2 flex items-center justify-center">
                    <span 
                      className="Warcrow-Family font-warcrow"
                      style={{ 
                        fontSize: `${fontSize}px`,
                        color: config.color
                      }}
                    >
                      {config.fontChar}
                    </span>
                  </div>
                  <div className="text-xs text-black text-center">{config.symbol}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          {selectedSymbolConfig ? (
            <div className="bg-white p-6 rounded-lg border border-gray-300">
              <h3 className="text-black text-lg mb-4 font-medium">Symbol Details</h3>
              
              <div className="space-y-4">
                <div 
                  className="game-symbol bg-gray-100 p-8 rounded-md border border-gray-200 flex items-center justify-center mb-4"
                  style={{ fontSize: `${fontSize * 1.5}px` }}
                >
                  <span 
                    className="Warcrow-Family font-warcrow"
                    style={{ color: selectedSymbolConfig.color }}
                  >
                    {selectedSymbolConfig.fontChar}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-black/90 block mb-2">
                    Font Size
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[24, 36, 48, 60, 72].map((size) => (
                      <Button 
                        key={size}
                        size="sm"
                        variant="outline"
                        onClick={() => setFontSize(size)}
                        className={`
                          ${fontSize === size 
                            ? "bg-black/10 border-black text-black" 
                            : "bg-white border-gray-300 text-black hover:bg-black/5"}
                        `}
                      >
                        {size}px
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-black/90 text-sm mb-3 font-medium">Symbol Configuration</h4>
                  <div className="space-y-2 text-black">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-black/60">Symbol:</span>
                      <span className="text-black col-span-2">{selectedSymbolConfig.symbol}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-black/60">Font Character:</span>
                      <span className="text-black col-span-2">{selectedSymbolConfig.fontChar}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-black/60">Color:</span>
                      <span className="text-black col-span-2" style={{display: 'flex', alignItems: 'center'}}>
                        {selectedSymbolConfig.color}
                        <span className="inline-block w-4 h-4 ml-2 rounded-full" style={{backgroundColor: selectedSymbolConfig.color}}></span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-black/90 text-sm mb-3 font-medium">Usage Code</h4>
                  <div className="space-y-2">
                    <pre className="bg-gray-100 p-3 rounded text-black block overflow-x-auto text-xs whitespace-pre-wrap">
                      {`{ symbol: '${selectedSymbolConfig.symbol}', fontChar: '${selectedSymbolConfig.fontChar}', color: '${selectedSymbolConfig.color}' },`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg border border-gray-300 text-center">
              <p className="text-black/80">Select a symbol to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolExplorer;
