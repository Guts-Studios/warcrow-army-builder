
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FactionSelector from '@/components/play/FactionSelector';
import ListUploader from '@/components/play/ListUploader';
import { Unit, Faction } from '@/types/game';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlayerInfoProps {
  playerId: string;
  index: number;
}

// Interface for list metadata
interface ListMetadata {
  title?: string;
  faction?: string;
  commandPoints?: string;
  totalPoints?: string;
}

// Interface for player profile data from the database
interface PlayerProfileData {
  username?: string;
  avatar_url?: string;
  favorite_faction?: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ playerId, index }) => {
  const { state, dispatch } = useGame();
  const player = state.players[playerId];
  const [playerName, setPlayerName] = useState(player?.name || '');
  const [playerWabId, setPlayerWabId] = useState(player?.wab_id || '');
  const [listMetadata, setListMetadata] = useState<ListMetadata>({});
  const [isVerifying, setIsVerifying] = useState(false);

  // Handle player name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setPlayerName(name);
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        id: playerId,
        updates: { name }
      }
    });
  };

  // Handle WAB ID change
  const handleWabIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const wab_id = e.target.value;
    setPlayerWabId(wab_id);
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        id: playerId,
        updates: { wab_id }
      }
    });
  };

  // Verify WAB ID
  const verifyWabId = async () => {
    if (!playerWabId) return;
    
    setIsVerifying(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, favorite_faction')
        .eq('wab_id', playerWabId)
        .single();
      
      if (error) {
        toast.error("WAB ID not found");
      } else if (data) {
        // Create a typed updates object
        const updates: Partial<Player> = {
          name: data.username || playerName,
          wab_id: playerWabId,
          verified: true
        };
        
        // If player has a favorite faction, use it
        if (data.favorite_faction) {
          updates.faction = {
            name: data.favorite_faction
          };
        }
        
        // If player has an avatar, use it
        if (data.avatar_url) {
          updates.avatar_url = data.avatar_url;
        }
        
        dispatch({
          type: 'UPDATE_PLAYER',
          payload: {
            id: playerId,
            updates
          }
        });
        
        // Update local state
        setPlayerName(data.username || playerName);
        toast.success("WAB ID verified");
      }
    } catch (err) {
      console.error("Error verifying WAB ID:", err);
      toast.error("Error verifying WAB ID");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle faction selection
  const handleFactionSelect = (faction: Faction) => {
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        id: playerId,
        updates: {
          faction
        }
      }
    });
  };

  // Handle list upload
  const handleListUpload = (
    playerId: string, 
    listContent: string, 
    parsedUnits?: Unit[], 
    metadata?: ListMetadata
  ) => {
    // Update player with list content
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        id: playerId,
        updates: { list: listContent }
      }
    });

    // If we have parsed units, add them to the player and global units array
    if (parsedUnits && parsedUnits.length > 0) {
      dispatch({
        type: 'ADD_PLAYER_UNITS',
        payload: {
          playerId,
          units: parsedUnits
        }
      });
    }

    // Save metadata locally
    if (metadata) {
      setListMetadata(metadata);
    }
  };

  // Get player units if they exist
  const playerUnits = state.units.filter(unit => unit.player === playerId);

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="neo-card p-6 space-y-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-center">
        Player {index + 1}
      </h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`player-name-${index}`}>Player Name</Label>
          <Input
            id={`player-name-${index}`}
            value={playerName}
            onChange={handleNameChange}
            placeholder="Enter player name..."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor={`player-wabid-${index}`}>WAB ID</Label>
          <div className="flex gap-2">
            <Input
              id={`player-wabid-${index}`}
              value={playerWabId}
              onChange={handleWabIdChange}
              placeholder="WAB-XXXX-XXXX-XXXX"
              className="mt-1 flex-1"
            />
            <button
              onClick={verifyWabId}
              disabled={isVerifying || !playerWabId}
              className={`mt-1 px-3 py-2 rounded ${
                player?.verified 
                  ? "bg-green-600 text-white" 
                  : "bg-warcrow-gold text-warcrow-background"
              } disabled:opacity-50`}
            >
              {isVerifying ? "..." : player?.verified ? "✓" : "Verify"}
            </button>
          </div>
          {player?.verified && (
            <p className="text-xs text-green-500 mt-1">ID verified</p>
          )}
        </div>

        <div>
          <Label>Nation (Optional)</Label>
          <div className="mt-1">
            <FactionSelector
              selectedFaction={player?.faction as Faction | null}
              onSelectFaction={handleFactionSelect}
            />
          </div>
        </div>

        <div>
          <Label>Army List (Optional)</Label>
          <div className="mt-1">
            <ListUploader
              playerId={playerId}
              onListUpload={handleListUpload}
              hasUploadedList={!!player?.list}
            />
          </div>
        </div>

        {/* Display list metadata if available */}
        {player?.list && (
          <div className="mt-4 space-y-2">
            {listMetadata.title && (
              <div className="bg-background/50 p-3 rounded-md border text-center">
                <h4 className="font-semibold">{listMetadata.title}</h4>
              </div>
            )}
            
            {/* Show points summary on the same line */}
            {(listMetadata.commandPoints || listMetadata.totalPoints) && (
              <div className="flex justify-between text-sm">
                {listMetadata.commandPoints && (
                  <div className="font-medium">
                    {listMetadata.commandPoints}
                  </div>
                )}
                
                {listMetadata.totalPoints && (
                  <div className="font-medium">
                    {listMetadata.totalPoints}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Display units section with all units */}
        {player?.list && (
          <>
            <Separator className="my-4" />
            <div>
              <Label className="font-medium">Units</Label>
              <div className="mt-2 space-y-2">
                {playerUnits.length > 0 ? (
                  playerUnits.map((unit) => (
                    <Card key={unit.id} className="bg-background/50 border-dashed">
                      <CardContent className="p-3">
                        <div className="text-sm font-medium">{unit.name}</div>
                        {unit.status && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Status: {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic">No units parsed from list</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerInfo;
