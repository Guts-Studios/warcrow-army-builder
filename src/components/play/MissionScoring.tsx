
import React from 'react';
import { Target, Shield, Cloud, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Mission, Player } from '@/types/game';

interface MissionScoringProps {
  mission: Mission | null;
  players: Record<string, Player>;
  missionScoring: Record<string, Record<string, boolean>>;
  currentRound: number;
  toggleScoringCondition: (playerId: string, condition: string) => void;
  calculateVP: (playerId: string) => number;
  scoredFogMarkers?: Record<string, boolean>;
}

const MissionScoring: React.FC<MissionScoringProps> = ({
  mission,
  players,
  missionScoring,
  currentRound,
  toggleScoringCondition,
  calculateVP,
  scoredFogMarkers = {}
}) => {
  if (!mission) return null;

  if (mission.id === 'consolidated-progress') {
    return (
      <>
        <div className="text-sm font-medium mb-2 flex items-center">
          <Target className="w-4 h-4 mr-1.5 text-muted-foreground" />
          Mission: Consolidated Progress
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {Object.entries(players).map(([playerId, player]) => (
            <div key={playerId} className="p-3 border rounded-lg bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Current VP: {player.score || 0}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${playerId}-central`} 
                    checked={missionScoring[playerId]?.central}
                    onCheckedChange={() => toggleScoringCondition(playerId, 'central')}
                  />
                  <Label 
                    htmlFor={`${playerId}-central`}
                    className="text-sm flex items-center gap-1"
                  >
                    <img src="/art/icons/flag.png" alt="Flag" className="h-3.5 w-3.5" />
                    Control central objective (1 VP)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${playerId}-opponent1`} 
                    checked={missionScoring[playerId]?.opponent1}
                    onCheckedChange={() => toggleScoringCondition(playerId, 'opponent1')}
                    disabled={Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives}
                  />
                  <Label 
                    htmlFor={`${playerId}-opponent1`}
                    className={cn(
                      "text-sm flex items-center gap-1",
                      Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives
                        ? "text-muted-foreground" : ""
                    )}
                  >
                    <img src="/art/icons/orange-flag.png" alt="Orange Flag" className="h-3.5 w-3.5" />
                    Control opponent's objective 1 (1 VP)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${playerId}-opponent2`} 
                    checked={missionScoring[playerId]?.opponent2}
                    onCheckedChange={() => toggleScoringCondition(playerId, 'opponent2')}
                    disabled={Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives}
                  />
                  <Label 
                    htmlFor={`${playerId}-opponent2`}
                    className={cn(
                      "text-sm flex items-center gap-1",
                      Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives
                        ? "text-muted-foreground" : ""
                    )}
                  >
                    <img src="/art/icons/red-flag.png" alt="Red Flag" className="h-3.5 w-3.5" />
                    Control opponent's objective 2 (2 VP)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${playerId}-defend`} 
                    checked={missionScoring[playerId]?.defendObjectives}
                    onCheckedChange={() => toggleScoringCondition(playerId, 'defendObjectives')}
                    disabled={
                      Object.keys(players).find(id => id !== playerId) && (
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent1 ||
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent2
                      )
                    }
                  />
                  <Label 
                    htmlFor={`${playerId}-defend`}
                    className={cn(
                      "text-sm flex items-center gap-1",
                      Object.keys(players).find(id => id !== playerId) && (
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent1 ||
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent2
                      ) ? "text-muted-foreground" : ""
                    )}
                  >
                    <Shield className="h-3.5 w-3.5 text-blue-500" />
                    Opponent controls neither of your objectives (1 VP)
                  </Label>
                </div>
                
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Round {currentRound} VP:</div>
                    <div className="text-lg font-bold text-primary">
                      {calculateVP(playerId)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } else if (mission.id === 'take-positions') {
    return (
      <>
        <div className="text-sm font-medium mb-2 flex items-center">
          <Target className="w-4 h-4 mr-1.5 text-muted-foreground" />
          Mission: Take Positions
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {Object.entries(players).map(([playerId, player]) => (
            <div key={playerId} className="p-3 border rounded-lg bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Current VP: {player.score || 0}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${playerId}-opponent1`} 
                    checked={missionScoring[playerId]?.opponent1}
                    onCheckedChange={() => toggleScoringCondition(playerId, 'opponent1')}
                    disabled={Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives}
                  />
                  <Label 
                    htmlFor={`${playerId}-opponent1`}
                    className={cn(
                      "text-sm flex items-center gap-1",
                      Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives
                        ? "text-muted-foreground" : ""
                    )}
                  >
                    <img src="/art/icons/orange-flag.png" alt="Orange Flag" className="h-3.5 w-3.5" />
                    Control opponent's objective 1 (1 VP)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${playerId}-opponent2`} 
                    checked={missionScoring[playerId]?.opponent2}
                    onCheckedChange={() => toggleScoringCondition(playerId, 'opponent2')}
                    disabled={Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives}
                  />
                  <Label 
                    htmlFor={`${playerId}-opponent2`}
                    className={cn(
                      "text-sm flex items-center gap-1",
                      Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.defendObjectives
                        ? "text-muted-foreground" : ""
                    )}
                  >
                    <img src="/art/icons/red-flag.png" alt="Red Flag" className="h-3.5 w-3.5" />
                    Control opponent's objective 2 (1 VP)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id={`${playerId}-defend`} 
                    checked={missionScoring[playerId]?.defendObjectives}
                    onCheckedChange={() => toggleScoringCondition(playerId, 'defendObjectives')}
                    disabled={
                      Object.keys(players).find(id => id !== playerId) && (
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent1 ||
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent2
                      )
                    }
                  />
                  <Label 
                    htmlFor={`${playerId}-defend`}
                    className={cn(
                      "text-sm flex items-center gap-1",
                      Object.keys(players).find(id => id !== playerId) && (
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent1 ||
                        missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.opponent2
                      ) ? "text-muted-foreground" : ""
                    )}
                  >
                    <Shield className="h-3.5 w-3.5 text-blue-500" />
                    Opponent controls neither of your objectives (1 VP)
                  </Label>
                </div>
                
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Round {currentRound} VP:</div>
                    <div className="text-lg font-bold text-primary">
                      {calculateVP(playerId)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  } else if (mission.id === 'fog-of-death') {
    const availableFogMarkers = [
      { id: 'fogContact1', label: 'Fog Marker 1', available: !scoredFogMarkers.fogContact1 },
      { id: 'fogContact2', label: 'Fog Marker 2', available: !scoredFogMarkers.fogContact2 },
      { id: 'fogContact3', label: 'Fog Marker 3', available: !scoredFogMarkers.fogContact3 },
      { id: 'fogContact4', label: 'Fog Marker 4', available: !scoredFogMarkers.fogContact4 }
    ];
    
    const remainingMarkers = availableFogMarkers.filter(marker => marker.available).length;
    
    return (
      <>
        <div className="text-sm font-medium mb-2 flex items-center">
          <Target className="w-4 h-4 mr-1.5 text-muted-foreground" />
          Mission: Fog of Death
        </div>
        <div className="bg-muted/30 p-2 rounded-md mb-3 text-xs flex items-center">
          <Cloud className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <span>
            {remainingMarkers} fog marker{remainingMarkers !== 1 ? 's' : ''} remaining 
            {scoredFogMarkers.fogContact1 || scoredFogMarkers.fogContact2 || 
             scoredFogMarkers.fogContact3 || scoredFogMarkers.fogContact4 ? 
              ' (used markers cannot be scored again)' : ''}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {Object.entries(players).map(([playerId, player]) => (
            <div key={playerId} className="p-3 border rounded-lg bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-medium">{player.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Current VP: {player.score || 0}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mt-2">
                <div className="text-xs font-medium mb-1 text-muted-foreground">
                  Fog Marker Contact with Conquest Marker (1 VP each):
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {availableFogMarkers.map(marker => (
                    marker.available && missionScoring[playerId]?.[marker.id] !== undefined ? (
                      <div key={marker.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${playerId}-${marker.id}`} 
                          checked={missionScoring[playerId]?.[marker.id] || false}
                          onCheckedChange={() => toggleScoringCondition(playerId, marker.id)}
                        />
                        <Label 
                          htmlFor={`${playerId}-${marker.id}`}
                          className="text-sm"
                        >
                          {marker.label}
                        </Label>
                      </div>
                    ) : null
                  ))}
                </div>
                
                {remainingMarkers === 0 && (
                  <div className="text-xs text-muted-foreground mt-1 italic">
                    All fog markers have been used in previous rounds.
                  </div>
                )}
                
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox 
                    id={`${playerId}-control-artifact`} 
                    checked={missionScoring[playerId]?.controlArtifact || false}
                    onCheckedChange={() => toggleScoringCondition(playerId, 'controlArtifact')}
                    disabled={Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.controlArtifact}
                  />
                  <Label 
                    htmlFor={`${playerId}-control-artifact`}
                    className={cn(
                      "text-sm flex items-center gap-1",
                      Object.keys(players).find(id => id !== playerId) && 
                      missionScoring[Object.keys(players).find(id => id !== playerId) || '']?.controlArtifact
                        ? "text-muted-foreground" : ""
                    )}
                  >
                    <Target className="h-3.5 w-3.5 text-purple-500" />
                    Control artifact at end of round (2 VP)
                  </Label>
                </div>
                
                <div className="mt-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Round {currentRound} VP:</div>
                    <div className="text-lg font-bold text-primary">
                      {calculateVP(playerId)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  
  return null;
};

export default MissionScoring;
