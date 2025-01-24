import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clipboard, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleCopyText = async () => {
    if (selectedSection) {
      const textToCopy = `${selectedSection.title}\n\n${selectedSection.content}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        toast({
          title: "Copied to clipboard",
          description: "The section text has been copied to your clipboard.",
        });
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleShare = async () => {
    if (selectedSection) {
      const text = `${selectedSection.title}\n\n${selectedSection.content}`;
      
      // Check if Web Share API is supported
      if (!navigator.share) {
        toast({
          title: "Sharing not supported",
          description: "Your browser doesn't support sharing. The text has been copied to your clipboard instead.",
          variant: "destructive",
        });
        // Fallback to copy
        await handleCopyText();
        return;
      }

      try {
        await navigator.share({
          title: selectedSection.title,
          text: text,
          url: window.location.href, // Include the current URL
        });
        toast({
          title: "Sharing",
          description: "Opening share dialog...",
        });
      } catch (err) {
        // Only show error if it's not a user cancellation
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Share failed:", err);
          toast({
            title: "Failed to share",
            description: "Could not open share dialog. The text has been copied to your clipboard instead.",
            variant: "destructive",
          });
          // Fallback to copy
          await handleCopyText();
        }
      }
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] bg-warcrow-accent/20 rounded-lg p-6">
      <div className="prose prose-invert max-w-none">
        {selectedSection ? (
          <>
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-warcrow-gold">
                {highlightText(selectedSection.title)}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyText}
                  className="text-warcrow-gold hover:text-warcrow-gold/80 hover:bg-black/20"
                  title="Copy section text"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className="text-warcrow-gold hover:text-warcrow-gold/80 hover:bg-black/20"
                  title="Share section"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
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