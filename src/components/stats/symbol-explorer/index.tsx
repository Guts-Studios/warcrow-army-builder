
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SymbolControls } from "./SymbolControls";
import { SelectedSymbol } from "./SelectedSymbol";
import { SymbolGrid } from "./SymbolGrid";
import { SymbolDetails } from "./SymbolDetails";

export const SymbolExplorer = () => {
  // Start with the private use area (E000-F8FF) where custom glyphs are often mapped
  const [range, setRange] = useState({ start: 0xE000, end: 0xE0FF });
  const [customChar, setCustomChar] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [fontSize, setFontSize] = useState<number>(36);
  const [activeTab, setActiveTab] = useState<string>("grid");

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

  // Define preset ranges for quick navigation
  const presetRanges = [
    { name: "ASCII", start: 0x0020, end: 0x007F },
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

  useEffect(() => {
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
        <CardTitle className="text-warcrow-gold flex items-center gap-2">
          <span className="text-xl">Symbol Explorer</span>
          <span className="text-xs text-warcrow-text/80 font-normal">
            (Font: GameSymbols - OpenType Layout, TrueType Outlines)
          </span>
        </CardTitle>
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
