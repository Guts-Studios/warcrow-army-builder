import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface ContentDisplayProps {
  selectedSection: Section | null;
  highlightText: (text: string) => React.ReactNode;
}

export const ContentDisplay = ({
  selectedSection,
  highlightText,
}: ContentDisplayProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-16rem)] bg-warcrow-accent/20 rounded-lg p-6">
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
          <p className="text-warcrow-text">Select a section to view its content</p>
        )}
      </div>
    </ScrollArea>
  );
};