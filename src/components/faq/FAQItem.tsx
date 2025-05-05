
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  // Process the answer to handle newlines and formatting
  const processedAnswer = answer.split('\n').map((line, i) => (
    <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>
  ));

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
        {processedAnswer}
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
