
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateShareableLink } from "@/utils/shareListUtils";
import { SavedList } from "@/types/army";
import { toast } from "sonner";
import { Share2, Check, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ShareListButtonProps {
  list: SavedList;
}

const ShareListButton = ({ list }: ShareListButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareableLink = generateShareableLink(list);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors"
          size="sm"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-gold/50">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">Share Army List</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-warcrow-text">
            Share this link with others to let them view your "{list.name}" list without logging in:
          </p>
          
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={shareableLink} 
              readOnly
              className="w-full p-2 bg-black/50 border border-warcrow-gold/30 rounded text-warcrow-gold"
            />
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black transition-colors"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="text-sm text-warcrow-text/70 mt-2">
            Anyone with this link can view your army list without needing to log in. 
            <span className="text-warcrow-gold"> The link is now compressed for easier sharing.</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareListButton;
