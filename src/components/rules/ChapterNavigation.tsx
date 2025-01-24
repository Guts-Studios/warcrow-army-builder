import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  content: string;
}

interface ChapterNavigationProps {
  chapters: Chapter[];
  selectedSection: Section | null;
  setSelectedSection: (section: Section) => void;
  expandedChapter: string | undefined;
  setExpandedChapter: (chapterId: string | undefined) => void;
  highlightText: (text: string) => React.ReactNode;
}

export const ChapterNavigation = ({
  chapters,
  selectedSection,
  setSelectedSection,
  expandedChapter,
  setExpandedChapter,
  highlightText,
}: ChapterNavigationProps) => {
  const handleChapterClick = (chapter: Chapter) => {
    if (chapter.sections.length > 0) {
      setSelectedSection(chapter.sections[0]);
      setExpandedChapter(chapter.id);
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] bg-warcrow-accent/20 rounded-lg p-4">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={expandedChapter}
        onValueChange={setExpandedChapter}
      >
        {chapters.map((chapter) => (
          <AccordionItem key={chapter.id} value={chapter.id}>
            <AccordionTrigger
              className="text-warcrow-gold hover:text-warcrow-gold/80"
              onClick={(e) => {
                e.stopPropagation();
                handleChapterClick(chapter);
              }}
            >
              {highlightText(chapter.title)}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-4">
                {chapter.sections.map((section) => (
                  <Button
                    key={section.id}
                    variant="ghost"
                    className={`w-full justify-start text-left ${
                      selectedSection?.id === section.id
                        ? "text-warcrow-gold bg-black/40"
                        : "text-warcrow-text hover:text-warcrow-gold"
                    }`}
                    onClick={() => setSelectedSection(section)}
                  >
                    {highlightText(section.title)}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};