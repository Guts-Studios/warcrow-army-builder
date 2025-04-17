
import React from "react";
import { SymbolDetails } from "./SymbolDetails";

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
  // Extract values from the selected symbol config
  const customChar = selectedSymbolConfig?.fontChar || "";
  const symbolColor = selectedSymbolConfig?.color || "#FFFFFF";
  
  return (
    <SymbolDetails 
      customChar={customChar} 
      fontSize={fontSize} 
      setFontSize={setFontSize} 
      symbolColor={symbolColor}
    />
  );
};

export default SymbolDetailView;
