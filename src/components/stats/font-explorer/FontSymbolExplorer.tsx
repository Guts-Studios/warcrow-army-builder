
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import NumericInput from '../symbol-explorer/NumericInput';
import SymbolControls from '../symbol-explorer/SymbolControls';
import { toast } from 'sonner';

const FontSymbolExplorer: React.FC = () => {
  const [charCode, setCharCode] = useState<number>(0xE000); // Warcrow font typically starts at Unicode private use area
  const [fontSize, setFontSize] = useState<number>(64);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const incrementChar = () => setCharCode(prev => prev + 1);
  const decrementChar = () => setCharCode(prev => prev - 1);
  
  const handleCopyToClipboard = () => {
    const char = String.fromCodePoint(charCode);
    navigator.clipboard.writeText(char)
      .then(() => toast.success("Symbol copied to clipboard"))
      .catch(() => toast.error("Failed to copy symbol"));
  };
  
  const handleCopyCodeToClipboard = () => {
    const codeText = `U+${charCode.toString(16).toUpperCase()}`;
    navigator.clipboard.writeText(codeText)
      .then(() => toast.success("Code copied to clipboard"))
      .catch(() => toast.error("Failed to copy code"));
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Warcrow Font Symbol Explorer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 col-span-1">
          <h2 className="text-lg font-semibold mb-4">Controls</h2>
          
          <div className="space-y-4">
            <NumericInput
              label="Character Code (Hex)"
              value={`0x${charCode.toString(16).toUpperCase()}`}
              onChange={(value) => {
                if (value.startsWith('0x')) {
                  try {
                    const parsed = parseInt(value, 16);
                    if (!isNaN(parsed)) {
                      setCharCode(parsed);
                    }
                  } catch (e) {
                    // Invalid input
                  }
                }
              }}
            />
            
            <NumericInput
              label="Font Size"
              value={fontSize.toString()}
              onChange={(value) => {
                const parsed = parseInt(value);
                if (!isNaN(parsed) && parsed > 0 && parsed <= 200) {
                  setFontSize(parsed);
                }
              }}
            />
            
            <SymbolControls 
              onIncrement={incrementChar}
              onDecrement={decrementChar}
              onCopy={handleCopyToClipboard}
              onCopyCode={handleCopyCodeToClipboard}
              onToggleDetails={() => setShowDetails(!showDetails)}
              showDetails={showDetails}
            />
          </div>
        </Card>
        
        <Card className="p-4 col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Symbol Preview</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 flex items-center justify-center h-56">
            <span 
              className="font-warcrow" 
              style={{ 
                fontSize: `${fontSize}px`,
                lineHeight: 1
              }}
            >
              {String.fromCodePoint(charCode)}
            </span>
          </div>
          
          {showDetails && (
            <div className="mt-4 bg-black/30 p-3 rounded">
              <h3 className="font-medium text-sm mb-2">Symbol Details</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <dt className="text-gray-400">Unicode</dt>
                <dd>U+{charCode.toString(16).toUpperCase()}</dd>
                
                <dt className="text-gray-400">HTML Entity</dt>
                <dd>&amp;#x{charCode.toString(16)};</dd>
                
                <dt className="text-gray-400">CSS</dt>
                <dd>\{charCode.toString(16)}</dd>
                
                <dt className="text-gray-400">JavaScript</dt>
                <dd>String.fromCodePoint(0x{charCode.toString(16)})</dd>
              </dl>
            </div>
          )}
        </Card>
      </div>
      
      <Card className="p-4 mt-6">
        <h2 className="text-lg font-semibold mb-4">Common Warcrow Font Symbols</h2>
        <div className="grid grid-cols-6 md:grid-cols-12 gap-3">
          {Array.from({ length: 24 }, (_, i) => (
            <div 
              key={i}
              className="aspect-square flex items-center justify-center border rounded cursor-pointer hover:bg-black/30"
              onClick={() => setCharCode(0xE000 + i)}
            >
              <span className="font-warcrow text-2xl">
                {String.fromCodePoint(0xE000 + i)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FontSymbolExplorer;
