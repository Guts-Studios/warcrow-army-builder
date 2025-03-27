import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateShareableLink } from "@/utils/shareListUtils";
import { SavedList, SelectedUnit } from "@/types/army";
import { toast } from "sonner";
import { Share2, Check, Copy, Printer, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { factions } from "@/data/factions";

interface ShareExportButtonProps {
  selectedUnits: SelectedUnit[];
  listName: string | null;
  faction: string;
}

const ShareExportButton = ({ selectedUnits, listName, faction }: ShareExportButtonProps) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const tempList: SavedList = {
    id: `temp-${Date.now()}`,
    name: listName || "Untitled List",
    faction: faction,
    units: selectedUnits,
    created_at: new Date().toISOString()
  };
  
  const shareableLink = generateShareableLink(tempList);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopied(true);
      toast.success("Link copied to clipboard");
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error("Failed to copy link");
      console.error("Failed to copy:", err);
    }
  };

  const printList = (courtesyList = false) => {
    const filteredUnits = courtesyList 
      ? selectedUnits.filter(unit => {
          const hasHiddenKeyword = Array.isArray(unit.keywords) && unit.keywords.some(keyword => {
            if (typeof keyword === 'string') {
              return keyword.toLowerCase() === 'scout' || keyword.toLowerCase() === 'ambusher';
            } else if (keyword && typeof keyword === 'object' && 'name' in keyword) {
              const keywordObj = keyword as { name: string };
              return keywordObj.name.toLowerCase() === 'scout' || keywordObj.name.toLowerCase() === 'ambusher';
            }
            return false;
          });
          return !hasHiddenKeyword;
        })
      : selectedUnits;

    const totalPoints = selectedUnits.reduce((sum, unit) => 
      sum + (unit.pointsCost * (unit.quantity || 1)), 0);
    
    const totalCommand = selectedUnits.reduce((sum, unit) => 
      sum + ((unit.command || 0) * (unit.quantity || 1)), 0);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error("Failed to open print window. Check your popup blocker.");
      return;
    }

    const getFactionName = () => {
      const factionData = factions.find(f => f.id === faction);
      return factionData?.name || "Unknown Faction";
    };

    printWindow.document.write(`
      <html>
        <head>
          <title>${courtesyList ? "Courtesy List" : "Full List"} - ${listName || "Untitled List"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1, h2, h3 {
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #333;
            }
            .unit {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              border-bottom: 1px solid #eee;
            }
            .unit-name {
              font-weight: bold;
            }
            .meta {
              color: #666;
              font-style: italic;
            }
            .command {
              color: #8a6d3b;
              margin-left: 5px;
            }
            .totals {
              margin-top: 20px;
              padding-top: 10px;
              border-top: 2px solid #333;
              font-weight: bold;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 0.8em;
              color: #666;
            }
            ${courtesyList ? '.notice { color: #8a6d3b; margin-top: 10px; font-style: italic; }' : ''}
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${listName || "Untitled List"}</h1>
            <p>Faction: ${getFactionName()}</p>
            <p class="meta">Created: ${new Date().toLocaleDateString()}</p>
            ${courtesyList ? '<p class="notice">Courtesy List - Scout and Ambusher units hidden</p>' : ''}
          </div>

          <h2>Units</h2>
          <div class="units">
            ${filteredUnits.map(unit => `
              <div class="unit">
                <div>
                  <span class="unit-name">${unit.name}</span>
                  ${unit.highCommand ? ' [High Command]' : ''}
                  ${unit.command ? `<span class="command">(${unit.command} CP)</span>` : ''}
                  ${unit.quantity > 1 ? ` ×${unit.quantity}` : ''}
                </div>
                <div>${unit.pointsCost * (unit.quantity || 1)} pts</div>
              </div>
            `).join('')}
          </div>

          <div class="totals">
            <div>Command Points: ${totalCommand} CP</div>
            <div>Total Points: ${totalPoints} pts</div>
          </div>

          <div class="footer">
            <p>Printed from Warcrow Army Builder</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.addEventListener('load', () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    });
  };

  const generateExportText = () => {
    const sortedUnits = [...selectedUnits].sort((a, b) => {
      if (a.highCommand && !b.highCommand) return -1;
      if (!a.highCommand && b.highCommand) return 1;
      return 0;
    });
    
    const factionName = factions.find(f => f.id === faction)?.name || "Unknown Faction";

    const listText = `${listName || "Untitled List"}\nFaction: ${factionName}\n\n${sortedUnits
      .map((unit) => {
        const highCommandLabel = unit.highCommand ? " [High Command]" : "";
        const commandPoints = unit.command ? ` (${unit.command} CP)` : "";
        return `${unit.name}${highCommandLabel}${commandPoints} x${unit.quantity} (${unit.pointsCost * unit.quantity} pts)`;
      })
      .join("\n")}`;

    const totalPoints = selectedUnits.reduce(
      (total, unit) => total + unit.pointsCost * unit.quantity,
      0
    );

    const totalCommand = selectedUnits.reduce(
      (total, unit) => total + ((unit.command || 0) * unit.quantity),
      0
    );

    return `${listText}\n\nTotal Command Points: ${totalCommand}\nTotal Points: ${totalPoints}`;
  };

  const exportText = generateExportText();

  const handleCopyExport = async () => {
    try {
      await navigator.clipboard.writeText(exportText);
      toast.success("Army list has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy text to clipboard");
    }
  };

  if (selectedUnits.length === 0 || !listName) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-black border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
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
            Share this link with others to let them view your "{listName}" list without logging in:
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
              className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="text-sm text-warcrow-text/70 mt-2">
            Anyone with this link can view your army list without needing to log in. 
            <span className="text-warcrow-gold"> The link is now compressed for easier sharing.</span>
          </div>

          <div className="border-t border-warcrow-gold/20 pt-4 mt-4">
            <h3 className="text-warcrow-gold font-medium mb-3">Export Options</h3>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button
                  onClick={() => printList(false)} 
                  variant="outline"
                  className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Full List
                </Button>
                <Button
                  onClick={() => printList(true)}
                  variant="outline"
                  className="border-warcrow-gold/30 bg-black text-warcrow-gold hover:bg-warcrow-accent/30 hover:border-warcrow-gold/50"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print Courtesy List
                </Button>
              </div>
              <p className="text-xs text-warcrow-text/70">
                Courtesy List hides units with Scout or Ambusher keywords for tournament play.
              </p>
              
              <div className="border-t border-warcrow-gold/20 pt-4 mt-2">
                <h4 className="text-warcrow-gold font-medium mb-2">Export as Text</h4>
                <pre className="whitespace-pre-wrap bg-warcrow-accent p-4 rounded-lg text-warcrow-text font-mono text-sm max-h-[200px] overflow-y-auto">
                  {exportText}
                </pre>
                <Button
                  onClick={handleCopyExport}
                  className="mt-2 bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareExportButton;
