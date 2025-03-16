
import React, { useEffect, useState } from "react";

interface SelectedSymbolProps {
  customChar: string;
  fontSize: number;
}

export const SelectedSymbol: React.FC<SelectedSymbolProps> = ({ customChar, fontSize }) => {
  const [fontLoaded, setFontLoaded] = useState<boolean | null>(null);
  const [isNumeric, setIsNumeric] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the current character is a numeric character
    const code = customChar.charCodeAt(0);
    setIsNumeric(code >= 48 && code <= 57); // ASCII 48-57 are digits 0-9
    
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

  if (!customChar) return null;

  return (
    <div className="p-4 bg-black/60 rounded-lg border border-warcrow-gold/40">
      <h3 className="text-warcrow-gold text-sm mb-3 font-medium">Selected Symbol</h3>
      
      {fontLoaded === false && (
        <div className="mb-3 p-2 bg-red-900/30 border border-red-500/50 rounded text-sm">
          Warning: The GameSymbols font may not have loaded correctly. Symbols might not display properly.
        </div>
      )}
      
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
          {isNumeric && (
            <div>
              Type: <span className="text-green-500 ml-1">Numeric Character ({customChar})</span>
            </div>
          )}
          <div>
            Font: <span className={`ml-1 ${fontLoaded === true ? 'text-green-500' : fontLoaded === false ? 'text-red-500' : 'text-yellow-500'}`}>
              {fontLoaded === true ? 'Loaded' : fontLoaded === false ? 'Failed to load' : 'Checking...'}
            </span>
          </div>
        </div>
      </div>
      
      {isNumeric && (
        <div className="mt-4 p-3 bg-black/40 rounded border border-warcrow-gold/20">
          <h4 className="text-warcrow-gold/90 text-xs mb-2">Numeric Character Usage:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-warcrow-text/90">In HTML:</p>
              <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
                &lt;span class="game-symbol"&gt;{customChar}&lt;/span&gt;
              </code>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-warcrow-text/90">In React:</p>
              <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
                &lt;span className="game-symbol"&gt;{customChar}&lt;/span&gt;
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
