
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSymbol } from "./GameSymbol";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const SymbolExplorer = () => {
  // Start with the private use area (E000-F8FF) where custom glyphs are often mapped
  const [range, setRange] = useState({ start: 0xE000, end: 0xE0FF });
  const [customChar, setCustomChar] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);

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

  return (
    <Card className="bg-black/40 rounded-lg border border-warcrow-gold/30 mt-8 overflow-hidden">
      <CardHeader className="bg-black/60 pb-4">
        <CardTitle className="text-warcrow-gold flex items-center gap-2">
          <span className="text-xl">Symbol Explorer</span>
          <span className="text-xs text-warcrow-text/80 font-normal">
            (Font: GameSymbols)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-6">
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
                          const value = parseInt(e.target.value, 16);
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
                          const value = parseInt(e.target.value, 16);
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
                      onChange={(e) => setCustomChar(e.target.value)}
                      className="w-24 bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
                      placeholder="Enter char"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-warcrow-text/90 mb-1.5 block">
                  Quick Ranges
                </Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm"
                    onClick={() => setRange({ start: 0x0000, end: 0x00FF })}
                    className="bg-black/60 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
                  >
                    ASCII
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setRange({ start: 0xE000, end: 0xE0FF })}
                    className="bg-black/60 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
                  >
                    PUA 1
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setRange({ start: 0xE100, end: 0xE1FF })}
                    className="bg-black/60 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
                  >
                    PUA 2
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Symbol Display */}
          {customChar && (
            <div className="p-4 bg-black/60 rounded-lg border border-warcrow-gold/40">
              <h3 className="text-warcrow-gold text-sm mb-3 font-medium">Selected Symbol</h3>
              <div className="flex items-center gap-6">
                <div className="text-5xl game-symbol bg-black/40 p-4 rounded-md border border-warcrow-gold/20 min-w-16 flex items-center justify-center">
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
                  key={code}
                  className={`
                    p-3 rounded-md border transition-all cursor-pointer
                    ${selectedSymbol === code 
                      ? "bg-warcrow-gold/20 border-warcrow-gold" 
                      : "bg-black/60 border-warcrow-gold/30 hover:bg-warcrow-gold/10"}
                  `}
                  onClick={() => handleSymbolClick(code)}
                >
                  <div className="text-2xl game-symbol mb-2 flex justify-center">{String.fromCharCode(code)}</div>
                  <div className="text-xs text-warcrow-text text-center">0x{code.toString(16).toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
