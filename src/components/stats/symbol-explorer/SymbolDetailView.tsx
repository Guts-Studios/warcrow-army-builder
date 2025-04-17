
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
  const customChar = selectedSymbolConfig?.fontChar || "";

  return (
    <SymbolDetails 
      customChar={customChar} 
      fontSize={fontSize} 
      setFontSize={setFontSize} 
    />
  );
};

export default SymbolDetailView;
