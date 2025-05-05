
import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultsCount: number;
}

export const FAQSearch: React.FC<FAQSearchProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  resultsCount 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-8 relative">
      <div className="relative">
        <input
          type="text"
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 pr-10 bg-warcrow-background/50 border border-warcrow-gold/30 rounded text-warcrow-text placeholder-warcrow-text/50 focus:outline-none focus:ring-2 focus:ring-warcrow-gold/50"
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-warcrow-gold/50" />
      </div>
      {searchQuery && (
        <div className="mt-2 text-sm text-warcrow-gold/70">
          {resultsCount === 0 
            ? t('noResults')
            : `${resultsCount} ${resultsCount === 1 ? 'result' : 'results'} found`
          }
        </div>
      )}
    </div>
  );
};
