
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumericInput } from "../symbol-explorer/NumericInput";
import { SymbolControls } from "../symbol-explorer/SymbolControls";
import { useLanguage } from '@/contexts/LanguageContext';

const FontSymbolExplorer: React.FC = () => {
  const { t } = useLanguage();
  const [charCode, setCharCode] = useState(59648); // Start with first character in the Warcrow font
  const [fontSize, setFontSize] = useState(48);
  const [copied, setCopied] = useState(false);
  
  // Convert the character code to a unicode character
  const unicodeChar = String.fromCodePoint(charCode);
  
  // Copy the character to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(unicodeChar);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle input changes
  const handleCharCodeChange = (value: number) => {
    setCharCode(value);
  };
  
  const handleFontSizeChange = (value: number) => {
    setFontSize(value);
  };
  
  // Navigate to next/previous symbol
  const goToPrevious = () => {
    setCharCode(prev => Math.max(0, prev - 1));
  };
  
  const goToNext = () => {
    setCharCode(prev => prev + 1);
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-warcrow-gold mb-2">{t('fontSymbolExplorer')}</h1>
          <p className="text-warcrow-text/80">{t('fontSymbolExplorerDescription')}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-4 col-span-1 bg-black/40 border border-warcrow-gold/30">
            <div className="space-y-4">
              <div>
                <Label htmlFor="charCode" className="text-warcrow-text/80">Character Code</Label>
                <NumericInput
                  id="charCode"
                  value={charCode}
                  onChange={handleCharCodeChange}
                  min={0}
                  max={65535}
                />
              </div>
              
              <div>
                <Label htmlFor="fontSize" className="text-warcrow-text/80">Font Size</Label>
                <NumericInput
                  id="fontSize"
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  min={8}
                  max={120}
                />
              </div>
              
              <SymbolControls 
                onPrevious={goToPrevious}
                onNext={goToNext}
                onCopy={copyToClipboard}
                copied={copied}
              />
              
              <div className="pt-2">
                <Label className="text-warcrow-text/80 block mb-1">Hex Code</Label>
                <Input 
                  value={`U+${charCode.toString(16).toUpperCase().padStart(4, '0')}`}
                  readOnly 
                  className="bg-black/60 border-warcrow-gold/30 text-warcrow-text font-mono"
                />
              </div>
            </div>
          </Card>
          
          <Card className="p-4 col-span-1 lg:col-span-2 bg-black/40 border border-warcrow-gold/30">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium text-warcrow-gold">Symbol Preview</h3>
                <span className="text-warcrow-text/80 text-sm">
                  Character: {charCode}
                </span>
              </div>
              
              <AspectRatio ratio={1} className="bg-black/60 border border-warcrow-gold/30 rounded-md">
                <div className="flex items-center justify-center h-full">
                  <span 
                    className="font-warcrow" 
                    style={{ 
                      fontSize: `${fontSize}px`, 
                      lineHeight: 1,
                      display: 'block'
                    }}
                  >
                    {unicodeChar}
                  </span>
                </div>
              </AspectRatio>
              
              <div className="text-center">
                <button 
                  onClick={copyToClipboard}
                  className="mt-2 px-4 py-2 bg-warcrow-gold/20 hover:bg-warcrow-gold/30 text-warcrow-gold rounded-md transition"
                >
                  {copied ? 'Copied!' : 'Click to Copy'}
                </button>
              </div>
              
              <div className="p-3 bg-black/60 border border-warcrow-gold/30 rounded-md">
                <Label className="text-warcrow-text/80 block mb-1">HTML Usage</Label>
                <code className="block p-2 bg-black/80 rounded text-sm text-warcrow-text/90 font-mono">
                  {`<span class="font-warcrow">${unicodeChar}</span>`}
                </code>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FontSymbolExplorer;
