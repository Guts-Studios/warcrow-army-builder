
import React from 'react';
import { FAQItem } from './FAQItem';
import { FAQItem as FAQItemType } from '@/services/faqService';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQListProps {
  items: FAQItemType[];
}

export const FAQList: React.FC<FAQListProps> = ({ items }) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="mt-6 space-y-6 w-full">
      {items.length === 0 ? (
        <div className="text-center py-8 text-warcrow-gold/60">
          {t('noResults')}
        </div>
      ) : (
        items.map((item) => {
          // Select the appropriate language content
          let sectionText = item.section;
          let contentText = item.content;
          
          if (language === 'es') {
            if (item.section_es) sectionText = item.section_es;
            if (item.content_es) contentText = item.content_es;
          }
          else if (language === 'fr') {
            if (item.section_fr) sectionText = item.section_fr;
            if (item.content_fr) contentText = item.content_fr;
          }
          
          return (
            <FAQItem 
              key={item.id} 
              section={sectionText} 
              content={contentText} 
            />
          );
        })
      )}
    </div>
  );
};
