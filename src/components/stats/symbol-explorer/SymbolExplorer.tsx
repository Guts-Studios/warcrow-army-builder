
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SymbolGrid } from "./SymbolGrid";
import { SymbolDetails } from "./SymbolDetails";
import { GameSymbol } from "@/components/stats/GameSymbol";
import { NumericInput } from "./NumericInput";
import { SymbolControls } from "./SymbolControls";

const SymbolExplorer: React.FC = () => {
  const [customChar, setCustomChar] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(48);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [codeRange, setCodeRange] = useState<[number, number]>([57344, 57444]); // Default Warcrow font range

  // Generate array of symbol codes in the specified range
  const symbols = Array.from(
    { length: codeRange[1] - codeRange[0] + 1 },
    (_, i) => codeRange[0] + i
  );

  // Filter symbols based on search query (optional functionality)
  const filteredSymbols = searchQuery
    ? symbols.filter((code) => {
        const hexCode = code.toString(16).toUpperCase();
        return hexCode.includes(searchQuery.toUpperCase());
      })
    : symbols;

  const handleSymbolClick = (code: number) => {
    setSelectedSymbol(code);
    setCustomChar(String.fromCharCode(code));
  };

  const handleRangeChange = (start: number, end: number) => {
    setCodeRange([start, end]);
    setSelectedSymbol(null);
    setCustomChar("");
  };

  // If no symbol is selected initially, show the first one
  useEffect(() => {
    if (symbols.length > 0 && !selectedSymbol && !customChar) {
      handleSymbolClick(symbols[0]);
    }
  }, [symbols, selectedSymbol, customChar]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-warcrow-gold">Symbol Explorer</h2>
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search by hex code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/80 border border-warcrow-gold/30 text-warcrow-text focus:border-warcrow-gold"
          />
        </div>
      </div>

      <SymbolControls 
        codeRange={codeRange}
        onRangeChange={handleRangeChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SymbolGrid 
            symbols={filteredSymbols}
            selectedSymbol={selectedSymbol}
            handleSymbolClick={handleSymbolClick}
            fontSize={fontSize}
          />
        </div>
        
        <div>
          <SymbolDetails 
            customChar={customChar}
            fontSize={fontSize}
            setFontSize={setFontSize}
          />
        </div>
      </div>
    </div>
  );
};

export default SymbolExplorer;
