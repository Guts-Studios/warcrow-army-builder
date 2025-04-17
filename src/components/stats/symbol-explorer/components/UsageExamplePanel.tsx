
import React from "react";

interface UsageExamplePanelProps {
  customChar: string;
}

const UsageExamplePanel: React.FC<UsageExamplePanelProps> = ({ customChar }) => {
  if (!customChar) return null;
  
  return (
    <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
      <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Usage Example</h4>
      <div className="space-y-2">
        <div className="text-warcrow-text">
          <p className="mb-2">HTML Entity:</p>
          <code className="bg-black/60 p-2 rounded text-warcrow-gold block overflow-x-auto">
            &amp;#x{customChar.charCodeAt(0).toString(16).toUpperCase()};
          </code>
        </div>
        <div className="text-warcrow-text mt-3">
          <p className="mb-2">CSS Content:</p>
          <code className="bg-black/60 p-2 rounded text-warcrow-gold block overflow-x-auto">
            content: "\{customChar.charCodeAt(0).toString(16).toUpperCase()}";
          </code>
        </div>
      </div>
    </div>
  );
};

export default UsageExamplePanel;
