import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SelectedUnit } from "@/types/army";
import { FileText } from "lucide-react";
import { Copy } from "lucide-react";
import { useToast } from "../ui/use-toast";

interface ExportDialogProps {
  selectedUnits: SelectedUnit[];
  listName: string | null;
  faction: string;
}

const ExportDialog = ({ selectedUnits, listName, faction }: ExportDialogProps) => {
  const { toast } = useToast();
  
  const exportText = `${listName ? listName : "Untitled List"}
Faction: ${faction}
Total Points: ${selectedUnits.reduce((total, unit) => total + unit.pointsCost * unit.quantity, 0)}

Units:
${selectedUnits.map(unit => `${unit.quantity}x ${unit.name} (${unit.pointsCost * unit.quantity} pts)`).join('\n')}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      toast({
        title: "Copied to clipboard",
        description: "The army list has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the text manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export to Text
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Export Army List</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <pre className="bg-muted p-4 rounded-md whitespace-pre-wrap break-words max-h-[60vh] overflow-y-auto">
            {exportText}
          </pre>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;