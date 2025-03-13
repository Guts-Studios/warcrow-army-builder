
import React from "react";

interface SelectedSymbolProps {
  customChar: string;
  fontSize: number;
}

export const SelectedSymbol: React.FC<SelectedSymbolProps> = ({ customChar, fontSize }) => {
  if (!customChar) return null;

  return (
    <div className="p-4 bg-black/60 rounded-lg border border-warcrow-gold/40">
      <h3 className="text-warcrow-gold text-sm mb-3 font-medium">Selected Symbol</h3>
      <div className="flex items-center gap-6">
        <div 
          className="game-symbol bg-black/40 p-6 rounded-md border border-warcrow-gold/20 min-w-20 min-h-20 flex items-center justify-center"
          style={{ fontSize: `${fontSize}px` }}
        >
          {customChar}
        </div>
        <div className="text-warcrow-text space-y-1">
          <div>
            Character: <span className="text-warcrow-gold ml-1">{customChar}</span>
          </div>
          <div>
            Code: <span className="text-warcrow-gold ml-1">{customChar.charCodeAt(0) || 'N/A'}</span>
          </div>
          <div>
            Hex: <span className="text-warcrow-gold ml-1">{customChar.charCodeAt(0) ? '0x' + customChar.charCodeAt(0).toString(16).toUpperCase() : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
