
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SymbolControls } from "./SymbolControls";
import { SelectedSymbol } from "./SelectedSymbol";
import { SymbolGrid } from "./SymbolGrid";
import { SymbolDetails } from "./SymbolDetails";
import { NumericInput } from "./NumericInput";

export const SymbolExplorer = () => {
  // Start with the private use area (E000-F8FF) where custom glyphs are often mapped
  const [range, setRange] = useState({ start: 0xE000, end: 0xE0FF });
  const [customChar, setCustomChar] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<number>(36);
  const [activeTab, setActiveTab] = useState<string>("grid");
  // Always show numeric input by default
  const [showNumericInput, setShowNumericInput] = useState<boolean>(true);

  // Generate an array of character codes
  const generateSymbolGrid = () => {
    const symbols = [];
    for (let i = range.start; i <= range.end; i++) {
      symbols.push(i);
    }
    return symbols;
  };

  const symbols = generateSymbolGrid();

  const handleSymbolClick = (code: number) => {
    setCustomChar(String.fromCharCode(code));
    setSelectedSymbol(code);
  };

  const handleNumericInput = (value: string) => {
    try {
      // Try parsing as a simple number first
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        const char = String.fromCharCode(numValue);
        setCustomChar(char);
        setSelectedSymbol(numValue);
      }
    } catch (e) {
      console.error("Error parsing numeric input:", e);
    }
  };

  // Define preset ranges for quick navigation
  const presetRanges = [
    { name: "ASCII", start: 0x0020, end: 0x007F },
    { name: "Numbers", start: 0x0030, end: 0x0039 }, // 0-9 in ASCII
    { name: "PUA 1", start: 0xE000, end: 0xE0FF },
    { name: "PUA 2", start: 0xE100, end: 0xE1FF },
    { name: "PUA 3", start: 0xE200, end: 0xE2FF },
    { name: "PUA 4", start: 0xE300, end: 0xE3FF },
    { name: "Extended", start: 0xF000, end: 0xF0FF },
  ];

  // Handle custom input for character exploration
  const handleCustomCharInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 0) {
      const lastChar = value.charAt(value.length - 1);
      setCustomChar(lastChar);
      setSelectedSymbol(lastChar.charCodeAt(0));
    } else {
      setCustomChar("");
      setSelectedSymbol(null);
    }
  };

  // Initialize with the Numbers preset for easier usage
  useEffect(() => {
    // Set to the Numbers range on first load
    const numbersPreset = presetRanges.find(preset => preset.name === "Numbers");
    if (numbersPreset) {
      setRange(numbersPreset);
    }
    
    // When selected symbol changes, ensure it's visible in the viewport
    if (selectedSymbol) {
      const element = document.getElementById(`symbol-${selectedSymbol}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedSymbol]);

  return (
    <Card className="bg-black/40 rounded-lg border border-warcrow-gold/30 mt-8 overflow-hidden shadow-lg">
      <CardHeader className="bg-black/60 pb-4">
        <CardTitle className="text-warcrow-gold flex flex-wrap items-center gap-2">
          <span className="text-xl">Symbol Explorer</span>
          <span className="text-xs text-warcrow-text/80 font-normal">
            (Font: GameSymbols - OpenType Layout, TrueType Outlines)
          </span>
          <button 
            onClick={() => setShowNumericInput(!showNumericInput)} 
            className="ml-auto text-sm px-3 py-1 bg-black/60 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10 rounded"
          >
            {showNumericInput ? "Hide Numeric Input" : "Show Numeric Input"}
          </button>
        </CardTitle>
        
        {showNumericInput && (
          <div className="mt-2">
            <NumericInput onSubmit={handleNumericInput} />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-5">
        <Tabs defaultValue="grid" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-black/50 border border-warcrow-gold/20 p-1">
            <TabsTrigger value="grid" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
              Grid View
            </TabsTrigger>
            <TabsTrigger value="details" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
              Symbol Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid" className="space-y-6">
            {/* Controls Section */}
            <SymbolControls 
              range={range}
              setRange={setRange}
              customChar={customChar}
              onCustomCharChange={handleCustomCharInput}
              fontSize={fontSize}
              setFontSize={setFontSize}
              presetRanges={presetRanges}
            />

            {/* Selected Symbol Display */}
            <SelectedSymbol 
              customChar={customChar} 
              fontSize={fontSize} 
            />

            <Separator className="bg-warcrow-gold/20 my-4" />

            {/* Symbol Grid */}
            <SymbolGrid 
              symbols={symbols}
              selectedSymbol={selectedSymbol}
              handleSymbolClick={handleSymbolClick}
              fontSize={fontSize}
            />
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <SymbolDetails 
              customChar={customChar}
              fontSize={fontSize}
              setFontSize={setFontSize}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
