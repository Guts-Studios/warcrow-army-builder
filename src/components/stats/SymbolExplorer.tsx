
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSymbol } from "./GameSymbol";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
            <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
              <h3 className="text-warcrow-gold/90 text-sm mb-4 font-medium">Range Controls</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 col-span-2">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <Label className="text-sm text-warcrow-text/90 mb-1.5 block">
                        Start Code (Hex)
                      </Label>
                      <Input 
                        type="text" 
                        value={`0x${range.start.toString(16).toUpperCase()}`} 
                        onChange={(e) => {
                          try {
                            const value = parseInt(e.target.value.replace(/^0x/, ""), 16);
                            if (!isNaN(value)) {
                              setRange({ ...range, start: value });
                            }
                          } catch (e) {
                            // Invalid hex input, ignore
                          }
                        }}
                        className="w-32 bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-warcrow-text/90 mb-1.5 block">
                        End Code (Hex)
                      </Label>
                      <Input 
                        type="text" 
                        value={`0x${range.end.toString(16).toUpperCase()}`} 
                        onChange={(e) => {
                          try {
                            const value = parseInt(e.target.value.replace(/^0x/, ""), 16);
                            if (!isNaN(value)) {
                              setRange({ ...range, end: value });
                            }
                          } catch (e) {
                            // Invalid hex input, ignore
                          }
                        }} 
                        className="w-32 bg-black/60 border-warcrow-gold/30 text-warcrow-gold" 
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-warcrow-text/90 mb-1.5 block">
                        Custom Character
                      </Label>
                      <Input 
                        value={customChar} 
                        onChange={handleCustomCharInput}
                        className="w-24 bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
                        placeholder="Enter char"
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-warcrow-text/90 mb-1.5 block">
                        Font Size
                      </Label>
                      <Input 
                        type="number" 
                        min="12"
                        max="72"
                        value={fontSize} 
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-24 bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-warcrow-text/90 mb-1.5 block">
                    Quick Ranges
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {presetRanges.map((preset, index) => (
                      <Button 
                        key={index}
                        size="sm"
                        onClick={() => setRange({ start: preset.start, end: preset.end })}
                        className={`
                          bg-black/60 border hover:bg-warcrow-gold/10
                          ${range.start === preset.start && range.end === preset.end 
                            ? "border-warcrow-gold text-warcrow-gold" 
                            : "border-warcrow-gold/30 text-warcrow-text/80"}
                        `}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Symbol Display */}
            {customChar && (
              <div className="p-4 bg-black/60 rounded-lg border border-warcrow-gold/40">
                <h3 className="text-warcrow-gold text-sm mb-3 font-medium">Selected Symbol</h3>
                <div className="flex items-center gap-6">
                  <div 
                    className="game-symbol bg-black/40 p-6 rounded-md border border-warcrow-gold/20 min-w-20 min-h-20 flex items-center justify-center"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {customChar}
                  </div>
                  <div className="text-warcrow-text space-y-1">
                    <div>
                      Character: <span className="text-warcrow-gold ml-1">{customChar}</span>
                    </div>
                    <div>
                      Code: <span className="text-warcrow-gold ml-1">{customChar.charCodeAt(0) || 'N/A'}</span>
                    </div>
                    <div>
                      Hex: <span className="text-warcrow-gold ml-1">{customChar.charCodeAt(0) ? '0x' + customChar.charCodeAt(0).toString(16).toUpperCase() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Separator className="bg-warcrow-gold/20 my-4" />

            {/* Symbol Grid */}
            <div>
              <h3 className="text-warcrow-gold/90 text-sm mb-3 font-medium">
                Symbol Grid <span className="text-warcrow-text/60 text-xs font-normal">({symbols.length} symbols in range)</span>
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {symbols.map((code) => (
                  <div
                    id={`symbol-${code}`}
                    key={code}
                    className={`
                      p-3 rounded-md border transition-all cursor-pointer
                      ${selectedSymbol === code 
                        ? "bg-warcrow-gold/20 border-warcrow-gold" 
                        : "bg-black/60 border-warcrow-gold/30 hover:bg-warcrow-gold/10"}
                    `}
                    onClick={() => handleSymbolClick(code)}
                  >
                    <div 
                      className="game-symbol mb-2 flex justify-center"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {String.fromCharCode(code)}
                    </div>
                    <div className="text-xs text-warcrow-text text-center">0x{code.toString(16).toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {customChar ? (
              <div className="bg-black/40 p-6 rounded-lg border border-warcrow-gold/30">
                <h3 className="text-warcrow-gold text-lg mb-4 font-medium">Symbol Details</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div 
                      className="game-symbol bg-black/60 p-8 rounded-md border border-warcrow-gold/20 flex items-center justify-center mb-4"
                      style={{ fontSize: `${fontSize * 2}px` }}
                    >
                      {customChar}
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm text-warcrow-text/90 block">
                        Font Size
                      </Label>
                      <div className="flex gap-2">
                        {[24, 36, 48, 60, 72].map((size) => (
                          <Button 
                            key={size}
                            size="sm"
                            variant="outline"
                            onClick={() => setFontSize(size)}
                            className={`
                              ${fontSize === size 
                                ? "bg-warcrow-gold/20 border-warcrow-gold text-warcrow-gold" 
                                : "bg-black/60 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10"}
                            `}
                          >
                            {size}px
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
                      <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Character Information</h4>
                      <div className="space-y-2 text-warcrow-text">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-warcrow-text/60">Character:</span>
                          <span className="text-warcrow-gold col-span-2">{customChar}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-warcrow-text/60">Unicode:</span>
                          <span className="text-warcrow-gold col-span-2">U+{customChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-warcrow-text/60">Decimal:</span>
                          <span className="text-warcrow-gold col-span-2">{customChar.charCodeAt(0)}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-warcrow-text/60">Hexadecimal:</span>
                          <span className="text-warcrow-gold col-span-2">0x{customChar.charCodeAt(0).toString(16).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
                      <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Usage Example</h4>
                      <div className="space-y-2">
                        <div className="text-warcrow-text">
                          <p className="mb-2">HTML Entity:</p>
                          <code className="bg-black/60 p-2 rounded text-warcrow-gold block overflow-x-auto">
                            &amp;#x{customChar.charCodeAt(0).toString(16).toUpperCase()};
                          </code>
                        </div>
                        <div className="text-warcrow-text mt-3">
                          <p className="mb-2">CSS Content:</p>
                          <code className="bg-black/60 p-2 rounded text-warcrow-gold block overflow-x-auto">
                            content: "\{customChar.charCodeAt(0).toString(16).toUpperCase()}";
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-black/40 p-8 rounded-lg border border-warcrow-gold/30 text-center">
                <p className="text-warcrow-gold/80">Select a symbol from the grid view to see details</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
