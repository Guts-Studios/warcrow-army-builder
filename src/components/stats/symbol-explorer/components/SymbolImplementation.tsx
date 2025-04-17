
import React from "react";

interface SymbolImplementationProps {
  customChar: string;
  fontSize: number;
  isNumeric: boolean;
  isSpecialSymbol: boolean;
}

const SymbolImplementation: React.FC<SymbolImplementationProps> = ({ 
  customChar, 
  fontSize,
  isNumeric,
  isSpecialSymbol
}) => {
  if (!customChar) return null;
  
  return (
    <div className="space-y-4">
      <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
        <h4 className="text-warcrow-gold/90 text-xs mb-2">Original implementation:</h4>
        <div 
          className="game-symbol bg-black/40 p-4 rounded-md border border-warcrow-gold/20 min-w-16 min-h-16 flex items-center justify-center"
          style={{ fontSize: `${fontSize}px` }}
        >
          {customChar}
        </div>
        <div className="mt-2 text-xs text-warcrow-text/80 text-center">Using class="game-symbol"</div>
      </div>
      
      <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
        <h4 className="text-warcrow-gold/90 text-xs mb-2">Warcrow implementation:</h4>
        <div 
          className="Warcrow-Family bg-black/40 p-4 rounded-md border border-warcrow-gold/20 min-w-16 min-h-16 flex items-center justify-center"
          style={{ fontSize: `${fontSize}px` }}
        >
          {customChar}
        </div>
        <div className="mt-2 text-xs text-warcrow-text/80 text-center">Using class="Warcrow-Family"</div>
      </div>
      
      {isNumeric && (
        <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
          <h4 className="text-warcrow-gold/90 text-xs mb-2">With specific numeric class:</h4>
          <div 
            className={`Warcrow-Family WC_${customChar} bg-black/40 p-4 rounded-md border border-warcrow-gold/20 min-w-16 min-h-16 flex items-center justify-center`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {customChar}
          </div>
          <div className="mt-2 text-xs text-warcrow-text/80 text-center">Using class="Warcrow-Family WC_{customChar}"</div>
        </div>
      )}
    </div>
  );
};

export default SymbolImplementation;
