
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { newsItems } from "@/data/newsArchive";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface NewsArchiveDialogProps {
  triggerClassName?: string;
}

export const NewsArchiveDialog = ({ triggerClassName }: NewsArchiveDialogProps) => {
  const { t, language } = useLanguage();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "PPP", { locale: language === 'es' ? es : undefined });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="link" 
          className={triggerClassName || "text-warcrow-gold hover:text-warcrow-gold/80"}
        >
          {t('viewOlderNews')}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-gold/30 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {t('newsArchive')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {newsItems.map((item) => (
            <div key={item.id} className="border border-warcrow-gold/30 rounded-lg p-4">
              <div className="text-warcrow-gold font-semibold mb-2">
                {formatDate(item.date)}
              </div>
              <div className="text-warcrow-text text-sm">
                {t(item.key)}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsArchiveDialog;
