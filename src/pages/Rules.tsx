
import * as React from "react";
import { ChapterNavigation } from "@/components/rules/ChapterNavigation";
import { RulesSearch } from "@/components/rules/RulesSearch";
import { ScrollToTopButton } from "@/components/rules/ScrollToTopButton";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchProvider } from "@/contexts/SearchContext";
import { useRules } from "@/hooks/useRules";
import type { Section } from "@/hooks/useRules";

const Rules = () => {
  const [selectedSection, setSelectedSection] = React.useState<Section | null>(null);
  const [expandedChapter, setExpandedChapter] = React.useState<string>();
  const { data: chapters = [], isLoading } = useRules();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title="Rules" />
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <SearchProvider>
          <RulesSearch />
          <ChapterNavigation
            chapters={chapters}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            expandedChapter={expandedChapter}
            setExpandedChapter={setExpandedChapter}
          />
        </SearchProvider>
        <ScrollToTopButton />
      </div>
    </div>
  );
};

export default Rules;
