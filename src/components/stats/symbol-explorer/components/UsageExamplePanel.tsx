
import React from "react";
import FontStyleSheet from "./FontStyleSheet";

interface UsageExamplePanelProps {
  customChar: string;
}

const UsageExamplePanel: React.FC<UsageExamplePanelProps> = ({ customChar }) => {
  const cssClass = customChar && /^\d$/.test(customChar) ? `.WC_${customChar}` : '.Warcrow-Family';
  
  return (
    <div>
      <div className="p-3 bg-black/60 rounded border border-warcrow-gold/20 mb-3">
        <h4 className="text-warcrow-gold/90 text-xs mb-2">Usage in HTML</h4>
        <code className="block text-xs bg-black/80 p-2 rounded text-warcrow-gold overflow-x-auto whitespace-pre">
          {`<span class="game-symbol">${customChar}</span>`}
        </code>
      </div>
      
      <div className="p-3 bg-black/60 rounded border border-warcrow-gold/20">
        <h4 className="text-warcrow-gold/90 text-xs mb-2">Usage in React</h4>
        <code className="block text-xs bg-black/80 p-2 rounded text-warcrow-gold overflow-x-auto whitespace-pre">
{`<GameSymbol 
  code={${customChar.charCodeAt(0)}} 
  size="md" 
/>`}
        </code>
      </div>
      
      <FontStyleSheet />
    </div>
  );
};

export default UsageExamplePanel;
