
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItemProps {
  section: string;
  content: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ section, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  // Process the content to handle newlines, bullet points, and formatting
  const processedContent = content.split('\n').map((line, i) => {
    // Check if the line is a bullet point
    if (line.trim().startsWith('-')) {
      return (
        <li key={i} className="ml-6 list-disc mt-1">
          {line.trim().substring(1).trim()}
        </li>
      );
    }
    // Regular paragraph
    return (
      <p key={i} className={i > 0 ? "mt-2" : ""}>
        {line}
      </p>
    );
  });

  return (
    <div className="border-b border-warcrow-gold/20 pb-4 mb-6 animate-fade-in">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <h2 className="text-xl font-semibold text-warcrow-gold mb-2">{section}</h2>
        <button className="text-warcrow-gold/70 hover:text-warcrow-gold transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      
      {isExpanded ? (
        <div className="text-warcrow-text mt-2">
          {content.includes('\n-') ? (
            <ul className="list-disc space-y-1 ml-4">
              {processedContent}
            </ul>
          ) : (
            processedContent
          )}
        </div>
      ) : (
        <div className="text-warcrow-text/70 line-clamp-1 italic text-sm">
          {t('faq_click_to_expand') || "Click to view answer"}
        </div>
      )}
    </div>
  );
};
