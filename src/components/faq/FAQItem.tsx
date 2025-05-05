
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  section: string;
  content: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ section, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
      <div className={`text-warcrow-text ${isExpanded ? 'block' : 'line-clamp-2'}`}>
        {/* If the content has bullet points (starts with -), render as a list */}
        {content.includes('\n-') ? (
          <ul className="list-disc space-y-1 ml-4">
            {processedContent}
          </ul>
        ) : (
          processedContent
        )}
      </div>
      {!isExpanded && content.length > 150 && (
        <button 
          onClick={toggleExpand}
          className="mt-2 text-sm text-warcrow-gold/70 hover:text-warcrow-gold transition-colors"
        >
          Read more
        </button>
      )}
    </div>
  );
};
