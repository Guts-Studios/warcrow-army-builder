
import React from "react";

interface CharacterInfoPanelProps {
  customChar: string;
}

const CharacterInfoPanel: React.FC<CharacterInfoPanelProps> = ({ customChar }) => {
  // Calculate character code
  const charCode = customChar ? customChar.charCodeAt(0) : 0;
  
  return (
    <div className="p-3 bg-black/60 rounded border border-warcrow-gold/20">
      <h4 className="text-warcrow-gold/90 text-sm mb-2">Character Information</h4>
      <div className="space-y-2 text-xs text-warcrow-text">
        <div className="flex justify-between">
          <span>Character:</span>
          <span className="font-mono bg-black/40 px-2 py-1 rounded">{customChar}</span>
        </div>
        <div className="flex justify-between">
          <span>Unicode:</span>
          <span className="font-mono bg-black/40 px-2 py-1 rounded">U+{charCode.toString(16).toUpperCase().padStart(4, '0')}</span>
        </div>
        <div className="flex justify-between">
          <span>HTML Entity:</span>
          <span className="font-mono bg-black/40 px-2 py-1 rounded">&amp;#{charCode};</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterInfoPanel;
