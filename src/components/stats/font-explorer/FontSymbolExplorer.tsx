
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { SymbolGrid } from './SymbolGrid';
import { SymbolControls } from './SymbolControls';
import { SelectedSymbol } from './SelectedSymbol';

const FontSymbolExplorer: React.FC = () => {
  const { t } = useLanguage();
  const [selectedRange, setSelectedRange] = useState<[number, number]>([0xE000, 0xE0FF]);
  const [selectedSymbol, setSelectedSymbol] = useState<number | null>(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load the custom font and ensure it's ready
  useEffect(() => {
    // Check if Warcrow font is loaded
    document.fonts.ready.then(() => {
      const testFont = new FontFace('Warcrow', 'url(/fonts/Warcrow.woff2)');
      testFont.load().then(() => {
        setFontLoaded(true);
      }).catch(err => {
        console.error("Error loading Warcrow font:", err);
        // Try to continue anyway
        setFontLoaded(true);
      });
    });
  }, []);

  return (
    <Card className="bg-warcrow-background border-warcrow-gold/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-warcrow-gold text-xl">{t('fontSymbolExplorer')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!fontLoaded ? (
          <div className="text-warcrow-text flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-warcrow-gold mr-3"></div>
            <span>Loading Warcrow font...</span>
          </div>
        ) : (
          <>
            <SymbolControls 
              selectedRange={selectedRange} 
              setSelectedRange={setSelectedRange}
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
            />
            
            {selectedSymbol !== null && (
              <SelectedSymbol 
                symbolCode={selectedSymbol} 
                setSelectedSymbol={setSelectedSymbol} 
              />
            )}
            
            <SymbolGrid 
              range={selectedRange} 
              selectedSymbol={selectedSymbol}
              setSelectedSymbol={setSelectedSymbol}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FontSymbolExplorer;
