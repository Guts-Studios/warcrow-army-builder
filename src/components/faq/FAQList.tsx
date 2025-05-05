
import React from 'react';
import { FAQItem } from './FAQItem';
import { FAQItem as FAQItemType } from '@/services/faqService';

interface FAQListProps {
  items: FAQItemType[];
}

export const FAQList: React.FC<FAQListProps> = ({ items }) => {
  return (
    <div className="mt-6 space-y-6">
      {items.length === 0 ? (
        <div className="text-center py-8 text-warcrow-gold/60">
          No FAQ items found
        </div>
      ) : (
        items.map((item) => (
          <FAQItem 
            key={item.id} 
            section={item.section} 
            content={item.content} 
          />
        ))
      )}
    </div>
  );
};
