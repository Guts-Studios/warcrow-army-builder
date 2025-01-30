import { ScrollArea } from "@/components/ui/scroll-area";
import { Mission } from "./types";

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
    HIGHLIGHTED_WORDS.forEach(word => {
      const regex = new RegExp(`(${word})`, 'g');
      formattedText = formattedText.replace(regex, `<span class="font-bold text-[1.125em]">$1</span>`);
    });
    return formattedText;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
        {mission.title}
      </h2>
      <ScrollArea className="h-[calc(100vh-32rem)] pr-4">
        <div 
          className="text-warcrow-text whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: formatText(mission.details) }}
        />
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