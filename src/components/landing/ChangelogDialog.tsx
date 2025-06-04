
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

export const ChangelogDialog = () => {
  const { t } = useLanguage();
  const [changelogContent, setChangelogContent] = useState<string>("");
  
  // Function to fetch changelog content from the public path
  const fetchChangelogContent = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/CHANGELOG.md?t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Accept': 'text/plain, text/markdown'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch changelog: ${response.status}`);
      }
      
      const content = await response.text();
      setChangelogContent(content);
    } catch (error) {
      console.error('[ChangelogDialog] Failed to fetch changelog content:', error);
      setChangelogContent("# Changelog\n\nFailed to load changelog content.");
    }
  };
  
  // Load changelog content on mount
  useEffect(() => {
    fetchChangelogContent();
  }, []);

  return (
    <div className="mt-3 pt-3 border-t border-warcrow-gold/20">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="text-warcrow-gold hover:text-warcrow-gold/80 text-sm p-0 h-auto"
          >
            {t('viewChangelog')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">
              {t('changelog')}
            </DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap font-mono text-sm">
            {changelogContent}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
