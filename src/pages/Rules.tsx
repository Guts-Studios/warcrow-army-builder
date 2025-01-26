import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { RulesSearch } from "@/components/rules/RulesSearch";
import { ChapterNavigation } from "@/components/rules/ChapterNavigation";
import { ContentDisplay } from "@/components/rules/ContentDisplay";

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

const Rules = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<Section | null>(null);
  const [expandedChapter, setExpandedChapter] = React.useState<string | undefined>(undefined);

  const { data: chapters = [], isLoading, error } = useQuery({
    queryKey: ['rules-chapters'],
    queryFn: async () => {
      console.log('Fetching chapters...');
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('rules_chapters')
        .select('*')
        .order('order_index');

      if (chaptersError) {
        console.error('Error fetching chapters:', chaptersError);
        throw chaptersError;
      }

      console.log('Chapters data:', chaptersData);

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('rules_sections')
        .select('*')
        .order('order_index');

      if (sectionsError) {
        console.error('Error fetching sections:', sectionsError);
        throw sectionsError;
      }

      console.log('Sections data:', sectionsData);

      const chaptersWithSections = chaptersData.map(chapter => ({
        ...chapter,
        sections: sectionsData.filter(section => section.chapter_id === chapter.id)
      }));

      console.log('Chapters with sections:', chaptersWithSections);
      return chaptersWithSections;
    }
  });

  // Filter chapters and sections based on search term
  const filteredChapters = React.useMemo(() => {
    console.log('Filtering chapters with searchTerm:', searchTerm);
    if (!searchTerm) return chapters;

    const searchText = caseSensitive ? searchTerm : searchTerm.toLowerCase();
    const matchText = (text: string) => {
      const compareText = caseSensitive ? text : text.toLowerCase();
      return compareText.includes(searchText);
    };

    return chapters.map(chapter => ({
      ...chapter,
      sections: chapter.sections.filter(section =>
        matchText(section.title) || matchText(section.content)
      )
    })).filter(chapter =>
      matchText(chapter.title) || chapter.sections.length > 0
    );
  }, [chapters, searchTerm, caseSensitive]);

  // Highlight matching text
  const highlightText = (text: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, caseSensitive ? 'g' : 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => {
      const isMatch = caseSensitive 
        ? part === searchTerm
        : part.toLowerCase() === searchTerm.toLowerCase();
      return isMatch ? 
        <span key={index} className="bg-yellow-500/50 text-white font-medium">{part}</span> : 
        part;
    });
  };

  // Set the first section as default when chapters data is loaded
  React.useEffect(() => {
    if (chapters.length > 0 && chapters[0].sections.length > 0 && !selectedSection) {
      console.log('Setting default section:', chapters[0].sections[0]);
      setSelectedSection(chapters[0].sections[0]);
    }
  }, [chapters, selectedSection]);

  if (error) {
    console.error('Error in Rules component:', error);
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <p>Error loading rules: {error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <p>Loading rules...</p>
      </div>
    );
  }

  console.log('Rendering Rules component with chapters:', filteredChapters);

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-warcrow-gold hover:text-warcrow-gold/80"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-3xl font-bold text-warcrow-gold">Rules Reference</h1>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-[300px,1fr] gap-8">
          <div className="space-y-4 md:h-auto h-[calc(100vh-24rem)]">
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
          <ContentDisplay
            selectedSection={selectedSection}
            highlightText={highlightText}
          />
        </div>
      </div>
    </div>
  );
};

export default Rules;