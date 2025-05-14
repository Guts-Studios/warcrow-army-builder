
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useLanguage } from '@/contexts/LanguageContext';
import { SymbolGrid } from './SymbolGrid';
import { SymbolControls } from './SymbolControls';
import { SelectedSymbol } from './SelectedSymbol';

const FontSymbolExplorer = () => {
  const [symbolRange, setSymbolRange] = useState<[number, number]>([0xE000, 0xE0FF]);
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [customChar, setCustomChar] = useState<string>("");
  const [fontSize, setFontSize] = useState<number>(32);
  const { t } = useLanguage();

  // Generate an array of all symbol codes in the range
  const symbols = React.useMemo(() => {
    const result = [];
    for (let i = symbolRange[0]; i <= symbolRange[1]; i++) {
      result.push(i);
    }
    return result;
  }, [symbolRange]);

  // Handle symbol selection
  const handleSymbolClick = (code: number) => {
    setSelectedSymbol(code);
    setCustomChar(String.fromCharCode(code));
  };

  // Handle input changes from the numeric input or preset buttons
  const handleCustomInput = (value: string) => {
    if (value) {
      setCustomChar(value);
      if (value.length === 1) {
        setSelectedSymbol(value.charCodeAt(0));
      } else {
        setSelectedSymbol(null);
      }
    } else {
      setCustomChar("");
      setSelectedSymbol(null);
    }
  };

  // Handle range changes
  const handleRangeChange = (newRange: [number, number]) => {
    setSymbolRange(newRange);
    setSelectedSymbol(null);
  };

  // Handle font size changes
  const handleFontSizeChange = (newSize: number[]) => {
    setFontSize(newSize[0]);
  };

  return (
    <Card className="bg-warcrow-background border-warcrow-gold/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-warcrow-gold text-xl">Font Symbol Explorer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <SymbolControls 
                symbolRange={symbolRange}
                onRangeChange={handleRangeChange}
                customChar={customChar}
                onCustomCharChange={handleCustomInput}
              />
              
              <div className="mt-4 space-y-2">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-warcrow-gold/90">Font Size: {fontSize}px</label>
                  <Slider
                    defaultValue={[fontSize]}
                    min={12}
                    max={72}
                    step={1}
                    onValueChange={handleFontSizeChange}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <SelectedSymbol 
                customChar={customChar} 
                fontSize={fontSize}
              />
            </div>
          </div>
          
          <SymbolGrid 
            symbols={symbols}
            selectedSymbol={selectedSymbol}
            handleSymbolClick={handleSymbolClick}
            fontSize={fontSize}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSymbolExplorer;
