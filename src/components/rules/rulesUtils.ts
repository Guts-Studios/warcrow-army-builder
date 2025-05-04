
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Chapter, Section } from "@/hooks/useRules";

export const useRulesActions = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleCopyText = async (section: Section) => {
    const textToCopy = `${section.title}\n\n${section.content}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: t("copiedToClipboard"),
        description: t("sectionTextCopied"),
      });
    } catch (err) {
      toast({
        title: t("failedToCopy"),
        description: t("couldNotCopyText"),
        variant: "destructive",
      });
    }
  };

  const handleDiscordShare = (section: Section) => {
    const text = `${section.title}\n\n${section.content}`;
    const discordUrl = `https://discord.com/channels/@me?message=${encodeURIComponent(text)}`;
    
    window.open(discordUrl, '_blank');
    toast({
      title: t("openingDiscord"),
      description: t("discordOpeningInNewWindow"),
    });
  };
  
  const filterChaptersBySearch = (chapters: Chapter[], searchTerm: string, caseSensitive: boolean) => {
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
  };

  return {
    handleCopyText,
    handleDiscordShare,
    filterChaptersBySearch
  };
};
