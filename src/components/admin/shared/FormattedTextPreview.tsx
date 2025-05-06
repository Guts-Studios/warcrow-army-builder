
import React from 'react';

interface FormattedTextPreviewProps {
  content: string;
  className?: string;
}

export const FormattedTextPreview: React.FC<FormattedTextPreviewProps> = ({ content, className = '' }) => {
  return (
    <div 
      className={`border border-warcrow-gold/20 rounded-md p-3 bg-black/20 ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
