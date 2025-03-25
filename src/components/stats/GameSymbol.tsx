
import React from "react";

interface GameSymbolProps {
  code: number;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  style?: React.CSSProperties;
  useWarcrowClass?: boolean;
  bgColor?: string; // New prop for background color
}

export const GameSymbol: React.FC<GameSymbolProps> = ({ 
  code, 
  size = "md", 
  className = "",
  style = {},
  useWarcrowClass = false,
  bgColor
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
      className={`${symbolClass} ${sizeClasses[size]} ${className} ${bgColor ? 'inline-flex items-center justify-center rounded px-1' : ''}`}
      style={{
        fontFeatureSettings: '"liga", "calt", "dlig"',
        backgroundColor: bgColor || 'transparent',
        // Use color overlay for dark symbols instead of text-shadow
        ...(isDarkSymbol ? {
          background: bgColor || 'radial-gradient(circle, rgba(0,0,0,0.9) 60%, rgba(60,60,60,0.8) 100%)',
          WebkitBackgroundClip: !bgColor ? 'text' : 'unset',
          WebkitTextFillColor: !bgColor ? 'transparent' : 'inherit',
          filter: 'contrast(1.5) brightness(1.2)',
        } : {
          // Removed the text-shadow here
          filter: 'saturate(1.2)'
        }),
        ...style
      }}
    >
      {String.fromCharCode(code)}
    </span>
  );
};
