import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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

  const { data: chapters = [], isLoading } = useQuery({
    queryKey: ['rules-chapters'],
    queryFn: async () => {
      // Fetch chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('rules_chapters')
        .select('*')
        .order('order_index');

      if (chaptersError) throw chaptersError;

      // Fetch sections for all chapters
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('rules_sections')
        .select('*')
        .order('order_index');

      if (sectionsError) throw sectionsError;

      // Combine chapters with their sections
      return chaptersData.map(chapter => ({
        ...chapter,
        sections: sectionsData.filter(section => section.chapter_id === chapter.id)
      }));
    }
  });

  const [selectedSection, setSelectedSection] = React.useState<Section | null>(null);

  // Set the first section as default when chapters data is loaded
  React.useEffect(() => {
    if (chapters.length > 0 && chapters[0].sections.length > 0 && !selectedSection) {
      setSelectedSection(chapters[0].sections[0]);
    }
  }, [chapters, selectedSection]);

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
          {/* Chapters Navigation */}
          <ScrollArea className="h-[300px] md:h-[calc(100vh-12rem)] bg-warcrow-accent/20 rounded-lg p-4">
            <Accordion type="single" collapsible className="w-full">
              {chapters.map((chapter) => (
                <AccordionItem key={chapter.id} value={chapter.id}>
                  <AccordionTrigger className="text-warcrow-gold hover:text-warcrow-gold/80">
                    {chapter.title}
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
                          {section.title}
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>

          {/* Content Area */}
          <ScrollArea className="h-[calc(100vh-12rem-300px)] md:h-[calc(100vh-12rem)] bg-warcrow-accent/20 rounded-lg p-6">
            <div className="prose prose-invert max-w-none">
              {selectedSection ? (
                <>
                  <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
                    {selectedSection.title}
                  </h2>
                  <div className="whitespace-pre-wrap">
                    {selectedSection.content}
                  </div>
                </>
              ) : (
                <p className="text-warcrow-text">
                  Loading content...
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