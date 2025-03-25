
import React from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Mission } from '@/types/game';

interface MissionSelectorProps {
  selectedMission?: Mission | null;
  onSelectMission?: (mission: Mission) => void;
}

const MissionSelector: React.FC<MissionSelectorProps> = ({ 
  selectedMission: externalSelectedMission, 
  onSelectMission 
}) => {
  const { state, dispatch } = useGame();
  
  const missions: Mission[] = [
    {
      id: 'take-positions',
      title: 'Take Positions',
      name: 'Take Positions',
      description: 'Control key strategic locations on the battlefield.',
      objective: 'Control objectives',
      details: 'Players compete to control 5 objective markers placed across the battlefield. Points are awarded at the end of each round based on the number of objectives controlled.',
      objectiveDescription: 'Control the most objective markers',
      turnCount: 6,
      roundCount: 3,
      specialRules: ['Objectives are placed before deployment', 'Control is determined by unit proximity'],
      mapImage: '/art/missions/take_positions.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Alpha', value: 1 },
        { id: 'obj2', name: 'Bravo', value: 1 },
        { id: 'obj3', name: 'Charlie', value: 1 },
        { id: 'obj4', name: 'Delta', value: 1 },
        { id: 'obj5', name: 'Echo', value: 1 }
      ]
    },
    {
      id: 'consolidated-progress',
      title: 'Consolidated Progress',
      name: 'Consolidated Progress',
      description: 'Maintain control of your territory while advancing into enemy territory.',
      objective: 'Control objectives in sequence',
      details: 'Players must hold their starting objectives while advancing to capture enemy objectives. Points are awarded for holding objectives in your zone and in the enemy zone.',
      objectiveDescription: 'Hold your objectives and capture enemy objectives',
      turnCount: 5,
      roundCount: 3,
      specialRules: ['Deployment zones determined before placement', 'Objectives must be captured in order'],
      mapImage: '/art/missions/consolidated_progress.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Home Base', value: 1 },
        { id: 'obj2', name: 'Forward Base', value: 2 },
        { id: 'obj3', name: 'Center', value: 3 },
        { id: 'obj4', name: 'Enemy Forward', value: 4 },
        { id: 'obj5', name: 'Enemy Base', value: 5 }
      ]
    },
    {
      id: 'fog-of-death',
      title: 'Fog of Death',
      name: 'Fog of Death',
      description: 'Battle amid an unnatural fog that spreads death and confusion.',
      objective: 'Survive and eliminate',
      details: 'A deadly fog covers the battlefield, moving each round. Players score points for surviving units and eliminating enemy units while avoiding the fog.',
      objectiveDescription: 'Avoid the deadly fog while eliminating enemies',
      turnCount: 4,
      roundCount: 4,
      specialRules: ['Fog movement determined at start of each round', 'Units in fog take damage', 'Limited visibility'],
      mapImage: '/art/missions/fog_of_death.jpg',
      objectiveMarkers: [
        { id: 'obj1', name: 'Safe Zone Alpha', value: 2 },
        { id: 'obj2', name: 'Safe Zone Bravo', value: 2 },
        { id: 'obj3', name: 'Safe Zone Charlie', value: 2 }
      ]
    }
  ];

  const handleMissionSelect = (mission: Mission) => {
    if (onSelectMission) {
      onSelectMission(mission);
    } else {
      dispatch({ type: 'SET_MISSION', payload: mission });
    }
  };

  // Use either the external selected mission (from props) or the one from context
  const activeMissionId = externalSelectedMission?.id || state.mission?.id;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {missions.map((mission) => (
        <Card 
          key={mission.id}
          className={`cursor-pointer transition-all h-full flex flex-col hover:border-warcrow-gold ${
            activeMissionId === mission.id ? 'border-warcrow-gold bg-warcrow-gold/10' : 'border-transparent'
          }`}
          onClick={() => handleMissionSelect(mission)}
        >
          <CardContent className="p-0 flex-1 flex flex-col bg-black/70 rounded-lg overflow-hidden">
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={mission.mapImage || '/placeholder.svg'} 
                alt={mission.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col bg-black/90">
              <h3 className="text-lg font-bold text-warcrow-gold">{mission.title}</h3>
              <p className="text-sm mt-1 text-warcrow-text/80">{mission.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MissionSelector;
