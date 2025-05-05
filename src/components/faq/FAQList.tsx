
import React from 'react';
import { FAQItem } from './FAQItem';
import { FAQItem as FAQItemType } from '@/services/faqService';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQListProps {
  items: FAQItemType[];
}

export const FAQList: React.FC<FAQListProps> = ({ items }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-6 space-y-6 w-full">
      {items.length === 0 ? (
        <div className="text-center py-8 text-warcrow-gold/60">
          {t('noResults')}
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
