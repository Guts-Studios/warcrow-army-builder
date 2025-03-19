
import React from 'react';
import { Edit2, Clock } from 'lucide-react';
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

  return (
    <Card className="neo-card p-6 bg-gradient-to-br from-muted/50 to-background border border-border/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-primary">Round-by-Round Breakdown</h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-24">Round</TableHead>
              <TableHead>Player</TableHead>
              {!isMobile && <TableHead>Objectives</TableHead>}
              <TableHead>VP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayRounds.map((roundNumber) => (
              players.map((player, playerIndex) => {
                const objectives = getPlayerObjectives(player.id || '', roundNumber);
                const roundScore = getPlayerScore(player.id || '', roundNumber);
                return (
                  <TableRow key={`${roundNumber}-${player.id}`} className={playerIndex % 2 === 0 ? 'bg-muted/10' : ''}>
                    {playerIndex === 0 && (
                      <TableCell rowSpan={players.length} className="font-medium align-top border-r border-border/30">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            Round {roundNumber}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditRoundScore(roundNumber)}
                            className="text-sm text-primary hover:text-primary/80 mt-2 justify-start pl-0"
                          >
                            <Edit2 className="w-4 h-4 mr-1" />
                            <span className={isMobile ? "text-xs" : ""}>Edit Round</span>
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="font-medium">
                      {player.name}
                      
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
                      <TableCell>
                        {objectives.length > 0 ? (
                          <div className="text-sm text-muted-foreground">
                            {objectives.map((objective: GameEvent, idx) => (
                              <span key={objective.id}>
                                {objective.description || objective.objectiveType || 'Unknown'} 
                                {objective.value ? ` (${objective.value} VP)` : ''}
                                {idx < objectives.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No objectives</span>
                        )}
                      </TableCell>
                    )}
                    
                    <TableCell className="text-xs font-normal">{roundScore} VP</TableCell>
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
