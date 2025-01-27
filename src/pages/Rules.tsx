import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChapterNavigation } from "@/components/rules/ChapterNavigation";
import { RulesSearch } from "@/components/rules/RulesSearch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronUp } from "lucide-react";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

const Rules = () => {
  const navigate = useNavigate();
  const [selectedSection, setSelectedSection] = React.useState<Section | null>(null);
  const [expandedChapter, setExpandedChapter] = React.useState<string>();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [caseSensitive, setCaseSensitive] = React.useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("rules_chapters")
        .select("*")
        .order("order_index");

      if (chaptersError) throw chaptersError;

      const { data: sectionsData, error: sectionsError } = await supabase
        .from("rules_sections")
        .select("*")
        .order("order_index");

      if (sectionsError) throw sectionsError;

      return chaptersData.map((chapter) => ({
        ...chapter,
        sections: sectionsData
          .filter((section) => section.chapter_id === chapter.id)
          .map((section) => ({
            id: section.id,
            title: section.title,
            content: section.content,
          })),
      }));
    },
  });

  const highlightText = (text: string) => {
    if (!searchTerm) return text;

    const searchRegex = new RegExp(
      `(${searchTerm})`,
      caseSensitive ? "g" : "gi"
    );
    const parts = text.split(searchRegex);
    
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={i} className="bg-yellow-500/30">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const filteredChapters = React.useMemo(() => {
    if (!searchTerm) return chapters;

    return chapters
      .map((chapter) => ({
        ...chapter,
        sections: chapter.sections.filter(
          (section) =>
            (caseSensitive
              ? section.title.includes(searchTerm)
              : section.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (caseSensitive
              ? section.content.includes(searchTerm)
              : section.content.toLowerCase().includes(searchTerm.toLowerCase()))
        ),
      }))
      .filter(
        (chapter) =>
          chapter.sections.length > 0 ||
          (caseSensitive
            ? chapter.title.includes(searchTerm)
            : chapter.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
  }, [chapters, searchTerm, caseSensitive]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="w-full max-w-xs flex justify-center gap-3">
            <button 
              onClick={() => navigate('/landing')} 
              className="bg-warcrow-accent text-warcrow-text px-3 py-1.5 rounded hover:bg-warcrow-accent/80 transition-colors text-sm border border-warcrow-gold/30"
            >
              Landing Page
            </button>
            <button 
              onClick={() => navigate('/builder')} 
              className="bg-warcrow-accent text-warcrow-text px-3 py-1.5 rounded hover:bg-warcrow-accent/80 transition-colors text-sm border border-warcrow-gold/30"
            >
              Builder
            </button>
          </div>
          <img
            src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z"
            alt="Warcrow Logo"
            className="h-24 md:h-32"
          />
          <div className="w-[100px]" />
        </div>

        <div className="space-y-4">
          <RulesSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            caseSensitive={caseSensitive}
            setCaseSensitive={setCaseSensitive}
          />
          <ChapterNavigation
            chapters={filteredChapters}
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            expandedChapter={expandedChapter}
            setExpandedChapter={setExpandedChapter}
            highlightText={highlightText}
          />
        </div>
        <Button
          onClick={scrollToTop}
          variant="outline"
          className="fixed bottom-4 right-4 z-50 rounded-full p-2 bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default Rules;