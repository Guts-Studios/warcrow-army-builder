
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { TextHighlighter } from "./TextHighlighter";
import { SectionItemProps, SectionContentProps } from "./types";
import { Clipboard, MessageSquare } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Content component for expanded sections
export const SectionContent = ({ section, onCopy, onShare }: SectionContentProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-4 mb-6 px-4 py-3 bg-black/20 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-warcrow-gold">
          <TextHighlighter text={section.title} />
        </h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCopy(section)}
            className="text-warcrow-gold hover:text-warcrow-gold/80 hover:bg-black/20"
            title={t("copySectionText")}
          >
            <Clipboard className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onShare(section)}
            className="text-warcrow-gold hover:text-warcrow-gold/80 hover:bg-black/20"
            title={t("shareToDiscord")}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="text-warcrow-text text-base leading-relaxed whitespace-pre-wrap">
        <TextHighlighter text={section.content} />
      </div>
    </div>
  );
};

// Individual section item
export const SectionItem = ({ 
  section, 
  isSelected, 
  isSubsection,
  onSelect,
  expandedSection,
  setExpandedSection
}: SectionItemProps) => {
  const handleClick = () => {
    onSelect(section);
    setExpandedSection(expandedSection === section.id ? null : section.id);
  };
  
  return (
    <div key={section.id}>
      <Button
        variant="ghost"
        className={`w-full justify-start text-left py-2 px-3 rounded-md transition-colors whitespace-normal h-auto min-h-[2.5rem] select-none touch-manipulation ${
          isSubsection
            ? "pl-8 text-sm" 
            : ""
        } ${
          isSelected
            ? "text-warcrow-gold bg-black/40 font-medium"
            : "text-warcrow-text hover:text-warcrow-gold hover:bg-black/20"
        }`}
        onClick={handleClick}
      >
        {isSubsection && (
          <ChevronRight className="h-3 w-3 mr-1 inline-block opacity-60" />
        )}
        <span className="break-words">
          <TextHighlighter text={section.title} />
        </span>
      </Button>
      {expandedSection === section.id && (
        <SectionContent 
          section={section} 
          onCopy={(section) => {
            navigator.clipboard.writeText(`${section.title}\n\n${section.content}`);
          }}
          onShare={(section) => {
            const text = `${section.title}\n\n${section.content}`;
            const discordUrl = `https://discord.com/channels/@me?message=${encodeURIComponent(text)}`;
            window.open(discordUrl, '_blank');
          }}
        />
      )}
    </div>
  );
};
