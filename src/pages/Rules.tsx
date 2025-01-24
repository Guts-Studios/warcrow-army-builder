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

const Rules = () => {
  const navigate = useNavigate();

  // This will be replaced with actual data from Supabase later
  const chapters = [
    {
      id: "chapter-1",
      title: "Chapter 1: Basic Rules",
      sections: [
        {
          id: "section-1-1",
          title: "Introduction",
          content: "Welcome to Warcrow...",
        },
      ],
    },
  ];

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

        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          {/* Chapters Navigation */}
          <ScrollArea className="h-[calc(100vh-12rem)] bg-warcrow-accent/20 rounded-lg p-4">
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
                          className="w-full justify-start text-left text-warcrow-text hover:text-warcrow-gold"
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
          <ScrollArea className="h-[calc(100vh-12rem)] bg-warcrow-accent/20 rounded-lg p-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-warcrow-text">
                Select a section from the navigation menu to view its content.
              </p>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Rules;