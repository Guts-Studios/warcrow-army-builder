
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Copy, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SelectedUnit } from "@/types/army";
import { generateListText } from "@/utils/listFormatUtils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ExportDialogProps {
  selectedUnits: SelectedUnit[];
  listName: string | null;
}

const ExportDialog = ({ selectedUnits, listName }: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();

  // Get faction from the first unit
  const factionId = selectedUnits[0]?.faction;

  const fullText = generateListText(selectedUnits, listName, factionId, language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      toast({
        title: language === 'es' ? "Copiado al portapapeles" : "Copied to clipboard",
        description: language === 'es' ? "La lista del ejército ha sido copiada al portapapeles" : "Army list has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: language === 'es' ? "Error al copiar" : "Failed to copy",
        description: language === 'es' ? "No se pudo copiar el texto al portapapeles" : "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  // Check if any units are not tournament legal
  const hasNonTournamentLegalUnits = selectedUnits.some(unit => unit.tournamentLegal === false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
        >
          <FileText className="h-4 w-4 mr-2" />
          {language === 'es' ? "Exportar a Texto" : "Export to Text"}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-gold/50">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">
            {language === 'es' ? "Exportar Lista del Ejército" : "Export Army List"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {hasNonTournamentLegalUnits && (
            <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-3 flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <p className="text-amber-200 text-sm">
                <strong>Warning:</strong> This list contains units that are not tournament legal.
              </p>
            </div>
          )}
          
          <pre className="whitespace-pre-wrap bg-warcrow-accent p-4 rounded-lg text-warcrow-text font-mono text-sm max-h-[70vh] overflow-y-auto">
            {fullText}
          </pre>
          <Button
            onClick={handleCopy}
            className="mt-4 bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          >
            <Copy className="h-4 w-4 mr-2" />
            {language === 'es' ? "Copiar al Portapapeles" : "Copy to Clipboard"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
