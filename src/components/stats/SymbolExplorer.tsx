
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GameSymbol } from "./GameSymbol";

export const SymbolExplorer = () => {
  const [range, setRange] = useState({ start: 0, end: 255 });
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
              <label className="text-sm text-warcrow-text mb-1 block">Start Code</label>
              <Input 
                type="number" 
                value={range.start} 
                onChange={(e) => setRange({ ...range, start: parseInt(e.target.value) || 0 })}
                className="w-24 bg-black/60 border-warcrow-gold/30 text-warcrow-text"
              />
            </div>
            <div>
              <label className="text-sm text-warcrow-text mb-1 block">End Code</label>
              <Input 
                type="number" 
                value={range.end} 
                onChange={(e) => setRange({ ...range, end: parseInt(e.target.value) || 255 })}
                className="w-24 bg-black/60 border-warcrow-gold/30 text-warcrow-text" 
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
          </div>

          {customChar && (
            <div className="mt-4 p-4 bg-black/60 rounded-lg border border-warcrow-gold/30">
              <h3 className="text-warcrow-gold text-lg mb-2">Custom Character</h3>
              <div className="flex items-center gap-4">
                <div className="text-4xl game-symbol">{customChar}</div>
                <div className="text-warcrow-text">
                  Character: <span className="text-warcrow-gold">{customChar}</span><br />
                  Code: <span className="text-warcrow-gold">{customChar.charCodeAt(0) || 'N/A'}</span>
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
                <div className="text-xs text-warcrow-text">{code}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
