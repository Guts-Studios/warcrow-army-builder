
import React from "react";

interface GameSymbolProps {
  code: number;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  className?: string;
  style?: React.CSSProperties;
}

export const GameSymbol: React.FC<GameSymbolProps> = ({ 
  code, 
  size = "md", 
  className = "",
  style = {}
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  };

  return (
    <span 
      className={`game-symbol ${sizeClasses[size]} ${className}`}
      style={{
        fontFeatureSettings: '"liga", "calt", "dlig"',
        ...style
      }}
    >
      {String.fromCharCode(code)}
    </span>
  );
};
