
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useLanguage } from '@/contexts/LanguageContext';
import SymbolGrid from './SymbolGrid';
import SelectedSymbol from './SelectedSymbol';
import SymbolControls from './SymbolControls';

const FontSymbolExplorer: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<number>(32);
  const [showBackground, setShowBackground] = useState<boolean>(true);
  const [backgroundColor, setBackgroundColor] = useState<string>('rgba(40, 40, 40, 0.7)');
  const { t } = useLanguage();

  // Symbol ranges for the Warcrow font
  const symbolRanges = [
    { start: 0x0041, end: 0x005A }, // A-Z
    { start: 0x0061, end: 0x007A }, // a-z
    { start: 0x0030, end: 0x0039 }, // 0-9
    { start: 0x00C0, end: 0x00FF }, // Latin-1 Supplement (special characters)
    { start: 0xE000, end: 0xE0FF }  // Private Use Area (custom symbols)
  ];

  // Generate all symbols
  const generateSymbolList = (): string[] => {
    const symbols: string[] = [];
    symbolRanges.forEach(range => {
      for (let i = range.start; i <= range.end; i++) {
        symbols.push(String.fromCodePoint(i));
      }
    });
    return symbols;
  };

  const allSymbols = generateSymbolList();

  const handleSymbolClick = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handleBackgroundToggle = () => {
    setShowBackground(!showBackground);
  };

  const handleColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  useEffect(() => {
    // Select first symbol by default
    if (!selectedSymbol && allSymbols.length > 0) {
      setSelectedSymbol(allSymbols[0]);
    }
  }, [allSymbols, selectedSymbol]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/50 border-warcrow-gold/30">
        <h1 className="text-2xl font-bold text-warcrow-gold mb-4">{t('fontSymbolExplorer') || 'Warcrow Font Symbol Explorer'}</h1>
        <p className="text-warcrow-text mb-6">
          {t('fontSymbolExplorerDescription') || 'Explore and visualize the special symbols used in Warcrow. Select a symbol to see details.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Symbol Grid - 2/3 width on desktop */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4 bg-black/60 border-warcrow-gold/30">
              <h2 className="text-lg font-medium text-warcrow-gold mb-4">{t('availableSymbols') || 'Available Symbols'}</h2>
              <SymbolGrid 
                symbols={allSymbols} 
                onSymbolClick={handleSymbolClick} 
                selectedSymbol={selectedSymbol}
                showBackground={showBackground}
                backgroundColor={backgroundColor}
              />
            </Card>
          </div>

          {/* Symbol Details - 1/3 width on desktop */}
          <div className="space-y-4">
            <Card className="p-4 bg-black/60 border-warcrow-gold/30">
              <h2 className="text-lg font-medium text-warcrow-gold mb-4">{t('selectedSymbol') || 'Selected Symbol'}</h2>
              <SelectedSymbol 
                symbol={selectedSymbol} 
                fontSize={fontSize}
                showBackground={showBackground}
                backgroundColor={backgroundColor}
              />
            </Card>

            <Card className="p-4 bg-black/60 border-warcrow-gold/30">
              <h2 className="text-lg font-medium text-warcrow-gold mb-4">{t('controls') || 'Controls'}</h2>
              <SymbolControls 
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
                showBackground={showBackground}
                onBackgroundToggle={handleBackgroundToggle}
                backgroundColor={backgroundColor}
                onColorChange={handleColorChange}
              />
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FontSymbolExplorer;
