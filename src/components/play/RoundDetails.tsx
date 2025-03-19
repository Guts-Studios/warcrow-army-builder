
import React from 'react';
import { Edit2, ChevronUp, ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { GameState, Player } from '@/types/game';

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
      <Card className="p-6 bg-muted/30">
        <p className="text-center text-muted-foreground">No round data available.</p>
      </Card>
    );
  }

  const getPlayerScore = (playerId: string, roundNumber: number) => {
    const player = gameState.players[playerId];
    return player.roundScores?.[roundNumber] || 0;
  };

  return (
    <Card className="neo-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Round Details</h3>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {rounds.map((roundNumber) => (
          <AccordionItem key={roundNumber} value={`round-${roundNumber}`}>
            <AccordionTrigger className="flex justify-between py-4 px-1">
              <span className="text-lg font-medium">Round {roundNumber}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditRoundScore(roundNumber);
                  }}
                  className="text-sm"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit Scores
                </Button>
                <div className="w-5 h-5 flex items-center justify-center">
                  <ChevronDown className="w-4 h-4 accordion-icon" />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="py-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Player</TableHead>
                      <TableHead>Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{getPlayerScore(player.id, roundNumber)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
};

export default RoundDetails;
