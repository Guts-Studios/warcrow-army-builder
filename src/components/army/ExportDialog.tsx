import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { SelectedUnit } from "@/types/army";

interface ExportDialogProps {
  selectedUnits: SelectedUnit[];
  listName: string | null;
}

const ExportDialog = ({ selectedUnits, listName }: ExportDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const listText = `${listName || "Untitled List"}\n\n${selectedUnits
    .map((unit) => `${unit.name} x${unit.quantity} (${unit.pointsCost * unit.quantity} pts)`)
    .join("\n")}`;

  const totalPoints = selectedUnits.reduce(
    (total, unit) => total + unit.pointsCost * unit.quantity,
    0
  );

  const fullText = `${listText}\n\nTotal Points: ${totalPoints}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullText);
      toast({
        title: "Copied to clipboard",
        description: "Army list has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export to Text
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-accent">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">Export Army List</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <pre className="whitespace-pre-wrap bg-warcrow-accent p-4 rounded-lg text-warcrow-text font-mono text-sm">
            {fullText}
          </pre>
          <Button
            onClick={handleCopy}
            className="mt-4 bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy to Clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;