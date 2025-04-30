
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mission } from "./types";
import { Badge } from "@/components/ui/badge";

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

// Map dice numbers to image paths
const DICE_IMAGES: Record<string, string> = {
  '[d1]': '/art/dice/d1.png',
  '[d2]': '/art/dice/d2.png',
  '[d3]': '/art/dice/d3.png',
  '[d4]': '/art/dice/d4.png',
  '[d5]': '/art/dice/d5.png',
  '[d6]': '/art/dice/d6.png',
  '[d7]': '/art/dice/d1.png', // Using d1.png for d7 as placeholder
  '[d9]': '/art/dice/d1.png', // Using d1.png for d9 as placeholder
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
    Object.keys(DICE_IMAGES).forEach(diceKey => {
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
    const formattedText = formatText(text);
    const parts = formattedText.split(/(###DICE\[d[1-9]\]###)/g);

    return parts.map((part, index) => {
      const diceMatch = part.match(/###DICE\[d([1-9])\]###/);
      if (diceMatch) {
        const imagePath = DICE_IMAGES[`[d${diceMatch[1]}]`];
        return (
          <img
            key={index}
            src={imagePath}
            alt={`Dice ${diceMatch[1]}`}
            className="inline-block mx-1 h-5 w-5 align-middle"
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
            <img
              src={MISSION_CARD_IMAGES[mission.title]}
              alt={`${mission.title} Mission Card`}
              className="w-full rounded-lg shadow-lg object-contain max-h-[300px]"
            />
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
    </div>
  );
};
