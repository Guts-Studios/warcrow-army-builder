
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FontSizeSelectorProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  sizes?: number[];
}

const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({ 
  fontSize, 
  setFontSize, 
  sizes = [24, 36, 48, 60, 72] 
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-warcrow-text/90 block">
        Font Size
      </Label>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <Button 
            key={size}
            size="sm"
            variant="outline"
            onClick={() => setFontSize(size)}
            className={`
              ${fontSize === size 
                ? "bg-warcrow-gold/20 border-warcrow-gold text-warcrow-gold" 
                : "bg-black/60 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10"}
            `}
          >
            {size}px
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FontSizeSelector;
