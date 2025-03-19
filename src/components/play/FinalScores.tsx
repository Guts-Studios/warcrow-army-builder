
import React, { useState } from 'react';
import { Player, GameState } from '@/types/game';
import { Button } from '@/components/ui/button';
import { FileText, ListChecks, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface FinalScoresProps {
  players: Player[];
  gameState: GameState;
  onEditRoundScore?: (roundNumber: number) => void;
}

const FinalScores: React.FC<FinalScoresProps> = ({ 
  players, 
  gameState,
  onEditRoundScore 
}) => {
  const orderedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  const [viewingList, setViewingList] = useState<Player | null>(null);
  
  // Get all rounds played
  const getRounds = () => {
    const rounds: number[] = [];
    
    // Add rounds from player scores
    players.forEach(player => {
      if (player.roundScores) {
        Object.keys(player.roundScores).forEach(round => {
          const roundNum = parseInt(round);
          if (!isNaN(roundNum) && !rounds.includes(roundNum)) {
            rounds.push(roundNum);
          }
        });
      }
    });
    
    // Add rounds from game events
    gameState.gameEvents.forEach(event => {
      if (event.roundNumber && !rounds.includes(event.roundNumber)) {
        rounds.push(event.roundNumber);
      }
    });
    
    return rounds.sort((a, b) => a - b);
  };
  
  const rounds = getRounds();
  
  const getPlayerRoundScore = (playerId: string, roundNumber: number) => {
    const player = players.find(p => p.id === playerId);
    return player?.roundScores?.[roundNumber] || 0;
  };
  
  const getPlayerRoundObjectives = (playerId: string, roundNumber: number) => {
    return gameState.gameEvents.filter(
      event => event.playerId === playerId && 
      event.roundNumber === roundNumber && 
      (event.type === 'objective' || event.type === 'mission')
    );
  };

  return (
    <motion.div className="space-y-6">
      <motion.div className="neo-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Final Scores</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <ListChecks className="mr-2 h-4 w-4" />
                View Army Lists
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Army Lists</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] mt-4">
                <Accordion type="single" collapsible className="w-full">
                  {orderedPlayers.map((player) => (
                    player.list && player.id && (
                      <AccordionItem key={player.id} value={player.id}>
                        <AccordionTrigger className="font-medium">
                          {player.name}'s Army - {typeof player.faction === 'object' ? player.faction.name : 'Unknown Faction'}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="bg-muted/50 rounded-md p-4 my-2 overflow-auto max-h-[400px]">
                            <pre className="whitespace-pre-wrap text-sm font-mono">{player.list}</pre>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )
                  ))}
                </Accordion>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableCaption>A summary of the final scores for each player.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Player</TableHead>
              <TableHead>Faction</TableHead>
              <TableHead>Final Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderedPlayers.map((player) => (
              <TableRow key={player.id || player.name}>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell>
                  {typeof player.faction === 'object' 
                    ? player.faction.name 
                    : (typeof player.faction === 'string' ? player.faction : 'N/A')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{player.score}</span>
                    {player.list && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewingList(player)}
                        className="ml-2 flex items-center text-xs"
                      >
                        <FileText className="mr-1 w-3 h-3" />
                        List
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
      
      {rounds.length > 0 && (
        <motion.div className="neo-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Round Scores</h3>
            <Button variant="outline" size="sm">
              <BarChart className="mr-2 h-4 w-4" />
              Score Breakdown
            </Button>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {rounds.map((round) => (
              <AccordionItem key={`round-${round}`} value={`round-${round}`}>
                <AccordionTrigger className="flex justify-between py-4 px-1">
                  <span className="text-lg font-medium">Round {round}</span>
                  {onEditRoundScore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditRoundScore(round);
                      }}
                      className="text-sm"
                    >
                      Edit Scores
                    </Button>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead>Objectives</TableHead>
                        <TableHead>Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderedPlayers.map((player) => {
                        if (!player.id) return null;
                        
                        const objectives = getPlayerRoundObjectives(player.id, round);
                        const roundScore = getPlayerRoundScore(player.id, round);
                        
                        return (
                          <TableRow key={`${player.id}-round-${round}`}>
                            <TableCell>{player.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {objectives.length > 0 ? (
                                  objectives.map((obj) => (
                                    <Badge 
                                      key={obj.id} 
                                      variant="outline"
                                      className="mr-1 mb-1"
                                    >
                                      {obj.description || obj.objectiveType || 'Unknown'}
                                      {obj.value ? ` (${obj.value} VP)` : ''}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-muted-foreground text-sm">No recorded objectives</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{roundScore}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      )}
      
      <Dialog open={!!viewingList} onOpenChange={(open) => !open && setViewingList(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {viewingList?.name}'s Army List - {
                viewingList?.faction 
                  ? (typeof viewingList.faction === 'object' 
                    ? viewingList.faction.name 
                    : viewingList.faction)
                  : 'Unknown Faction'
              }
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] mt-4">
            {viewingList?.list && (
              <div className="bg-muted/50 rounded-md p-4 my-2">
                <pre className="whitespace-pre-wrap text-sm font-mono">{viewingList.list}</pre>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default FinalScores;
