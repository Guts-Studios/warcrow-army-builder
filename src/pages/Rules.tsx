import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['rules-chapters'],
    queryFn: async () => {
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('rules_chapters')
        .select('*')
        .order('order_index');

      if (chaptersError) throw chaptersError;

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('rules_sections')
        .select('*')
        .order('order_index');

      if (sectionsError) throw sectionsError;

      return chaptersData.map(chapter => ({
        ...chapter,
        sections: sectionsData.filter(section => section.chapter_id === chapter.id)
      }));
    }
  });

  const [selectedSection, setSelectedSection] = React.useState<Section | null>(null);
  const [expandedChapter, setExpandedChapter] = React.useState<string | undefined>(undefined);

  // Filter chapters and sections based on search term
  const filteredChapters = React.useMemo(() => {
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
      setSelectedSection(chapters[0].sections[0]);
    }
  }, [chapters, selectedSection]);

  const handleChapterClick = (chapter: Chapter) => {
    if (chapter.sections.length > 0) {
      setSelectedSection(chapter.sections[0]);
      setExpandedChapter(chapter.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <p>Loading rules...</p>
      </div>
    );
  }

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
          {/* Left Column with Search and Chapters */}
          <div className="space-y-4">
            {/* Search Input and Case Sensitivity Toggle */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search rules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="case-sensitive"
                  checked={caseSensitive}
                  onCheckedChange={setCaseSensitive}
                />
                <Label htmlFor="case-sensitive" className="text-sm">
                  Case sensitive search
                </Label>
              </div>
            </div>

            {/* Chapters Navigation */}
            <ScrollArea className="h-[300px] md:h-[calc(100vh-16rem)] bg-warcrow-accent/20 rounded-lg p-4">
              <Accordion 
                type="single" 
                collapsible 
                className="w-full"
                value={expandedChapter}
                onValueChange={setExpandedChapter}
              >
                {filteredChapters.map((chapter) => (
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
                                ? 'text-warcrow-gold bg-black/40'
                                : 'text-warcrow-text hover:text-warcrow-gold'
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
          </div>

          {/* Content Area */}
          <ScrollArea className="h-[calc(100vh-16rem-300px)] md:h-[calc(100vh-16rem)] bg-warcrow-accent/20 rounded-lg p-6">
            <div className="prose prose-invert max-w-none">
              {selectedSection ? (
                <>
                  <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
                    {highlightText(selectedSection.title)}
                  </h2>
                  <div className="whitespace-pre-wrap">
                    {highlightText(selectedSection.content)}
                  </div>
                </>
              ) : (
                <p className="text-warcrow-text">
                  Select a section to view its content
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Rules;