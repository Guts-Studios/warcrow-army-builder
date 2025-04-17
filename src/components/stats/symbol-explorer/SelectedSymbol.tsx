
import React, { useEffect, useState } from "react";
import SymbolImplementation from "./components/SymbolImplementation";
import SymbolInfoPanel from "./components/SymbolInfoPanel";
import SymbolUsageExamples from "./components/SymbolUsageExamples";
import FontStyleSheet from "./components/FontStyleSheet";

interface SelectedSymbolProps {
  customChar: string;
  fontSize: number;
}

export const SelectedSymbol: React.FC<SelectedSymbolProps> = ({ customChar, fontSize }) => {
  const [fontLoaded, setFontLoaded] = useState<boolean | null>(null);
  const [isNumeric, setIsNumeric] = useState<boolean>(false);
  const [isSpecialSymbol, setIsSpecialSymbol] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the current character is a numeric character
    const code = customChar.charCodeAt(0);
    setIsNumeric(code >= 48 && code <= 57); // ASCII 48-57 are digits 0-9
    
    // Check if this is specifically the number 4 (special hollow shield symbol)
    setIsSpecialSymbol(customChar === "4");
    
    // Simple font loading check
    const checkFontLoading = async () => {
      // Set initial state to checking
      setFontLoaded(null);
      
      try {
        // Use document.fonts API if available (modern browsers)
        if ('fonts' in document) {
          const font = new FontFace('GameSymbols', 'url(/fonts/Warcrow.woff2), url(/fonts/Warcrow.ttf)');
          try {
            await font.load();
            setFontLoaded(true);
          } catch (e) {
            console.error("Error loading font:", e);
            setFontLoaded(false);
          }
        } else {
          // Fallback for browsers without document.fonts
          // Wait a short time and assume it's loaded
          setTimeout(() => setFontLoaded(true), 500);
        }
      } catch (e) {
        console.error("Font loading check failed:", e);
        setFontLoaded(false);
      }
    };

    checkFontLoading();
  }, [customChar]);

  if (!customChar) {
    return (
      <div className="p-4 bg-black/60 rounded-lg border border-warcrow-gold/40 text-center">
        <p className="text-warcrow-text/80">
          Enter a number or select a symbol from the grid to display it here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-black/60 rounded-lg border border-warcrow-gold/40">
      <h3 className="text-warcrow-gold text-sm mb-3 font-medium">Selected Symbol</h3>
      
      {fontLoaded === false && (
        <div className="mb-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-sm">
          Warning: The GameSymbols font may not have loaded correctly. Symbols might not display properly.
        </div>
      )}
      
      {isSpecialSymbol && (
        <div className="mb-3 p-2 bg-green-900/30 border border-green-500/50 rounded text-sm">
          This is character "4" which should display as a hollow shield when using the Warcrow font classes.
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-6">
        <SymbolImplementation 
          customChar={customChar} 
          fontSize={fontSize} 
          isNumeric={isNumeric} 
          isSpecialSymbol={isSpecialSymbol} 
        />
        
        <div className="text-warcrow-text space-y-1 flex-1">
          <SymbolInfoPanel 
            customChar={customChar} 
            isNumeric={isNumeric} 
            isSpecialSymbol={isSpecialSymbol} 
            fontLoaded={fontLoaded} 
          />
        </div>
      </div>
      
      <SymbolUsageExamples 
        customChar={customChar} 
        isNumeric={isNumeric} 
        isSpecialSymbol={isSpecialSymbol} 
      />
      
      <FontStyleSheet />
    </div>
  );
};
