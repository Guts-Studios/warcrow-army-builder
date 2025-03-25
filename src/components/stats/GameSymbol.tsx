
import React from "react";

interface GameSymbolProps {
  code: number;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  style?: React.CSSProperties;
  useWarcrowClass?: boolean;
}

export const GameSymbol: React.FC<GameSymbolProps> = ({ 
  code, 
  size = "md", 
  className = "",
  style = {},
  useWarcrowClass = false
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };
  
  const charCode = String.fromCharCode(code);
  // Check if this is specifically a number character
  const isNumber = /^\d$/.test(charCode);
  
  // Choose the appropriate class based on the character and useWarcrowClass prop
  const symbolClass = useWarcrowClass 
    ? `Warcrow-Family ${isNumber ? `WC_${charCode}` : ''}`
    : "font-warcrow game-symbol";

  // Determine if this is a dark symbol (like black) that needs special treatment
  const isDarkSymbol = charCode === '7'; // Code 55 is the black circle

  return (
    <span 
      className={`${symbolClass} ${sizeClasses[size]} ${className}`}
      style={{
        fontFeatureSettings: '"liga", "calt", "dlig"',
        // Enhanced visibility for all symbols, with special handling for dark ones
        textShadow: isDarkSymbol 
          ? '0 0 1px #fff, 0 0 3px #fff, 0 0 5px rgba(255,255,255,0.8), 0 0 7px rgba(255,255,255,0.5)' 
          : '0 0 1px #fff, 0 0 2px #fff, 0 0 3px rgba(255,255,255,0.5)',
        filter: isDarkSymbol ? 'saturate(1.4) brightness(1.1)' : 'saturate(1.2)', // Boost dark symbols more
        ...style
      }}
    >
      {String.fromCharCode(code)}
    </span>
  );
};
