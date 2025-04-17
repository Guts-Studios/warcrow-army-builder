
import React from "react";

interface SymbolInfoPanelProps {
  customChar: string;
  isNumeric: boolean;
  isSpecialSymbol: boolean;
  fontLoaded: boolean | null;
}

const SymbolInfoPanel: React.FC<SymbolInfoPanelProps> = ({
  customChar,
  isNumeric,
  isSpecialSymbol,
  fontLoaded
}) => {
  if (!customChar) return null;
  
  const charCode = customChar.charCodeAt(0);
  
  return (
    <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
      <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Character Information</h4>
      <div>
        Character: <span className="text-warcrow-gold ml-1">{customChar}</span>
      </div>
      <div>
        Code: <span className="text-warcrow-gold ml-1">{charCode || 'N/A'}</span>
      </div>
      <div>
        Hex: <span className="text-warcrow-gold ml-1">{charCode ? '0x' + charCode.toString(16).toUpperCase() : 'N/A'}</span>
      </div>
      {isNumeric && (
        <div>
          Type: <span className="text-green-500 ml-1">Numeric Character ({customChar})</span>
        </div>
      )}
      {isSpecialSymbol && (
        <div>
          Special: <span className="text-green-500 ml-1">Hollow Shield Symbol</span>
        </div>
      )}
      <div>
        Font: <span className={`ml-1 ${fontLoaded === true ? 'text-green-500' : fontLoaded === false ? 'text-red-500' : 'text-yellow-500'}`}>
          {fontLoaded === true ? 'Loaded' : fontLoaded === false ? 'Failed to load' : 'Checking...'}
        </span>
      </div>
    </div>
  );
};

export default SymbolInfoPanel;
