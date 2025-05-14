
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { NumericInput } from './NumericInput';

interface SymbolControlsProps {
  selectedRange: [number, number];
  setSelectedRange: (range: [number, number]) => void;
  selectedSymbol: number | null;
  setSelectedSymbol: (code: number | null) => void;
}

export const SymbolControls: React.FC<SymbolControlsProps> = ({
  selectedRange,
  setSelectedRange,
  selectedSymbol,
  setSelectedSymbol
}) => {
  const [startInput, setStartInput] = useState<string>(selectedRange[0].toString(16));
  const [endInput, setEndInput] = useState<string>(selectedRange[1].toString(16));

  const handleRangeApply = () => {
    try {
      const start = parseInt(startInput, 16);
      const end = parseInt(endInput, 16);
      
      if (isNaN(start) || isNaN(end)) {
        throw new Error("Invalid hex values");
      }
      
      if (end < start) {
        throw new Error("End must be greater than or equal to start");
      }
      
      if (end - start > 1000) {
        throw new Error("Range too large (maximum 1000 symbols)");
      }
      
      setSelectedRange([start, end]);
      // Clear selected symbol when changing range
      setSelectedSymbol(null);
    } catch (error) {
      console.error("Range error:", error);
      // Could add toast notification here
    }
  };

  // Predefined symbol ranges
  const presetRanges = [
    { name: "Dice & Symbols", range: [0xE000, 0xE0FF] as [number, number] },
    { name: "Game Icons", range: [0xE100, 0xE1FF] as [number, number] },
    { name: "Extended Symbols", range: [0xE200, 0xE2FF] as [number, number] }
  ];

  return (
    <div className="space-y-4 rounded border border-warcrow-gold/30 bg-black/20 p-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="symbol-start" className="text-warcrow-text">Start (hex)</Label>
          <div className="flex items-center">
            <span className="mr-1 text-warcrow-gold">U+</span>
            <Input
              id="symbol-start"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              className="w-24 bg-warcrow-accent/50 border-warcrow-gold/30 font-mono"
              placeholder="E000"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <Label htmlFor="symbol-end" className="text-warcrow-text">End (hex)</Label>
          <div className="flex items-center">
            <span className="mr-1 text-warcrow-gold">U+</span>
            <Input
              id="symbol-end"
              value={endInput}
              onChange={(e) => setEndInput(e.target.value)}
              className="w-24 bg-warcrow-accent/50 border-warcrow-gold/30 font-mono"
              placeholder="E0FF"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-2 justify-end">
          <Button 
            onClick={handleRangeApply}
            className="bg-warcrow-accent/50 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/70"
          >
            Apply Range
          </Button>
        </div>
        
        <div className="flex flex-col gap-2 justify-end ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                className="bg-warcrow-accent/50 border border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/70"
              >
                Presets <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-warcrow-accent border-warcrow-gold/30">
              {presetRanges.map((preset) => (
                <DropdownMenuItem 
                  key={preset.name}
                  onClick={() => {
                    setStartInput(preset.range[0].toString(16).toUpperCase());
                    setEndInput(preset.range[1].toString(16).toUpperCase());
                    setSelectedRange(preset.range);
                    setSelectedSymbol(null);
                  }}
                  className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
                >
                  {preset.name} (U+{preset.range[0].toString(16).toUpperCase()}-U+{preset.range[1].toString(16).toUpperCase()})
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {selectedSymbol && (
        <div className="pt-2">
          <Button 
            variant="outline" 
            onClick={() => setSelectedSymbol(null)}
            className="text-xs border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/70"
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
};
