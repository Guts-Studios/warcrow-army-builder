import { ScrollArea } from "@/components/ui/scroll-area";
import { Mission } from "./types";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

const MISSION_IMAGES: Record<string, string> = {
  'Consolidated Progress': '/art/missions/consolidated_progress.jpg',
  'Take Positions': '/art/missions/take_positions.jpg',
  'Fog of Death': '/art/missions/fog_of_death.jpg',
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

// Map dice numbers to components
const DICE_COMPONENTS: Record<string, React.ComponentType<any>> = {
  '[d1]': Dice1,
  '[d2]': Dice2,
  '[d3]': Dice3,
  '[d4]': Dice4,
  '[d5]': Dice5,
  '[d6]': Dice6,
};

interface MissionDetailsProps {
  mission: Mission | null;
  isLoading: boolean;
}

export const MissionDetails = ({ mission, isLoading }: MissionDetailsProps) => {
  if (!mission) {
    return (
      <div className="text-warcrow-text text-center py-8">
        {isLoading ? "Loading mission details..." : "Select a mission to view details"}
      </div>
    );
  }

  const formatText = (text: string) => {
    let formattedText = text;
    
    // First replace dice placeholders with temporary markers
    Object.keys(DICE_COMPONENTS).forEach(diceKey => {
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
        const DiceComponent = DICE_COMPONENTS[`[d${diceMatch[1]}]`];
        return (
          <DiceComponent
            key={index}
            className="inline-block mx-1 text-warcrow-gold"
            size={20}
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
        {mission.title}
      </h2>
      <ScrollArea className="h-[calc(100vh-32rem)] pr-4">
        <div className="text-warcrow-text whitespace-pre-wrap">
          {renderTextWithDice(mission.details)}
        </div>
      </ScrollArea>
      <div className="w-full">
        <img
          src={MISSION_IMAGES[mission.title]}
          alt={`${mission.title} Mission`}
          className="w-full rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};