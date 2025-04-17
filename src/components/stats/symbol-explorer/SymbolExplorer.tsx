
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SymbolGrid } from "./SymbolGrid";
import { SymbolDetails } from "./SymbolDetails";
import { GameSymbol } from "@/components/stats/GameSymbol";

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

  const filteredSymbols = searchQuery
    ? symbolConfigs.filter((config) => {
        return (
          config.symbol.includes(searchQuery) || 
          config.fontChar.includes(searchQuery) ||
          config.color.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : symbolConfigs;

  useEffect(() => {
    if (symbolConfigs.length > 0 && !selectedSymbolConfig) {
      setSelectedSymbolConfig(symbolConfigs[0]);
    }
  }, [selectedSymbolConfig]);

  return (
    <div className="space-y-6 bg-black p-6 rounded-lg">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div>
            <h3 className="text-warcrow-text/90 text-sm mb-3 font-medium">
              Available Game Symbols <span className="text-warcrow-text/60 text-xs font-normal">({filteredSymbols.length} symbols)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {filteredSymbols.map((config, index) => (
                <div
                  key={index}
                  className={`
                    p-3 rounded-md border transition-all cursor-pointer flex flex-col items-center
                    bg-[#F1F0FB] border-gray-300
                    ${selectedSymbolConfig === config 
                      ? "ring-2 ring-warcrow-gold" 
                      : "hover:bg-gray-200"}
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
            <div className="bg-black/40 p-6 rounded-lg border border-warcrow-gold/30">
              <h3 className="text-warcrow-gold text-lg mb-4 font-medium">Symbol Details</h3>
              
              <div className="space-y-4">
                <div 
                  className="bg-white p-8 rounded-md border border-gray-200 flex items-center justify-center mb-4"
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
                  <div className="text-sm text-warcrow-text/90 block mb-2">
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
                            ? "bg-warcrow-gold/20 border-warcrow-gold text-warcrow-gold" 
                            : "bg-black/40 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10"}
                        `}
                      >
                        {size}px
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
                  <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Symbol Configuration</h4>
                  <div className="space-y-2 text-warcrow-text">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-warcrow-text/60">Symbol:</span>
                      <span className="text-warcrow-gold col-span-2">{selectedSymbolConfig.symbol}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-warcrow-text/60">Font Character:</span>
                      <span className="text-warcrow-gold col-span-2">{selectedSymbolConfig.fontChar}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-warcrow-text/60">Color:</span>
                      <span className="text-warcrow-gold col-span-2" style={{display: 'flex', alignItems: 'center'}}>
                        {selectedSymbolConfig.color}
                        <span className="inline-block w-4 h-4 ml-2 rounded-full" style={{backgroundColor: selectedSymbolConfig.color}}></span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
                  <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Usage Code</h4>
                  <div className="space-y-2">
                    <pre className="bg-black/60 p-3 rounded text-warcrow-gold block overflow-x-auto text-xs whitespace-pre-wrap">
                      {`{ symbol: '${selectedSymbolConfig.symbol}', fontChar: '${selectedSymbolConfig.fontChar}', color: '${selectedSymbolConfig.color}' },`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 p-8 rounded-lg border border-warcrow-gold/30 text-center">
              <p className="text-warcrow-text/80">Select a symbol to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolExplorer;
