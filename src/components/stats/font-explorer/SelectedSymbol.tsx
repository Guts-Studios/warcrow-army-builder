
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface SelectedSymbolProps {
  symbolCode: number;
  setSelectedSymbol: (code: number | null) => void;
}

export const SelectedSymbol: React.FC<SelectedSymbolProps> = ({ symbolCode, setSelectedSymbol }) => {
  const [copied, setCopied] = useState(false);
  
  const symbol = String.fromCodePoint(symbolCode);
  const hexCode = symbolCode.toString(16).toUpperCase();
  const htmlEntity = `&#x${hexCode};`;
  const cssCode = `\\${hexCode}`;
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast.error('Failed to copy to clipboard');
    });
  };
  
  return (
    <Card className="border-warcrow-gold/30 bg-black/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-warcrow-gold text-lg">Selected Symbol</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-shrink-0 w-20 h-20 border border-warcrow-gold/30 rounded flex items-center justify-center bg-black/30">
            <span className="text-5xl font-warcrow text-warcrow-gold">{symbol}</span>
          </div>
          
          <div className="flex-grow space-y-3">
            <div>
              <Label className="text-warcrow-text block mb-1">Unicode</Label>
              <div className="flex gap-2">
                <Input 
                  value={`U+${hexCode}`} 
                  readOnly 
                  className="bg-black border-warcrow-gold/30 font-mono text-warcrow-text"
                />
                <Button 
                  size="icon" 
                  onClick={() => copyToClipboard(`U+${hexCode}`, 'Unicode')}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-gold/10"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-warcrow-text block mb-1">HTML Entity</Label>
              <div className="flex gap-2">
                <Input 
                  value={htmlEntity} 
                  readOnly 
                  className="bg-black border-warcrow-gold/30 font-mono text-warcrow-text"
                />
                <Button 
                  size="icon" 
                  onClick={() => copyToClipboard(htmlEntity, 'HTML Entity')}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-gold/10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="text-warcrow-text block mb-1">CSS Content</Label>
              <div className="flex gap-2">
                <Input 
                  value={cssCode} 
                  readOnly 
                  className="bg-black border-warcrow-gold/30 font-mono text-warcrow-text"
                />
                <Button 
                  size="icon" 
                  onClick={() => copyToClipboard(cssCode, 'CSS Code')}
                  className="border border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-gold/10"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
