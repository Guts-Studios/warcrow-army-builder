
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NumericInputProps {
  label?: string;
  value?: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}

export const NumericInput: React.FC<NumericInputProps> = ({ 
  label,
  value: initialValue = "",
  onChange,
  onSubmit
}) => {
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [displayMode, setDisplayMode] = useState<'decimal' | 'hex'>('decimal');
  
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue && onSubmit) {
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
    onChange(num.toString());
    if (onSubmit) {
      onSubmit(num.toString());
      toast.success(`Selected symbol code: ${num}`);
    }
  };

  return (
    <div className="space-y-1">
      {label && (
        <Label className="text-sm text-warcrow-text/90">{label}</Label>
      )}
      <div className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
        />
        {onSubmit && (
          <Button 
            type="submit"
            onClick={handleSubmit}
            className="bg-black/60 border border-warcrow-gold/30 hover:bg-warcrow-gold/10 text-warcrow-gold"
          >
            Display
          </Button>
        )}
      </div>
    </div>
  );
};
