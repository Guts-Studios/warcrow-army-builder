
import React from 'react';
import { FAQItem } from './FAQItem';
import { FAQItem as FAQItemType } from '@/services/faqService';

interface FAQListProps {
  items: FAQItemType[];
}

export const FAQList: React.FC<FAQListProps> = ({ items }) => {
  return (
    <div className="mt-6 space-y-6">
      {items.map((item) => (
        <FAQItem 
          key={item.id} 
          section={item.section} 
          content={item.content} 
        />
      ))}
    </div>
  );
};
