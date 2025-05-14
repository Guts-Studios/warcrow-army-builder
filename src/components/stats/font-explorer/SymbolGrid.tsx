
import React from "react";

interface SymbolGridProps {
  symbols: number[];
  selectedSymbol: number | null;
  handleSymbolClick: (code: number) => void;
  fontSize: number;
}

export const SymbolGrid: React.FC<SymbolGridProps> = ({
  symbols,
  selectedSymbol,
  handleSymbolClick,
  fontSize
}) => {
  return (
    <div className="p-4 bg-black/50 rounded-lg border border-warcrow-gold/40">
      <h3 className="text-warcrow-gold text-sm mb-4">Symbol Grid</h3>
      
      <div className="grid grid-cols-8 gap-2 sm:grid-cols-12">
        {symbols.map((code) => {
          const isSelected = selectedSymbol === code;
          return (
            <button
              key={code}
              className={`aspect-square p-2 rounded flex items-center justify-center transition-all ${
                isSelected
                  ? "bg-warcrow-gold/30 border-2 border-warcrow-gold"
                  : "bg-black/40 border border-warcrow-gold/30 hover:bg-warcrow-gold/10"
              }`}
              onClick={() => handleSymbolClick(code)}
            >
              <span
                className="Warcrow-Family"
                style={{ 
                  fontSize: `${fontSize}px`,
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {String.fromCharCode(code)}
              </span>
            </button>
          );
        })}
      </div>
      
      {symbols.length === 0 && (
        <div className="text-center text-warcrow-text/50 py-4">
          No symbols in the selected range.
        </div>
      )}
    </div>
  );
};
