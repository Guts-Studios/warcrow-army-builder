
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
    : "warcrow-font game-symbol";

  return (
    <span 
      className={`${symbolClass} ${sizeClasses[size]} ${className}`}
      style={{
        fontFeatureSettings: '"liga", "calt", "dlig"',
        ...style
      }}
    >
      {String.fromCharCode(code)}
    </span>
  );
};
