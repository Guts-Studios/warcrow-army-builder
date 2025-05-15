
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clipboard, ClipboardCheck, ChevronUp, ChevronDown, Info } from 'lucide-react';

interface SymbolControlsProps {
  onIncrement: () => void;
  onDecrement: () => void;
  onCopy: () => void;
  onCopyCode: () => void;
  onToggleDetails: () => void;
  showDetails: boolean;
}

export const SymbolControls: React.FC<SymbolControlsProps> = ({
  onIncrement,
  onDecrement,
  onCopy,
  onCopyCode,
  onToggleDetails,
  showDetails
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onDecrement}
        className="bg-black/40 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/20"
      >
        <ChevronDown className="h-4 w-4" />
        <span className="sr-only">Previous Symbol</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onIncrement}
        className="bg-black/40 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/20"
      >
        <ChevronUp className="h-4 w-4" />
        <span className="sr-only">Next Symbol</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onCopy}
        className="bg-black/40 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/20"
      >
        <Clipboard className="h-4 w-4 mr-1" />
        <span className="text-xs">Copy Symbol</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onCopyCode}
        className="bg-black/40 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/20"
      >
        <ClipboardCheck className="h-4 w-4 mr-1" />
        <span className="text-xs">Copy Code</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleDetails}
        className={`bg-black/40 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/20 ${
          showDetails ? "bg-warcrow-gold/30" : ""
        }`}
      >
        <Info className="h-4 w-4 mr-1" />
        <span className="text-xs">Details</span>
      </Button>
    </div>
  );
};
