
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NumericInputProps {
  onSubmit: (value: string) => void;
}

export const NumericInput: React.FC<NumericInputProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [displayMode, setDisplayMode] = useState<'decimal' | 'hex'>('decimal');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue) {
      try {
        // Parse input based on display mode
        let value = inputValue;
        if (displayMode === 'hex' && !inputValue.startsWith('0x')) {
          value = '0x' + inputValue;
        }
        
        // Try to parse the number
        const numValue = displayMode === 'decimal' 
          ? parseInt(value, 10) 
          : parseInt(value, 16);
          
        if (isNaN(numValue)) {
          toast.error("Invalid number format");
          return;
        }
        
        onSubmit(numValue.toString());
        toast.success(`Showing symbol code: ${numValue}`);
      } catch (e) {
        toast.error("Error processing input");
        console.error("Error parsing numeric input:", e);
      }
    }
  };

  const handleQuickNumber = (num: number) => {
    setInputValue(num.toString());
    onSubmit(num.toString());
    toast.success(`Selected symbol code: ${num}`);
  };

  useEffect(() => {
    // When display mode changes, clear the input field
    setInputValue("");
  }, [displayMode]);

  return (
    <div className="bg-black/40 p-4 rounded-lg border border-warcrow-gold/20">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div className="flex items-center gap-4">
          <div className="space-y-1 flex-1">
            <Label className="text-sm text-warcrow-text/90">Enter Number:</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={displayMode === 'decimal' ? "Enter decimal value" : "Enter hex value (0x...)"}
                className="bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
              />
              <Button 
                type="submit"
                className="bg-black/60 border border-warcrow-gold/30 hover:bg-warcrow-gold/10 text-warcrow-gold"
              >
                Display
              </Button>
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-sm text-warcrow-text/90">Mode:</Label>
            <div className="flex gap-2">
              <Button 
                type="button"
                size="sm"
                className={`
                  ${displayMode === 'decimal' 
                    ? 'bg-warcrow-gold/20 text-warcrow-gold border-warcrow-gold' 
                    : 'bg-black/60 border-warcrow-gold/30 text-warcrow-text/80 hover:bg-warcrow-gold/10'}
                  border
                `}
                onClick={() => setDisplayMode('decimal')}
              >
                Decimal
              </Button>
              <Button 
                type="button"
                size="sm"
                className={`
                  ${displayMode === 'hex' 
                    ? 'bg-warcrow-gold/20 text-warcrow-gold border-warcrow-gold' 
                    : 'bg-black/60 border-warcrow-gold/30 text-warcrow-text/80 hover:bg-warcrow-gold/10'}
                  border
                `}
                onClick={() => setDisplayMode('hex')}
              >
                Hex
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-1">
          <Label className="text-sm text-warcrow-text/90">Quick Numbers:</Label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(num => (
              <Button 
                key={num}
                type="button"
                size="sm"
                onClick={() => handleQuickNumber(num)}
                className="bg-black/60 border border-warcrow-gold/30 hover:bg-warcrow-gold/10 text-warcrow-gold"
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="text-xs text-warcrow-text/70 mt-2">
          <p>Enter a number (1-9) to display the corresponding symbol from the GameSymbols font.</p>
          <p>You can use either decimal (48-57 for digits 0-9) or hexadecimal values (0x31-0x39).</p>
        </div>
      </form>
    </div>
  );
};
