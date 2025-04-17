
import React from "react";
import FontSizeSelector from "./components/FontSizeSelector";
import CharacterInfoPanel from "./components/CharacterInfoPanel";
import UsageExamplePanel from "./components/UsageExamplePanel";

interface SymbolDetailsProps {
  customChar: string;
  fontSize: number;
  setFontSize: (size: number) => void;
  symbolColor: string;
}

export const SymbolDetails: React.FC<SymbolDetailsProps> = ({ 
  customChar, 
  fontSize, 
  setFontSize,
  symbolColor
}) => {
  if (!customChar) {
    return (
      <div className="bg-black/40 p-8 rounded-lg border border-warcrow-gold/30 text-center">
        <p className="text-warcrow-gold/80">Select a symbol from the grid view to see details</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 p-6 rounded-lg border border-warcrow-gold/30">
      <h3 className="text-warcrow-gold text-lg mb-4 font-medium">Symbol Details</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div 
            className="game-symbol bg-black/60 p-8 rounded-md border border-warcrow-gold/20 flex items-center justify-center mb-4"
            style={{ 
              fontSize: `${fontSize * 2}px`,
              color: symbolColor 
            }}
          >
            {customChar}
          </div>
          
          <FontSizeSelector fontSize={fontSize} setFontSize={setFontSize} />
        </div>
        
        <div className="space-y-4">
          <CharacterInfoPanel customChar={customChar} />
          <UsageExamplePanel customChar={customChar} />
        </div>
      </div>
    </div>
  );
};
