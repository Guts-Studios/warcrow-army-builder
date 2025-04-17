
import React from "react";

const FontStyleSheet: React.FC = () => {
  return (
    <div className="mt-4 p-3 bg-black/40 rounded border border-warcrow-gold/20">
      <h4 className="text-warcrow-gold/90 text-xs mb-2">Add to fonts.css:</h4>
      <code className="block text-xs bg-black/60 p-2 rounded text-warcrow-gold overflow-x-auto whitespace-pre">
{`.Warcrow-Family {
  font-family: 'GameSymbols', sans-serif;
  font-feature-settings: "liga", "calt", "dlig";
  font-variant-ligatures: common-ligatures discretionary-ligatures;
}

/* Specific numeric character classes */
.WC_1, .WC_2, .WC_3, .WC_4, .WC_5, 
.WC_6, .WC_7, .WC_8, .WC_9, .WC_0 {
  /* These classes can have specific styling if needed */
}`}
      </code>
    </div>
  );
};

export default FontStyleSheet;
