
import React from 'react';
import { motion } from 'framer-motion';
import { Player, Photo, Turn } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Camera, Edit } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';

interface RoundDetailsProps {
  gameState: any;
  players: Player[];
  rounds: number[];
  onViewPhoto: (photo: Photo) => void;
  onEditRoundScore: (roundNumber: number) => void;
}

const RoundDetails: React.FC<RoundDetailsProps> = ({ 
  gameState, 
  players, 
  rounds, 
  onViewPhoto, 
  onEditRoundScore 
}) => {
  const isMobile = useIsMobile();
  
  const getInitiativePlayer = (roundNumber: number): Player | undefined => {
    if (roundNumber === 1 && gameState.initialInitiativePlayerId) {
      return players.find(player => player.id === gameState.initialInitiativePlayerId);
    }
    
    const initiativeEvent = gameState.gameEvents?.find(
      (event: any) => 
        event.type === 'initiative' && 
        event.roundNumber === roundNumber
    );
    
    if (initiativeEvent?.playerId) {
      return players.find(player => player.id === initiativeEvent.playerId);
    }
    
    return undefined;
  };

  const getRoundObjectives = (playerId: string, roundNumber: number): React.ReactNode => {
    const roundEvents = gameState.gameEvents?.filter(
      (event: any) => 
        event.type === 'objective' && 
        event.playerId === playerId &&
        Math.ceil(event.turnNumber / 2) === roundNumber
    ) || [];
    
    const missionEvents = gameState.gameEvents?.filter(
      (event: any) => 
        event.type === 'mission' && 
        event.playerId === playerId &&
        event.roundNumber === roundNumber
    ) || [];
    
    if (roundEvents.length === 0 && missionEvents.length === 0) {
      return <span className="text-muted-foreground text-xs">No objectives</span>;
    }
    
    return (
      <ul className={`${isMobile ? 'pl-2' : 'pl-4'} space-y-0.5 text-xs`}>
        {missionEvents.map((event: any, idx: number) => {
          let objectiveText = event.description;
          
          if (isMobile) {
            if (event.objectiveType === 'central') {
              objectiveText = 'Central (1)';
            } else if (event.objectiveType === 'opponent1') {
              objectiveText = 'Opp 1 (1)';
            } else if (event.objectiveType === 'opponent2') {
              objectiveText = 'Opp 2 (2)';
            } else if (event.objectiveType === 'defendObjectives') {
              objectiveText = 'Defend (1)';
            }
          } else {
            if (event.objectiveType === 'central') {
              objectiveText = 'Control central objective (1 VP)';
            } else if (event.objectiveType === 'opponent1') {
              objectiveText = 'Control opponent\'s objective 1 (1 VP)';
            } else if (event.objectiveType === 'opponent2') {
              objectiveText = 'Control opponent\'s objective 2 (2 VP)';
            } else if (event.objectiveType === 'defendObjectives') {
              objectiveText = 'Opponent controls neither of your objectives (1 VP)';
            }
          }
          
          return (
            <li key={`mission-${event.id || idx}`} className="text-2xs sm:text-xs">
              {objectiveText}
            </li>
          );
        })}
        
        {roundEvents.map((event: any, idx: number) => (
          <li key={`event-${event.id || idx}`} className="text-2xs sm:text-xs">
            {event.description?.substring(0, isMobile ? 15 : 50)}{event.description?.length > (isMobile ? 15 : 50) ? '...' : ''}: {event.value || 0} VP
          </li>
        ))}
      </ul>
    );
  };

  const getRoundPhotos = (roundNumber: number): Photo[] => {
    return (gameState.turns || [])
      .filter((turn: Turn) => Math.ceil(turn.number / 2) === roundNumber)
      .flatMap((turn: Turn) => turn.photos || []);
  };

  const renderInitiativeTable = () => (
    <div className="overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className={isMobile ? "w-14 text-xs" : ""}>Initiative</TableHead>
            {rounds.map((roundNumber) => (
              <TableHead key={`initiative-round-${roundNumber}`} className="text-center text-xs sm:text-sm">
                {isMobile ? `R${roundNumber}` : `Round ${roundNumber}`}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-xs sm:text-sm">Player</TableCell>
            {rounds.map((roundNumber) => {
              const initiativePlayer = getInitiativePlayer(roundNumber);
              return (
                <TableCell 
                  key={`initiative-player-${roundNumber}`} 
                  className="text-center font-medium text-xs sm:text-sm"
                >
                  {initiativePlayer ? (
                    isMobile 
                      ? initiativePlayer.name.substring(0, 4) + (initiativePlayer.name.length > 4 ? '..' : '')
                      : initiativePlayer.name
                  ) : 'N/A'}
                </TableCell>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );

  const renderScoresTable = () => (
    <div className="overflow-x-auto">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className={isMobile ? "w-14 text-2xs sm:text-xs p-1" : "text-xs"}>Player</TableHead>
            {rounds.map((roundNumber) => (
              <TableHead key={`score-round-${roundNumber}`} className="text-center text-2xs sm:text-xs p-1 sm:p-3">
                {isMobile ? `R${roundNumber}` : `Round ${roundNumber}`}
              </TableHead>
            ))}
            <TableHead className="text-center text-2xs sm:text-xs p-1 sm:p-3">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={`scores-${player.id}`}>
              <TableCell className="font-medium p-1 sm:p-3 text-2xs sm:text-xs">
                {isMobile 
                  ? player.name.substring(0, 4) + (player.name.length > 4 ? '..' : '')
                  : player.name}
              </TableCell>
              {rounds.map((roundNumber) => {
                const roundScore = player.roundScores?.[roundNumber] || 0;
                return (
                  <TableCell 
                    key={`score-${player.id}-${roundNumber}`} 
                    className="text-center p-1 sm:p-3"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-2xs sm:text-xs">{roundScore} VP</span>
                      <div className="mt-0.5 text-2xs">
                        {getRoundObjectives(player.id || '', roundNumber)}
                      </div>
                    </div>
                  </TableCell>
                );
              })}
              <TableCell className="text-center font-bold p-1 sm:p-3 text-2xs sm:text-sm">
                {player.score} VP
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderRoundActions = () => (
    <div className={`grid ${isMobile ? 'grid-cols-3 gap-1' : 'grid-cols-1 md:grid-cols-3 gap-4'} mt-4`}>
      {rounds.map((roundNumber) => {
        const photos = getRoundPhotos(roundNumber);
        return (
          <div 
            key={`round-actions-${roundNumber}`}
            className="flex flex-col p-2 border rounded-lg"
          >
            <h4 className="font-medium mb-1 text-center text-xs">
              {isMobile ? `R${roundNumber}` : `Round ${roundNumber}`}
            </h4>
            <div className="flex flex-col gap-1">
              {photos.length > 0 ? (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => onViewPhoto(photos[0])}
                  className="w-full text-2xs sm:text-xs py-1 h-7"
                >
                  <Camera className="mr-1 w-3 h-3" />
                  {isMobile ? 'Photo' : 'View Photo'}
                </Button>
              ) : (
                <p className="text-2xs text-muted-foreground text-center">No photo</p>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEditRoundScore(roundNumber)}
                className="w-full text-2xs sm:text-xs py-1 h-7"
              >
                <Edit className="mr-1 w-3 h-3" />
                {isMobile ? 'Edit' : 'Edit Scores'}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <motion.div className="neo-card p-4 sm:p-6">
      <h3 className="text-xl font-semibold mb-4">Round Scores</h3>
      
      {rounds.length === 0 ? (
        <p className="text-muted-foreground">No rounds completed.</p>
      ) : (
        <div className="space-y-3 sm:space-y-5">
          {renderInitiativeTable()}
          {renderScoresTable()}
          {renderRoundActions()}
        </div>
      )}
    </motion.div>
  );
};

export default RoundDetails;
