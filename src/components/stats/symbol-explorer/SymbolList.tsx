
import React from "react";

interface SymbolConfig {
  symbol: string;
  fontChar: string;
  color: string;
}

interface SymbolListProps {
  symbols: SymbolConfig[];
  selectedSymbolConfig: SymbolConfig | null;
  setSelectedSymbolConfig: (config: SymbolConfig) => void;
  fontSize: number;
}

const SymbolList: React.FC<SymbolListProps> = ({
  symbols,
  selectedSymbolConfig,
  setSelectedSymbolConfig,
  fontSize
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
      {symbols.map((config, index) => (
        <div
          key={index}
          className={`
            p-3 rounded-md border transition-all cursor-pointer flex flex-col items-center
            bg-[#F1F0FB] border-gray-300
            ${selectedSymbolConfig === config 
              ? "ring-2 ring-warcrow-gold" 
              : "hover:bg-gray-200"}
          `}
          onClick={() => setSelectedSymbolConfig(config)}
        >
          <div className="mb-2 flex items-center justify-center">
            <span 
              className="Warcrow-Family font-warcrow"
              style={{ 
                fontSize: `${fontSize}px`,
                color: config.color
              }}
            >
              {config.fontChar}
            </span>
          </div>
          <div className="text-xs text-black text-center">{config.symbol}</div>
        </div>
      ))}
    </div>
  );
};

export default SymbolList;
