import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface UnitCardPreviewProps {
  name: string;
  imageUrl?: string;
}

const UnitCardPreview = ({ name, imageUrl }: UnitCardPreviewProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-warcrow-gold hover:text-warcrow-gold/80"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogTitle className="sr-only">{name} Card Image</DialogTitle>
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-auto rounded-lg"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-warcrow-background/50 rounded-lg flex items-center justify-center text-warcrow-muted">
            Card image coming soon
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardPreview;