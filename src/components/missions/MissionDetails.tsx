
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mission } from "./types";

const MISSION_IMAGES: Record<string, string> = {
  'Consolidated Progress': '/art/missions/consolidated_progress.jpg',
  'Take Positions': '/art/missions/take_positions.jpg',
  'Fog of Death': '/art/missions/fog_of_death.jpg',
  'Breached Front': '/art/missions/take_positions.jpg', // Using existing image for now
};

// Map dice numbers to image paths
const DICE_IMAGES: Record<string, string> = {
  '[d1]': '/art/dice/d1.png',
  '[d2]': '/art/dice/d2.png',
  '[d3]': '/art/dice/d3.png',
  '[d4]': '/art/dice/d4.png',
  '[d5]': '/art/dice/d5.png',
  '[d6]': '/art/dice/d6.png',
};

const HIGHLIGHTED_WORDS = [
  'Preparation',
  'Event',
  'Rounds',
  'Scoring',
  'Arcane artefact',
  'Fog effects',
  'End of the game'
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
    const parts = formattedText.split(/(###DICE\[d[1-6]\]###)/g);

    return parts.map((part, index) => {
      const diceMatch = part.match(/###DICE\[d([1-6])\]###/);
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
        {isCommunityMission && (
          <span className="px-2 py-1 text-xs bg-purple-800/40 text-purple-200 rounded-md border border-purple-600">
            Community Created
          </span>
        )}
      </div>
      <ScrollArea className="h-[calc(100vh-32rem)] pr-4">
        <div className="text-warcrow-text whitespace-pre-wrap">
          {renderTextWithDice(mission.details)}
        </div>
      </ScrollArea>
      <div className="w-full mt-6">
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
