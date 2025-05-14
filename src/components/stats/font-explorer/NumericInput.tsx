
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  label = "Enter Character Code (Decimal)",
  placeholder = "e.g. 0-9"
}) => {
  const diceSymbols = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="numericInput" className="text-sm text-warcrow-text/90 mb-1 block">
          {label}
        </Label>
        <Input
          id="numericInput"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-black/40 border-warcrow-gold/30 text-warcrow-text"
          maxLength={1}
        />
      </div>
      
      <div>
        <Label className="text-xs text-warcrow-text/90 mb-1 block">
          Common Dice Symbols:
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {diceSymbols.map((symbol) => (
            <Button
              key={symbol}
              onClick={() => onChange(symbol)}
              className={`min-w-9 bg-black border ${
                value === symbol ? "border-warcrow-gold" : "border-warcrow-gold/30"
              } ${
                value === symbol ? "bg-warcrow-gold/30" : "hover:bg-warcrow-gold/20"
              } text-warcrow-gold`}
              size="sm"
            >
              <span className="Warcrow-Family">{symbol}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
