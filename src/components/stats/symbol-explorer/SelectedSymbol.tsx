
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
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="space-y-4">
          <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
            <h4 className="text-warcrow-gold/90 text-xs mb-2">Current implementation:</h4>
            <div 
              className="game-symbol bg-black/40 p-4 rounded-md border border-warcrow-gold/20 min-w-16 min-h-16 flex items-center justify-center"
              style={{ fontSize: `${fontSize}px` }}
            >
              {customChar}
            </div>
            <div className="mt-2 text-xs text-warcrow-text/80 text-center">Using class="game-symbol"</div>
          </div>
          
          <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
            <h4 className="text-warcrow-gold/90 text-xs mb-2">Alternative implementation:</h4>
            <div 
              className="Warcrow-Family WC_4 bg-black/40 p-4 rounded-md border border-warcrow-gold/20 min-w-16 min-h-16 flex items-center justify-center"
              style={{ fontSize: `${fontSize}px` }}
            >
              {customChar}
            </div>
            <div className="mt-2 text-xs text-warcrow-text/80 text-center">Using class="Warcrow-Family WC_4"</div>
          </div>
        </div>
        
        <div className="text-warcrow-text space-y-1 flex-1">
          <div className="bg-black/40 p-4 rounded-md border border-warcrow-gold/20">
            <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Character Information</h4>
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
      </div>
      
      <div className="mt-4 p-3 bg-black/40 rounded border border-warcrow-gold/20">
        <h4 className="text-warcrow-gold/90 text-xs mb-2">Usage Examples:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs text-warcrow-text/90">Current implementation:</p>
            <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
              &lt;span class="game-symbol"&gt;{customChar}&lt;/span&gt;
            </code>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-warcrow-text/90">Alternative implementation:</p>
            <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
              &lt;span class="Warcrow-Family WC_4"&gt;{customChar}&lt;/span&gt;
            </code>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-black/40 rounded border border-warcrow-gold/20">
        <h4 className="text-warcrow-gold/90 text-xs mb-2">Add to fonts.css:</h4>
        <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto whitespace-pre">
{`.Warcrow-Family {
  font-family: 'GameSymbols', sans-serif;
  font-feature-settings: "liga", "calt", "dlig";
  font-variant-ligatures: common-ligatures discretionary-ligatures;
}`}
        </code>
      </div>
    </div>
  );
};
