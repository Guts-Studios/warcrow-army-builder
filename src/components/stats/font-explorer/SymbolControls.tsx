
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SymbolControlsProps {
  symbolRange: [number, number];
  onRangeChange: (range: [number, number]) => void;
  customChar: string;
  onCustomCharChange: (value: string) => void;
}

export const SymbolControls: React.FC<SymbolControlsProps> = ({
  symbolRange,
  onRangeChange,
  customChar,
  onCustomCharChange,
}) => {
  const [startCodeInput, setStartCodeInput] = useState<string>(symbolRange[0].toString(16).toUpperCase());
  const [endCodeInput, setEndCodeInput] = useState<string>(symbolRange[1].toString(16).toUpperCase());

  const handleRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const startCode = parseInt(startCodeInput, 16);
      const endCode = parseInt(endCodeInput, 16);
      
      if (!isNaN(startCode) && !isNaN(endCode) && startCode <= endCode) {
        onRangeChange([startCode, endCode]);
      }
    } catch (error) {
      console.error("Invalid hex input:", error);
    }
  };

  // Predefined symbol ranges
  const presetRanges = [
    { name: "Dice & Symbols", range: [0xE000, 0xE0FF] },
    { name: "Game Icons", range: [0xE100, 0xE1FF] },
    { name: "Extended Symbols", range: [0xE200, 0xE2FF] }
  ];

  return (
    <div className="space-y-4">
      <div className="p-3 bg-black/50 rounded-lg border border-warcrow-gold/40">
        <h3 className="text-warcrow-gold text-sm mb-3">Symbol Controls</h3>
        
        <div className="space-y-3 mb-3">
          <div>
            <Label htmlFor="customChar" className="text-sm text-warcrow-text/90 mb-1 block">
              Enter Symbol or Character:
            </Label>
            <Input
              id="customChar"
              type="text"
              maxLength={1}
              value={customChar}
              onChange={(e) => onCustomCharChange(e.target.value)}
              className="bg-black/40 border-warcrow-gold/30 text-warcrow-text"
            />
          </div>
        </div>
        
        <form onSubmit={handleRangeSubmit} className="space-y-3">
          <h4 className="text-sm text-warcrow-gold/90">Custom Range</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="startCode" className="text-xs text-warcrow-text/90 mb-1 block">
                Start (Hex):
              </Label>
              <Input
                id="startCode"
                type="text"
                value={startCodeInput}
                onChange={(e) => setStartCodeInput(e.target.value)}
                className="bg-black/40 border-warcrow-gold/30 text-warcrow-text"
              />
            </div>
            <div>
              <Label htmlFor="endCode" className="text-xs text-warcrow-text/90 mb-1 block">
                End (Hex):
              </Label>
              <Input
                id="endCode"
                type="text"
                value={endCodeInput}
                onChange={(e) => setEndCodeInput(e.target.value)}
                className="bg-black/40 border-warcrow-gold/30 text-warcrow-text"
              />
            </div>
          </div>
          <Button 
            type="submit"
            className="w-full bg-black border-warcrow-gold/30 hover:bg-warcrow-gold/20 text-warcrow-gold"
          >
            Update Range
          </Button>
        </form>
      </div>
      
      <div className="p-3 bg-black/50 rounded-lg border border-warcrow-gold/40">
        <h4 className="text-sm text-warcrow-gold/90 mb-2">Preset Ranges</h4>
        <div className="flex flex-wrap gap-2">
          {presetRanges.map((preset) => (
            <Button 
              key={preset.name}
              onClick={() => onRangeChange(preset.range)}
              className="bg-black border-warcrow-gold/30 hover:bg-warcrow-gold/20 text-warcrow-gold text-xs"
              size="sm"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-warcrow-text/70">
        Current range: 0x{symbolRange[0].toString(16).toUpperCase()} - 0x{symbolRange[1].toString(16).toUpperCase()} 
        ({symbolRange[1] - symbolRange[0] + 1} symbols)
      </div>
    </div>
  );
};
