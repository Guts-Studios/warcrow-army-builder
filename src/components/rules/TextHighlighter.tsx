
import React from "react";
import { useSearch } from "@/contexts/SearchContext";

interface TextHighlighterProps {
  text: string;
}

export const TextHighlighter = ({ text }: TextHighlighterProps) => {
  const { searchTerm, caseSensitive } = useSearch();

  if (!searchTerm) return <>{text}</>;

  const searchRegex = new RegExp(
    `(${searchTerm})`,
    caseSensitive ? "g" : "gi"
  );
  const parts = text.split(searchRegex);
  
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
          <span key={i} className="bg-yellow-500/30">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};
