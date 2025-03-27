
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, RefreshCw, Share2 } from 'lucide-react';
import { formatJoinCode, generateJoinCode, saveJoinCode } from '@/utils/joinCodeUtils';
import { toast } from 'sonner';

interface JoinCodeShareProps {
  gameId: string;
  isOpen: boolean;
  onClose: () => void;
}

const JoinCodeShare: React.FC<JoinCodeShareProps> = ({ gameId, isOpen, onClose }) => {
  const [joinCode, setJoinCode] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen && !joinCode) {
      generateNewCode();
    }
  }, [isOpen]);

  const generateNewCode = async () => {
    setIsGenerating(true);
    const newCode = generateJoinCode();
    
    try {
      console.log("Generating new join code for game:", gameId);
      const success = await saveJoinCode(gameId, newCode);
      if (success) {
        setJoinCode(newCode);
        console.log("Successfully generated join code:", newCode);
      } else {
        toast.error("Failed to generate join code. Please try again.");
      }
    } catch (err) {
      console.error("Error generating join code:", err);
      toast.error("An error occurred while generating the join code");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatJoinCode(joinCode))
      .then(() => toast.success("Join code copied to clipboard"))
      .catch(() => toast.error("Failed to copy join code"));
  };

  const shareJoinCode = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join my Warcrow game',
          text: `Join my Warcrow game with code: ${formatJoinCode(joinCode)}`,
        });
      } else {
        copyToClipboard();
      }
    } catch (err) {
      console.error('Error sharing:', err);
      copyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-warcrow-background border-warcrow-gold/30">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">Invite Player to Join</DialogTitle>
          <DialogDescription className="text-warcrow-text/90">
            Share this code with your opponent to let them join the game.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="join-code" className="text-warcrow-text">Join Code</Label>
            <div className="flex gap-2">
              <Input
                id="join-code"
                value={formatJoinCode(joinCode)}
                readOnly
                className="text-center text-lg font-mono tracking-widest bg-black/30 border-warcrow-gold/50 text-warcrow-gold"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
                className="flex-shrink-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-center text-sm text-warcrow-text/70">
            This code will expire in 24 hours
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={generateNewCode}
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Code
          </Button>
          <Button
            className="w-full sm:w-auto bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/80"
            onClick={shareJoinCode}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Code
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCodeShare;
