
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mission } from "./types";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { ZoomIn } from "lucide-react";
import { GameSymbol } from "@/components/stats/GameSymbol";

const MISSION_IMAGES: Record<string, string> = {
  'Consolidated Progress': '/art/missions/consolidated_progress.jpg',
  'Take Positions': '/art/missions/take_positions.jpg',
  'Fog of Death': '/art/missions/fog_of_death.jpg',
  'Tree Mother': '/art/missions/tree_mother.jpg', // Main mission image
  'Breached Front': '/art/missions/breached_front.jpg',
  'Battle Lines': '/art/missions/battle_lines.jpg',
};

// Special card images for missions that have them
const MISSION_CARD_IMAGES: Record<string, string> = {
  'Tree Mother': '/art/missions/tree_mother_card.jpg',
};

// Map dice symbols to character codes for the Warcrow font
const DICE_CODES: Record<string, number> = {
  '[d1]': 49, // Character code for "1" in the Warcrow font (star symbol)
  '[d7]': 55, // Character code for "7" in the Warcrow font (shield/defense symbol)
  '[d9]': 57, // Character code for "9" in the Warcrow font (another shield variant)
};

const HIGHLIGHTED_WORDS = [
  'Preparation',
  'Event',
  'Rounds',
  'Scoring',
  'Arcane artefact',
  'Fog effects',
  'End of the game',
  'End of game',
  'Special Rules',
  'The Tree Mother',
  'Event 1: The Tree Mother',
  'Woods',
  'Sÿena sprouts',
  'Destroy a sprout',
  'Return home'
];

interface MissionDetailsProps {
  mission: Mission | null;
  isLoading: boolean;
}

export const MissionDetails = ({ mission, isLoading }: MissionDetailsProps) => {
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);

  if (!mission) {
    return (
      <div className="text-warcrow-text text-center py-8 bg-black/50 rounded-md border border-warcrow-gold/10">
        {isLoading ? "Loading mission details..." : "Select a mission to view details"}
      </div>
    );
  }

  const isCommunityMission = mission.isHomebrew;
  const isOfficialMission = !mission.isHomebrew;
  const hasCardImage = MISSION_CARD_IMAGES[mission.title] !== undefined;

  const formatText = (text: string) => {
    let formattedText = text;
    
    // First replace dice placeholders with temporary markers
    Object.keys(DICE_CODES).forEach(diceKey => {
      const regex = new RegExp(`\\${diceKey}`, 'g');
      formattedText = formattedText.replace(regex, `###DICE${diceKey}###`);
    });

    // Then handle regular highlighted words
    HIGHLIGHTED_WORDS.forEach(word => {
      const regex = new RegExp(`(${word})`, 'g');
      formattedText = formattedText.replace(regex, `<span class="font-bold text-[1.125em]">$1</span>`);
    });

    return formattedText;
  };

  const renderTextWithDice = (text: string) => {
    // Update the "Woods" section with the new text
    let updatedText = text;
    const woodsSectionOld = "Woods\nWoods in the blue deployment zone have the keywords:\nBlock LoS and Cover (7).";
    const woodsSectionNew = "Woods\nWoods in the blue deployment zone have the keywords:\nBlock LoS and Cover (BLK).";
    
    if (updatedText.includes(woodsSectionOld)) {
      updatedText = updatedText.replace(woodsSectionOld, woodsSectionNew);
    }
    
    const formattedText = formatText(updatedText);
    const parts = formattedText.split(/(###DICE\[d[1-9]\]###)/g);

    return parts.map((part, index) => {
      const diceMatch = part.match(/###DICE\[d([1-9])\]###/);
      if (diceMatch) {
        const diceCode = DICE_CODES[`[d${diceMatch[1]}]`];
        return (
          <GameSymbol 
            key={index}
            code={diceCode}
            size="md"
            className="inline-block mx-1"
          />
        );
      }
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: part }}
        />
      );
    });
  };

  return (
    <div className="space-y-6 bg-black/70 p-6 rounded-lg border border-warcrow-gold/20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
          {mission.title}
        </h2>
        <div className="flex gap-2">
          {isOfficialMission && (
            <Badge variant="secondary" className="bg-warcrow-gold/20 text-warcrow-gold border-warcrow-gold/40">
              Official
            </Badge>
          )}
          {isCommunityMission && (
            <Badge variant="outline" className="bg-purple-800/40 text-purple-200 border-purple-600">
              Community
            </Badge>
          )}
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-32rem)] pr-4">
        <div className="text-warcrow-text whitespace-pre-wrap">
          {renderTextWithDice(mission.details)}
        </div>
      </ScrollArea>
      <div className="w-full mt-6">
        {/* Display card image if available */}
        {hasCardImage && (
          <div className="mb-4">
            <button 
              onClick={() => setIsCardDialogOpen(true)}
              className="relative group w-full cursor-pointer"
            >
              <img
                src={MISSION_CARD_IMAGES[mission.title]}
                alt={`${mission.title} Mission Card`}
                className="w-full rounded-lg shadow-lg object-contain max-h-[300px] transition-opacity group-hover:opacity-90"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/70 p-3 rounded-full">
                  <ZoomIn className="h-6 w-6 text-warcrow-gold" />
                </div>
              </div>
            </button>
          </div>
        )}
        {/* Display mission image */}
        <img
          src={MISSION_IMAGES[mission.title]}
          alt={`${mission.title} Mission`}
          className="w-full rounded-lg shadow-lg object-contain max-h-[400px]"
        />
        {isCommunityMission && mission.communityCreator && (
          <div className="mt-2 text-center italic text-purple-300/80 text-sm">
            Mission created by {mission.communityCreator}
          </div>
        )}
      </div>
      
      {/* Dialog for enlarged card image */}
      <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
        <DialogContent className="max-w-4xl p-1 bg-black border-warcrow-gold/30">
          <img
            src={hasCardImage ? MISSION_CARD_IMAGES[mission.title] : ''}
            alt={`${mission.title} Mission Card (Enlarged)`}
            className="w-full object-contain max-h-[80vh]"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
