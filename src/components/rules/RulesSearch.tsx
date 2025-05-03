
import React, { useState } from "react";
import { useSearch } from "@/contexts/SearchContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const RulesSearch = () => {
  const { setSearchTerm, caseSensitive, setCaseSensitive } = useSearch();
  const [inputValue, setInputValue] = useState("");
  const { t } = useLanguage();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setTimeout(() => {
      setSearchTerm(e.target.value);
    }, 300);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-warcrow-gold" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInput}
          placeholder={`${t('search')}...`}
          className="bg-warcrow-accent text-warcrow-text border border-warcrow-gold/30 w-full pl-10 p-2 rounded-lg focus:outline-none focus:border-warcrow-gold"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm text-warcrow-text">{t('caseSensitive')}</span>
        <Switch
          checked={caseSensitive}
          onCheckedChange={setCaseSensitive}
          className="data-[state=checked]:bg-warcrow-gold"
        />
      </div>
    </div>
  );
};
