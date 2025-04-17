
import React from "react";

interface SymbolUsageExamplesProps {
  customChar: string;
  isNumeric: boolean;
  isSpecialSymbol: boolean;
}

const SymbolUsageExamples: React.FC<SymbolUsageExamplesProps> = ({
  customChar,
  isNumeric,
  isSpecialSymbol
}) => {
  if (!customChar) return null;
  
  const charCode = customChar.charCodeAt(0);
  
  return (
    <div className="mt-4 p-3 bg-black/40 rounded border border-warcrow-gold/20">
      <h4 className="text-warcrow-gold/90 text-xs mb-2">Usage Examples:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <p className="text-xs text-warcrow-text/90">Standard implementation:</p>
          <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
            &lt;span class="game-symbol"&gt;{customChar}&lt;/span&gt;
          </code>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-warcrow-text/90">Warcrow implementation:</p>
          <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
            &lt;span class="Warcrow-Family"&gt;{customChar}&lt;/span&gt;
          </code>
        </div>
        {isNumeric && (
          <div className="space-y-1 md:col-span-2">
            <p className="text-xs text-warcrow-text/90">With specific numeric class (recommended):</p>
            <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto">
              &lt;span class="Warcrow-Family WC_{customChar}"&gt;{customChar}&lt;/span&gt;
            </code>
          </div>
        )}
        {isSpecialSymbol && (
          <div className="space-y-1 md:col-span-2">
            <p className="text-xs text-warcrow-text/90">Using GameSymbol component:</p>
            <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto whitespace-pre">
{`<GameSymbol 
  code={${charCode}} 
  size="lg" 
  useWarcrowClass={true} 
/>`}
            </code>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymbolUsageExamples;
