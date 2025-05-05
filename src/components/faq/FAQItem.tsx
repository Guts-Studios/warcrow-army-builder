
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  // Process the answer to handle newlines, bullet points, and formatting
  const processedAnswer = answer.split('\n').map((line, i) => {
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
        <h2 className="text-xl font-semibold text-warcrow-gold mb-2">{question}</h2>
        <button className="text-warcrow-gold/70 hover:text-warcrow-gold transition-colors">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      <div className={`text-warcrow-text ${isExpanded ? 'block' : 'line-clamp-2'}`}>
        {/* If the answer has bullet points (starts with -), render as a list */}
        {answer.includes('\n-') ? (
          <ul className="list-disc space-y-1 ml-4">
            {processedAnswer}
          </ul>
        ) : (
          processedAnswer
        )}
      </div>
      {!isExpanded && answer.length > 150 && (
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
