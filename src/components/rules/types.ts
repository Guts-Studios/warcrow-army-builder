
import type { Chapter, Section } from "@/hooks/useRules";

export interface SectionItemProps {
  section: Section;
  isSelected: boolean;
  isSubsection: boolean;
  onSelect: (section: Section) => void;
  expandedSection: string | null;
  setExpandedSection: (sectionId: string | null) => void;
}

export interface SectionContentProps {
  section: Section;
  onCopy: (section: Section) => void;
  onShare: (section: Section) => void;
}

export interface ChapterItemProps {
  chapter: Chapter;
  isExpanded: boolean;
  selectedSection: Section | null;
  onChapterClick: (chapter: Chapter) => void;
  onSectionSelect: (section: Section) => void;
  expandedSection: string | null;
  setExpandedSection: (sectionId: string | null) => void;
}

export interface ChapterNavigationProps {
  chapters: Chapter[];
  selectedSection: Section | null;
  setSelectedSection: (section: Section) => void;
  expandedChapter: string | undefined;
  setExpandedChapter: (chapterId: string | undefined) => void;
}
