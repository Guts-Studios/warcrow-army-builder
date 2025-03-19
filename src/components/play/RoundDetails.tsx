
import React from 'react';
import { Edit2, Clock, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GameState, Player, GameEvent } from '@/types/game';
import { useIsMobile } from '@/hooks/use-mobile';

interface RoundDetailsProps {
  gameState: GameState;
  players: Player[];
  rounds: number[];
  onEditRoundScore: (roundNumber: number) => void;
}

const RoundDetails: React.FC<RoundDetailsProps> = ({
  gameState,
  players,
  rounds,
  onEditRoundScore
}) => {
  const isMobile = useIsMobile();
  
  // Ensure we always show at least rounds 1-3
  const displayRounds = rounds.length > 0 
    ? [...new Set([...rounds, 1, 2, 3])].sort((a, b) => a - b) 
    : [1, 2, 3];

  const getPlayerScore = (playerId: string, roundNumber: number) => {
    const player = gameState.players[playerId];
    return player.roundScores?.[roundNumber] || 0;
  };

  const getPlayerObjectives = (playerId: string, roundNumber: number) => {
    return gameState.gameEvents.filter(
      event => event.playerId === playerId && 
      event.roundNumber === roundNumber && 
      (event.type === 'objective' || event.type === 'mission')
    );
  };
  
  // Function to check if a player had initiative for a specific round
  const hadInitiative = (playerId: string, roundNumber: number) => {
    return gameState.gameEvents.some(
      event => event.playerId === playerId && 
              event.roundNumber === roundNumber && 
              event.type === 'initiative'
    );
  };

  // Function to check if a player had initial initiative (for round 1)
  const hadInitialInitiative = (playerId: string) => {
    return gameState.initialInitiativePlayerId === playerId;
  };

  return (
    <Card className="p-6 border border-border/40 shadow-sm">
      <div className="flex justify-between items-center mb-4 border-b border-border/20 pb-4">
        <h3 className="text-xl font-semibold text-primary">Round-by-Round Breakdown</h3>
      </div>

      <div className="overflow-x-auto">
        <Table className="round-details-table">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-24 text-primary">Round</TableHead>
              <TableHead className="text-primary">Player</TableHead>
              {!isMobile && <TableHead className="text-primary">Objectives</TableHead>}
              <TableHead className="text-primary">VP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRounds.map((roundNumber) => (
              players.map((player, playerIndex) => {
                const objectives = getPlayerObjectives(player.id || '', roundNumber);
                const roundScore = getPlayerScore(player.id || '', roundNumber);
                const hasInitiative = hadInitiative(player.id || '', roundNumber);
                // Check if this player had initial initiative (only relevant for round 1)
                const hasInitialInitiative = roundNumber === 1 && hadInitialInitiative(player.id || '');
                
                return (
                  <TableRow 
                    key={`${roundNumber}-${player.id}`} 
                    className={playerIndex % 2 === 0 ? 'bg-background' : 'bg-muted/10'}
                    // We can't use style={{ hover: 'none' }} as hover isn't a valid CSS property
                    // Instead we're using the CSS class added to the Table component
                  >
                    {playerIndex === 0 && (
                      <TableCell rowSpan={players.length} className="font-medium align-top border-r border-border/20">
                        <div className="flex flex-col">
                          <div className="flex items-center text-primary">
                            <Clock className="w-4 h-4 mr-2" />
                            Round {roundNumber}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditRoundScore(roundNumber)}
                            className="text-sm text-primary hover:bg-muted hover:text-primary mt-2 justify-start pl-0"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            <span className={isMobile ? "text-xs" : ""}>Edit Round</span>
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-1">
                        {player.name}
                        {(hasInitiative || hasInitialInitiative) && (
                          <Flag className="h-4 w-4 text-primary ml-1" />
                        )}
                      </div>
                      
                      {/* Show objectives below player name on mobile */}
                      {isMobile && objectives.length > 0 && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {objectives.map((objective: GameEvent, idx) => (
                            <div key={objective.id} className="mt-1">
                              {objective.description || objective.objectiveType || 'Unknown'} 
                              {objective.value ? ` (${objective.value} VP)` : ''}
                              {idx < objectives.length - 1 ? ', ' : ''}
                            </div>
                          ))}
                        </div>
                      )}
                    </TableCell>
                    
                    {/* Only show objectives column on desktop */}
                    {!isMobile && (
                      <TableCell className="text-muted-foreground">
                        {objectives.length > 0 ? (
                          <div className="text-sm">
                            {objectives.map((objective: GameEvent, idx) => (
                              <span key={objective.id}>
                                {objective.description || objective.objectiveType || 'Unknown'} 
                                {objective.value ? ` (${objective.value} VP)` : ''}
                                {idx < objectives.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm">No objectives</span>
                        )}
                      </TableCell>
                    )}
                    
                    <TableCell className="text-primary font-medium">{roundScore} VP</TableCell>
                  </TableRow>
                );
              })
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default RoundDetails;
