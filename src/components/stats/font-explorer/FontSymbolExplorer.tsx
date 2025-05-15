
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FontSymbolExplorer: React.FC = () => {
  return (
    <Card className="border-warcrow-gold/30">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">Font Symbol Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-warcrow-text">
          This tool allows you to explore the custom font symbols used in Warcrow.
          Select characters from the grid to view their details.
        </p>
        
        <div className="mt-6 grid grid-cols-8 gap-2">
          {Array.from({ length: 64 }, (_, i) => i + 0xE000).map((charCode) => (
            <div 
              key={charCode} 
              className="w-10 h-10 flex items-center justify-center bg-warcrow-accent/50 border border-warcrow-gold/20 rounded cursor-pointer hover:bg-warcrow-gold/20"
            >
              <span className="text-2xl text-warcrow-gold font-warcrow">
                {String.fromCharCode(charCode)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 border border-warcrow-gold/30 rounded-md bg-black/30">
          <h3 className="text-sm font-medium text-warcrow-gold mb-2">Selected Symbol</h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center bg-warcrow-accent border border-warcrow-gold/40 rounded">
              <span className="text-4xl text-warcrow-gold font-warcrow">
                ⚔
              </span>
            </div>
            <div>
              <p className="text-warcrow-text">Unicode: U+2694</p>
              <p className="text-warcrow-text">Description: Crossed Swords</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FontSymbolExplorer;
