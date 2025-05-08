
import React from 'react';
import { TextHighlighter } from '@/components/rules/TextHighlighter';

interface FormattedTextPreviewProps {
  content: string;
  className?: string;
}

export const FormattedTextPreview: React.FC<FormattedTextPreviewProps> = ({ content, className = '' }) => {
  // Create a search context wrapper to prevent the error when using TextHighlighter
  // This is a minimal implementation that provides the required context values
  const SearchContextWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Provide empty search context values since we're just using it for preview
    const searchContextValue = {
      searchTerm: '',
      setSearchTerm: () => {},
      caseSensitive: false,
      setCaseSensitive: () => {},
      filtersVisible: false,
      setFiltersVisible: () => {},
    };
    
    return (
      <div className={`border border-warcrow-gold/20 rounded-md p-3 bg-black/20 ${className}`}>
        {children}
      </div>
    );
  };
  
  return (
    <SearchContextWrapper>
      <TextHighlighter text={content} />
    </SearchContextWrapper>
  );
};
