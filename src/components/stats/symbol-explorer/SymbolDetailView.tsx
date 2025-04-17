
import React from "react";
import { Button } from "@/components/ui/button";

interface SymbolConfig {
  symbol: string;
  fontChar: string;
  color: string;
}

interface SymbolDetailViewProps {
  selectedSymbolConfig: SymbolConfig | null;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const SymbolDetailView: React.FC<SymbolDetailViewProps> = ({
  selectedSymbolConfig,
  fontSize,
  setFontSize
}) => {
  if (!selectedSymbolConfig) {
    return (
      <div className="bg-black/40 p-8 rounded-lg border border-warcrow-gold/30 text-center">
        <p className="text-warcrow-text/80">Select a symbol to see details</p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 p-6 rounded-lg border border-warcrow-gold/30">
      <h3 className="text-warcrow-gold text-lg mb-4 font-medium">Symbol Details</h3>
      
      <div className="space-y-4">
        <div 
          className="bg-[#F1F0FB] p-8 rounded-md border border-gray-300 flex items-center justify-center mb-4"
          style={{ fontSize: `${fontSize * 1.5}px` }}
        >
          <span 
            className="Warcrow-Family font-warcrow"
            style={{ color: selectedSymbolConfig.color }}
          >
            {selectedSymbolConfig.fontChar}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm text-warcrow-text/90 block mb-2">
            Font Size
          </div>
          <div className="flex gap-2 flex-wrap">
            {[24, 36, 48, 60, 72].map((size) => (
              <Button 
                key={size}
                size="sm"
                variant="outline"
                onClick={() => setFontSize(size)}
                className={`
                  ${fontSize === size 
                    ? "bg-warcrow-gold/20 border-warcrow-gold text-warcrow-gold" 
                    : "bg-black/40 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10"}
                `}
              >
                {size}px
              </Button>
            ))}
          </div>
        </div>
        
        <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
          <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Symbol Configuration</h4>
          <div className="space-y-2 text-warcrow-text">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-warcrow-text/60">Symbol:</span>
              <span className="text-warcrow-gold col-span-2">{selectedSymbolConfig.symbol}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-warcrow-text/60">Font Character:</span>
              <span className="text-warcrow-gold col-span-2">{selectedSymbolConfig.fontChar}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-warcrow-text/60">Color:</span>
              <span className="text-warcrow-gold col-span-2" style={{display: 'flex', alignItems: 'center'}}>
                {selectedSymbolConfig.color}
                <span className="inline-block w-4 h-4 ml-2 rounded-full" style={{backgroundColor: selectedSymbolConfig.color}}></span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
          <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Usage Code</h4>
          <div className="space-y-2">
            <pre className="bg-black/60 p-3 rounded text-warcrow-gold block overflow-x-auto text-xs whitespace-pre-wrap">
              {`{ symbol: '${selectedSymbolConfig.symbol}', fontChar: '${selectedSymbolConfig.fontChar}', color: '${selectedSymbolConfig.color}' },`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolDetailView;
