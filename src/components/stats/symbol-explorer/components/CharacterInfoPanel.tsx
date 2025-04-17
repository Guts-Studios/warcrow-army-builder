
import React from "react";

interface CharacterInfoPanelProps {
  customChar: string;
}

const CharacterInfoPanel: React.FC<CharacterInfoPanelProps> = ({ customChar }) => {
  if (!customChar) return null;
  
  return (
    <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
      <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Character Information</h4>
      <div className="space-y-2 text-warcrow-text">
        <div className="grid grid-cols-3 gap-2">
          <span className="text-warcrow-text/60">Character:</span>
          <span className="text-warcrow-gold col-span-2">{customChar}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-warcrow-text/60">Unicode:</span>
          <span className="text-warcrow-gold col-span-2">U+{customChar.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-warcrow-text/60">Decimal:</span>
          <span className="text-warcrow-gold col-span-2">{customChar.charCodeAt(0)}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <span className="text-warcrow-text/60">Hexadecimal:</span>
          <span className="text-warcrow-gold col-span-2">0x{customChar.charCodeAt(0).toString(16).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterInfoPanel;
