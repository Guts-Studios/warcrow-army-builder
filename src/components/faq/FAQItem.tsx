
import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <div className="border-b border-warcrow-gold/20 pb-4 mb-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-warcrow-gold mb-2">{question}</h2>
      <p className="text-warcrow-text">{answer}</p>
    </div>
  );
};
