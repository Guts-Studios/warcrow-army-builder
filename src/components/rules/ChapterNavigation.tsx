
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { ChapterItem } from "./ChapterItem";
import { useSearch } from "@/contexts/SearchContext";
import { ChapterNavigationProps } from "./types";
import { useRulesActions } from "./rulesUtils";
import type { Chapter } from "@/hooks/useRules";

export const ChapterNavigation = ({
  chapters,
  selectedSection,
  setSelectedSection,
  expandedChapter,
  setExpandedChapter,
}: ChapterNavigationProps) => {
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);
  const { searchTerm, caseSensitive, setSearchResults } = useSearch();
  const { filterChaptersBySearch } = useRulesActions();

  const handleChapterClick = (chapter: Chapter) => {
    if (chapter.sections.length > 0) {
      setSelectedSection(chapter.sections[0]);
      setExpandedChapter(chapter.id);
    }
  };

  const filteredChapters = React.useMemo(() => {
    const filtered = filterChaptersBySearch(chapters, searchTerm, caseSensitive);
    
    // Calculate total search results
    const totalResults = filtered.reduce((count, chapter) => {
      return count + chapter.sections.length;
    }, 0);
    
    // Update the search results count in context
    setSearchResults(totalResults);
    
    return filtered;
  }, [chapters, searchTerm, caseSensitive, setSearchResults, filterChaptersBySearch]);

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] md:h-[calc(100vh-16rem)] bg-warcrow-accent/20 rounded-lg p-6 overflow-y-auto" style={{
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain'
    }}>
      <div className="min-h-full w-full">
        <Accordion
          type="single"
          collapsible
          className="w-full space-y-2"
          value={expandedChapter}
          onValueChange={setExpandedChapter}
        >
          {filteredChapters.map((chapter) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              isExpanded={expandedChapter === chapter.id}
              selectedSection={selectedSection}
              onChapterClick={handleChapterClick}
              onSectionSelect={setSelectedSection}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            />
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  );
};
