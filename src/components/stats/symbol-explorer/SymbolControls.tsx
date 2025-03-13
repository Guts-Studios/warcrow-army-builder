
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RangeType {
  start: number;
  end: number;
}

interface PresetRange {
  name: string;
  start: number;
  end: number;
}

interface SymbolControlsProps {
  range: RangeType;
  setRange: (range: RangeType) => void;
  customChar: string;
  onCustomCharChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  presetRanges: PresetRange[];
}

export const SymbolControls: React.FC<SymbolControlsProps> = ({
  range,
  setRange,
  customChar,
  onCustomCharChange,
  fontSize,
  setFontSize,
  presetRanges,
}) => {
  return (
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
                onChange={onCustomCharChange}
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
  );
};
