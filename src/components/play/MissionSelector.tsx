
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scroll, Info } from 'lucide-react';
import { Mission } from '@/types/game';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Mission definitions
const missions: Mission[] = [
  {
    id: 'consolidated-progress',
    title: 'Consolidated Progress',
    details: 'Control strategic objectives across the battlefield, especially in your opponent\'s territory.',
    name: 'Consolidated Progress',
    description: 'Control strategic objectives across the battlefield, especially in your opponent\'s territory.',
    objectiveDescription: 'Score 1 VP for controlling the central objective, 1 VP for opponent\'s objective (1), 2 VPs for opponent\'s objective (2), and 1 VP if opponent controls neither of your objectives (1 and 2).',
    turnCount: 5,
    roundCount: 3,
    specialRules: [
      'Place 5 objective markers as shown in the diagram: central objective and two objectives for each player.',
      'Each round lasts for 5 turns.',
      'The game ends at the end of round 3 or when one of the companies has no units left on the battlefield.'
    ],
    mapImage: 'public/art/missions/consolidated_progress.jpg',
    objectiveMarkers: [
      { id: 'central', name: 'Central', color: '#9b87f5', controlledBy: null },
      { id: 'player1-1', name: 'Player 1 (1)', color: '#0EA5E9', controlledBy: null },
      { id: 'player1-2', name: 'Player 1 (2)', color: '#33C3F0', controlledBy: null },
      { id: 'player2-1', name: 'Player 2 (1)', color: '#ea384c', controlledBy: null },
      { id: 'player2-2', name: 'Player 2 (2)', color: '#D946EF', controlledBy: null }
    ]
  },
  {
    id: 'take-positions',
    title: 'Take Positions',
    details: 'Control objectives of your opponent\'s color while defending your own.',
    name: 'Take Positions',
    description: 'Control objectives of your opponent\'s color while defending your own.',
    objectiveDescription: 'Score 1 VP for each objective you control with your opponent\'s color, and 1 VP if your opponent doesn\'t control any of the objectives of your color.',
    turnCount: 5,
    roundCount: 3,
    specialRules: [
      'Place 4 objective markers on the battlefield with the player colors shown in the diagram.',
      'Each round lasts for 5 turns.',
      'The game ends at the end of round 3 or when one of the companies has no units left on the battlefield.'
    ],
    mapImage: 'public/art/missions/take_positions.jpg',
    objectiveMarkers: [
      { id: 'player1-1', name: 'Player 1 (1)', color: '#0EA5E9', controlledBy: null },
      { id: 'player1-2', name: 'Player 1 (2)', color: '#33C3F0', controlledBy: null },
      { id: 'player2-1', name: 'Player 2 (1)', color: '#ea384c', controlledBy: null },
      { id: 'player2-2', name: 'Player 2 (2)', color: '#D946EF', controlledBy: null }
    ]
  },
  {
    id: 'fog-of-death',
    title: 'Fog of Death',
    details: 'Control an ancient arcane artifact that can manipulate the fog surrounding your companies.',
    name: 'Fog of Death',
    description: 'Control an ancient arcane artifact that can manipulate the fog surrounding your companies.',
    objectiveDescription: 'Score 1 VP when you control the artifact and a Fog marker contacts the conquest marker. Score 2 VPs at the end of each round if you control the artifact.',
    turnCount: 4,
    roundCount: 3,
    specialRules: [
      'Place an objective marker in the center of the battlefield (represents an arcane artifact).',
      'The first player to deploy places a conquest marker adjacent to the objective marker, showing their color.',
      'Place four Fog markers in each corner of the battlefield.',
      'Place an event token on position 3 of the turn counter.',
      'When the event is activated: displace all Fog markers 10 strides toward the conquest marker.',
      'All units within 8 strides of any Fog marker must resolve a "Fog Effects" roll for each nearby Fog marker.',
      'At the end of each turn, whoever controls the artifact can move the conquest marker 2 strides in any direction.',
      'Units within 3 strides of the artifact can take a WP test to move the conquest marker 5 strides per Success.'
    ],
    mapImage: 'public/art/missions/fog_of_death.jpg',
    objectiveMarkers: [
      { id: 'artifact', name: 'Arcane Artifact', color: '#9b87f5', controlledBy: null },
      { id: 'fog-1', name: 'Fog Marker 1', color: '#94a3b8', controlledBy: null },
      { id: 'fog-2', name: 'Fog Marker 2', color: '#94a3b8', controlledBy: null },
      { id: 'fog-3', name: 'Fog Marker 3', color: '#94a3b8', controlledBy: null },
      { id: 'fog-4', name: 'Fog Marker 4', color: '#94a3b8', controlledBy: null },
      { id: 'conquest', name: 'Conquest Marker', color: '#f59e0b', controlledBy: null }
    ]
  }
];

interface MissionSelectorProps {
  selectedMission: Mission | null;
  onSelectMission: (mission: Mission) => void;
}

const MissionSelector: React.FC<MissionSelectorProps> = ({ 
  selectedMission, 
  onSelectMission 
}) => {
  const [detailsMission, setDetailsMission] = useState<Mission | null>(null);

  return (
    <>
      <motion.div 
        className="space-y-4 w-full"
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 gap-3">
          {missions.map((mission) => (
            <motion.div
              key={mission.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "neo-card p-4 flex flex-col gap-2 cursor-pointer",
                selectedMission?.id === mission.id ? "ring-2 ring-primary/50" : "hover:bg-secondary/50"
              )}
              onClick={() => onSelectMission(mission)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{mission.name}</h3>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailsMission(mission);
                    }}
                    className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                  >
                    <Info className="w-4 h-4 text-secondary-foreground" />
                  </motion.button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{mission.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Scroll className="w-3.5 h-3.5" />
                  <span>{mission.turnCount} Turns</span>
                </div>
                <button 
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    selectedMission?.id === mission.id 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                  )}
                >
                  {selectedMission?.id === mission.id ? "Selected" : "Select"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Dialog open={!!detailsMission} onOpenChange={(open) => !open && setDetailsMission(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{detailsMission?.name}</DialogTitle>
            <DialogDescription>
              {detailsMission?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">Objectives</h4>
              <p className="text-sm">{detailsMission?.objectiveDescription}</p>
            </div>
            {detailsMission?.mapImage && (
              <div>
                <h4 className="font-medium mb-1">Battlefield Map</h4>
                <div className="border border-border rounded-md overflow-hidden">
                  <AspectRatio ratio={1/1}>
                    <img 
                      src={detailsMission.mapImage} 
                      alt={`${detailsMission.name} map`} 
                      className="w-full object-cover"
                    />
                  </AspectRatio>
                </div>
              </div>
            )}
            {detailsMission?.specialRules && detailsMission.specialRules.length > 0 && (
              <div>
                <h4 className="font-medium mb-1">Special Rules</h4>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {detailsMission.specialRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (detailsMission) {
                    onSelectMission(detailsMission);
                    setDetailsMission(null);
                  }
                }}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md font-medium"
              >
                Select This Mission
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MissionSelector;
