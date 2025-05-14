
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { NumericInput } from "./NumericInput";

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
  const [startValue, setStartValue] = useState(symbolRange[0].toString(16));
  const [endValue, setEndValue] = useState(symbolRange[1].toString(16));
  const inputRef = useRef<HTMLInputElement>(null);

  // Update the component state when the range props change
  useEffect(() => {
    setStartValue(symbolRange[0].toString(16));
    setEndValue(symbolRange[1].toString(16));
  }, [symbolRange]);

  // Apply the range values when the user changes them
  const applyRange = () => {
    const start = parseInt(startValue, 16) || 0xE000;
    const end = parseInt(endValue, 16) || 0xE0FF;
    
    // Ensure end is greater than or equal to start
    if (end >= start) {
      onRangeChange([start, end]);
    }
  };

  // Set predefined ranges
  const setPredefinedRange = (start: number, end: number) => {
    setStartValue(start.toString(16));
    setEndValue(end.toString(16));
    onRangeChange([start, end]);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Symbol Range</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-warcrow-text/80 mb-1 block">Start (hex)</label>
              <NumericInput
                value={startValue}
                onChange={setStartValue}
                placeholder="E000"
                hexadecimal
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-warcrow-text/80 mb-1 block">End (hex)</label>
              <NumericInput
                value={endValue}
                onChange={setEndValue}
                placeholder="E0FF"
                hexadecimal
                className="w-full"
              />
            </div>
          </div>
          <Button onClick={applyRange} className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50 mt-4 sm:mt-6">
            Apply
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Input Character</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={customChar}
              onChange={(e) => onCustomCharChange(e.target.value)}
              className="w-full p-2 bg-black/60 border border-warcrow-gold/40 rounded text-warcrow-text focus:border-warcrow-gold/80 focus:outline-none"
              placeholder="Type or paste a character"
              maxLength={1}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Preset Ranges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <Button 
            onClick={() => setPredefinedRange(0xE000, 0xE0FF)}
            className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50 text-xs"
          >
            Game Symbols (E000-E0FF)
          </Button>
          <Button 
            onClick={() => setPredefinedRange(0x2600, 0x26FF)}
            className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50 text-xs"
          >
            Misc Symbols
          </Button>
          <Button 
            onClick={() => setPredefinedRange(0x2700, 0x27BF)}
            className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50 text-xs"
          >
            Dingbats
          </Button>
        </div>
      </div>
    </div>
  );
};
