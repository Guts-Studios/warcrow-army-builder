
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from '@/utils/translationUtils';

interface SpecialRulesSectionProps {
  specialRules?: string[];
}

const SpecialRulesSection: React.FC<SpecialRulesSectionProps> = ({ specialRules }) => {
  const { language } = useLanguage();
  const { translateSpecialRule } = useTranslateKeyword();
  
  if (!specialRules || specialRules.length === 0) return null;

  return (
    <div className="mt-2">
      <h4 className="text-sm font-medium text-warcrow-gold mb-1">Special Rules:</h4>
      <ul className="text-xs text-warcrow-text space-y-1">
        {specialRules.map((rule, index) => (
          <li key={index}>
            {translateSpecialRule(rule, language)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpecialRulesSection;
