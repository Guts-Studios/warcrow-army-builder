
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SymbolGrid } from "./SymbolGrid";
import { SymbolDetails } from "./SymbolDetails";
import { GameSymbol } from "@/components/stats/GameSymbol";
import { NumericInput } from "./NumericInput";
import { SymbolControls } from "./SymbolControls";

interface PresetRange {
  name: string;
  start: number;
  end: number;
}

const SymbolExplorer: React.FC = () => {
  const [customChar, setCustomChar] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(48);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [range, setRange] = useState<{ start: number; end: number }>({ 
    start: 57344, 
    end: 57444 
  }); // Default Warcrow font range
  
  // Preset ranges for quick selection
  const presetRanges: PresetRange[] = [
    { name: "Warcrow", start: 57344, end: 57444 },
    { name: "ASCII", start: 32, end: 126 },
    { name: "Numbers", start: 48, end: 57 },
    { name: "Latin", start: 65, end: 122 },
    { name: "Symbols", start: 33, end: 47 }
  ];

  // Generate array of symbol codes in the specified range
  const symbols = Array.from(
    { length: range.end - range.start + 1 },
    (_, i) => range.start + i
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

  const handleCustomCharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomChar(value.length > 0 ? value[0] : "");
    if (value.length > 0) {
      const code = value.charCodeAt(0);
      setSelectedSymbol(code);
    }
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
        range={range}
        setRange={setRange}
        customChar={customChar}
        onCustomCharChange={handleCustomCharChange}
        fontSize={fontSize}
        setFontSize={setFontSize}
        presetRanges={presetRanges}
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
