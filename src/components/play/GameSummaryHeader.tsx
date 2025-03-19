
import React from 'react';
import { format } from 'date-fns';
import { Player, GameState } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface GameSummaryHeaderProps {
  gameState: GameState;
  winner: Player;
}

const GameSummaryHeader: React.FC<GameSummaryHeaderProps> = ({ gameState, winner }) => {
  const players = Object.values(gameState.players) as Player[];
  const orderedPlayers = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
  
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM dd, yyyy hh:mm a');
  };

  const handleShare = async () => {
    try {
      const shareText = `Game Summary
Mission: ${gameState.mission?.name || gameState.mission?.title || 'Custom Mission'}
Winner: ${winner?.name || 'No winner'} (${typeof winner?.faction === 'object' ? winner?.faction?.name : 'N/A'})
Final Scores: ${orderedPlayers.map(p => `${p.name}: ${p.score} VP`).join(', ')}
`;

      if (navigator.share) {
        await navigator.share({
          title: 'Warcrow Companion Game Summary',
          text: shareText,
        });
        toast.success('Game summary shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Game summary copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing game summary:', error);
      toast.error('Failed to share game summary');
    }
  };

  return (
    <Card className="p-6 border border-border/40 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-center text-primary">Game Summary</h2>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="mr-2 w-4 h-4" />
          Share
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-primary">Mission</h3>
          <p className="text-muted-foreground">{gameState.mission?.name || gameState.mission?.title || 'No mission selected'}</p>
          {gameState.mission?.description && (
            <p className="text-sm text-muted-foreground italic">{gameState.mission.description}</p>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-primary">Winner</h3>
          <p className="text-muted-foreground">
            {winner?.name || 'No winner'} 
            {winner?.score && ` (${winner.score} VP)`}
          </p>
          <p className="text-sm text-muted-foreground">
            {typeof winner?.faction === 'object' 
              ? winner?.faction?.name 
              : (typeof winner?.faction === 'string' ? winner.faction : '')}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-primary">Game Start</h3>
          <p className="text-muted-foreground">
            {gameState.gameStartTime ? formatDate(gameState.gameStartTime) : 'Not available'}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-primary">Game End</h3>
          <p className="text-muted-foreground">
            {gameState.gameEndTime ? formatDate(gameState.gameEndTime) : 'Not available'}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-primary">First to Deploy</h3>
          <p className="text-muted-foreground">
            {gameState.firstToDeployPlayerId 
              ? players.find(p => p.id === gameState.firstToDeployPlayerId)?.name || 'Unknown' 
              : 'Not recorded'}
          </p>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-primary">Initial Initiative</h3>
          <p className="text-muted-foreground">
            {gameState.initialInitiativePlayerId 
              ? players.find(p => p.id === gameState.initialInitiativePlayerId)?.name || 'Unknown' 
              : 'Not recorded'}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default GameSummaryHeader;
