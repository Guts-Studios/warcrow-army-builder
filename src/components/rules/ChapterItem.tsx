
import * as React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TextHighlighter } from "./TextHighlighter";
import { ChapterItemProps } from "./types";
import { SectionItem } from "./SectionItem";
import { useLanguage } from "@/contexts/LanguageContext";

export const ChapterItem = ({
  chapter,
  isExpanded,
  selectedSection,
  onChapterClick,
  onSectionSelect,
  expandedSection,
  setExpandedSection
}: ChapterItemProps) => {
  const { t } = useLanguage();

  const isSubsection = (chapterTitle: string, sectionTitle: string) => {
    return chapterTitle === t("prepareTheGame") && !sectionTitle.match(/^\d+\./);
  };

  return (
    <AccordionItem 
      key={chapter.id} 
      value={chapter.id}
      className="border-b-0 px-2"
    >
      <AccordionTrigger
        className="text-warcrow-gold hover:text-warcrow-gold/80 hover:no-underline py-3 text-lg font-semibold text-left whitespace-normal break-words pr-8 select-none touch-manipulation"
        onClick={(e) => {
          e.stopPropagation();
          onChapterClick(chapter);
        }}
      >
        <TextHighlighter text={chapter.title} />
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-1 pl-4">
          {chapter.sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              isSelected={selectedSection?.id === section.id}
              isSubsection={isSubsection(chapter.title, section.title)}
              onSelect={onSectionSelect}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
