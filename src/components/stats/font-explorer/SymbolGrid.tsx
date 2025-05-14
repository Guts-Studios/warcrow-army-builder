
import React from 'react';
import { cn } from '@/lib/utils';

interface SymbolGridProps {
  range: [number, number];
  selectedSymbol: number | null;
  setSelectedSymbol: (code: number) => void;
}

export const SymbolGrid: React.FC<SymbolGridProps> = ({ 
  range, 
  selectedSymbol,
  setSelectedSymbol 
}) => {
  const [start, end] = range;
  const symbols = [];
  
  // Generate symbols within the specified range
  for (let i = start; i <= end; i++) {
    symbols.push(i);
  }
  
  return (
    <div className="border rounded border-warcrow-gold/30">
      <div className="p-4 bg-black/30">
        <h3 className="text-warcrow-gold text-sm font-medium">
          Symbol Grid ({symbols.length} symbols)
        </h3>
      </div>
      <div className="grid grid-cols-8 gap-2 p-4 max-h-[400px] overflow-y-auto">
        {symbols.map((code) => {
          const symbol = String.fromCodePoint(code);
          const hasContent = symbol.trim().length > 0;
          
          return (
            <div
              key={code}
              onClick={() => hasContent && setSelectedSymbol(code)}
              className={cn(
                "w-12 h-12 flex items-center justify-center rounded cursor-pointer border border-warcrow-gold/20 text-2xl transition-colors",
                hasContent ? "hover:bg-warcrow-gold/10" : "opacity-30 cursor-not-allowed",
                selectedSymbol === code ? "bg-warcrow-gold/20 border-warcrow-gold" : "bg-black/20"
              )}
              title={`U+${code.toString(16).toUpperCase()}`}
            >
              <span className="font-warcrow">{symbol}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
