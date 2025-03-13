
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSymbol } from "./GameSymbol";

export const SymbolExplorer = () => {
  // Start with the private use area (E000-F8FF) where custom glyphs are often mapped
  const [range, setRange] = useState({ start: 0xE000, end: 0xE0FF });
  const [customChar, setCustomChar] = useState("");

  // Generate an array of character codes
  const generateSymbolGrid = () => {
    const symbols = [];
    for (let i = range.start; i <= range.end; i++) {
      symbols.push(i);
    }
    return symbols;
  };

  const symbols = generateSymbolGrid();

  return (
    <Card className="bg-black/40 rounded-lg border border-warcrow-gold/30 mt-8">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">Symbol Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="text-sm text-warcrow-text mb-1 block">Start Code (Hex)</label>
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
                className="w-32 bg-black/60 border-warcrow-gold/30 text-warcrow-text"
              />
            </div>
            <div>
              <label className="text-sm text-warcrow-text mb-1 block">End Code (Hex)</label>
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
                className="w-32 bg-black/60 border-warcrow-gold/30 text-warcrow-text" 
              />
            </div>
            <div>
              <label className="text-sm text-warcrow-text mb-1 block">Custom Character</label>
              <Input 
                value={customChar} 
                onChange={(e) => setCustomChar(e.target.value)}
                className="w-24 bg-black/60 border-warcrow-gold/30 text-warcrow-text"
                placeholder="Enter char"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setRange({ start: 0x0000, end: 0x00FF })}
                className="bg-black/60 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
              >
                ASCII
              </Button>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setRange({ start: 0xE000, end: 0xE0FF })}
                className="bg-black/60 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
              >
                PUA 1
              </Button>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => setRange({ start: 0xE100, end: 0xE1FF })}
                className="bg-black/60 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
              >
                PUA 2
              </Button>
            </div>
          </div>

          {customChar && (
            <div className="mt-4 p-4 bg-black/60 rounded-lg border border-warcrow-gold/30">
              <h3 className="text-warcrow-gold text-lg mb-2">Custom Character</h3>
              <div className="flex items-center gap-4">
                <div className="text-4xl game-symbol">{customChar}</div>
                <div className="text-warcrow-text">
                  Character: <span className="text-warcrow-gold">{customChar}</span><br />
                  Code: <span className="text-warcrow-gold">{customChar.charCodeAt(0) || 'N/A'}</span><br />
                  Hex: <span className="text-warcrow-gold">{customChar.charCodeAt(0) ? '0x' + customChar.charCodeAt(0).toString(16).toUpperCase() : 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-8 gap-2">
            {symbols.map((code) => (
              <div
                key={code}
                className="bg-black/60 p-2 rounded-md border border-warcrow-gold/30 flex flex-col items-center hover:bg-warcrow-gold/10 transition-colors cursor-pointer"
                onClick={() => setCustomChar(String.fromCharCode(code))}
              >
                <div className="text-xl game-symbol mb-1">{String.fromCharCode(code)}</div>
                <div className="text-xs text-warcrow-text">0x{code.toString(16).toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
