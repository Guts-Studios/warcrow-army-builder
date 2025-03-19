
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
import { Badge } from "@/components/ui/badge";
import { GameState, Player, GameEvent } from '@/types/game';

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
  if (rounds.length === 0) {
    return (
      <Card className="neo-card p-6 bg-muted/30">
        <p className="text-center text-muted-foreground">No round data available.</p>
      </Card>
    );
  }

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
    <Card className="neo-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Round-by-Round Breakdown</h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Round</TableHead>
              <TableHead>Player</TableHead>
              <TableHead>Objectives</TableHead>
              <TableHead className="text-right">VP</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rounds.map((roundNumber) => (
              players.map((player) => {
                const objectives = getPlayerObjectives(player.id || '', roundNumber);
                return (
                  <TableRow key={`${roundNumber}-${player.id}`}>
                    {players.indexOf(player) === 0 && (
                      <TableCell rowSpan={players.length} className="font-medium align-top border-r border-border/30">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-primary" />
                          Round {roundNumber}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>{player.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {objectives.length > 0 ? (
                          objectives.map((objective: GameEvent) => (
                            <Badge 
                              key={objective.id} 
                              variant="outline" 
                              className="mr-1 mb-1"
                            >
                              {objective.description || objective.objectiveType || 'Unknown'} 
                              {objective.value ? ` (${objective.value} VP)` : ''}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">No objectives</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{getPlayerScore(player.id || '', roundNumber)}</TableCell>
                    {players.indexOf(player) === 0 && (
                      <TableCell rowSpan={players.length} className="align-top text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditRoundScore(roundNumber)}
                          className="text-sm"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    )}
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
