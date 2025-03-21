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
import { Unit, Faction, Player } from '@/types/game';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { SavedList, SelectedUnit } from '@/types/army';
import { fetchListsByWabId } from '@/utils/profileUtils';

interface PlayerInfoProps {
  playerId: string;
  index: number;
}

interface ListMetadata {
  title?: string;
  faction?: string;
  commandPoints?: string;
  totalPoints?: string;
}

interface PlayerProfileData {
  username?: string;
  avatar_url?: string;
  favorite_faction?: string;
  id?: string;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ playerId, index }) => {
  const { state, dispatch } = useGame();
  const player = state.players[playerId];
  const [playerName, setPlayerName] = useState(player?.name || '');
  const [playerWabId, setPlayerWabId] = useState(player?.wab_id || '');
  const [listMetadata, setListMetadata] = useState<ListMetadata>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [isLoadingSavedLists, setIsLoadingSavedLists] = useState(false);

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
    
    if (wab_id.length >= 12) {
      fetchLists(wab_id);
    }
  };

  const fetchLists = async (wabId: string) => {
    if (!wabId) return;
    
    setIsLoadingSavedLists(true);
    try {
      console.log(`Fetching lists for WAB ID: ${wabId}`);
      const lists = await fetchListsByWabId(wabId);
      
      if (lists.length > 0) {
        console.log(`Found ${lists.length} lists for WAB ID: ${wabId}`, lists);
        setSavedLists(lists);
        toast.success(`Found ${lists.length} saved lists`);
      } else {
        console.log(`No lists found for WAB ID: ${wabId}`);
        setSavedLists([]);
        if (player?.verified) {
          toast.info("No saved lists found for this WAB ID");
        }
      }
    } catch (err) {
      console.error(`Error fetching lists for WAB ID: ${wabId}:`, err);
      toast.error("Error loading saved lists");
      setSavedLists([]);
    } finally {
      setIsLoadingSavedLists(false);
    }
  };

  useEffect(() => {
    if (playerWabId) {
      console.log("WAB ID entered:", playerWabId);
      fetchLists(playerWabId);
    }
  }, [playerWabId]);

  useEffect(() => {
    const knownWabIds = ['WAB-TKBD-EKWZ-WX0M', 'WAB-1234-ABCD-5678'];
    
    if (playerWabId && knownWabIds.includes(playerWabId)) {
      console.log("Loading immediate lists for known WAB ID:", playerWabId);
      fetchLists(playerWabId);
    }
  }, [playerWabId]);

  const verifyWabId = async () => {
    if (!playerWabId) return;
    
    setIsVerifying(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, favorite_faction, id')
        .eq('wab_id', playerWabId)
        .single();
      
      if (error) {
        console.error("WAB ID verification error:", error);
        toast.error("WAB ID not found");
      } else if (data) {
        const profileData: PlayerProfileData = data;
        console.log("Profile data found:", profileData);
        
        const updates: Partial<Player> = {
          name: profileData.username || playerName,
          wab_id: playerWabId,
          verified: true
        };
        
        if (profileData.id) {
          updates.user_profile_id = profileData.id;
          await fetchLists(playerWabId);
        }
        
        if (profileData.favorite_faction) {
          updates.faction = {
            name: profileData.favorite_faction
          };
        }
        
        if (profileData.avatar_url) {
          updates.avatar_url = profileData.avatar_url;
        }
        
        dispatch({
          type: 'UPDATE_PLAYER',
          payload: {
            id: playerId,
            updates
          }
        });
        
        setPlayerName(profileData.username || playerName);
        toast.success("WAB ID verified");
      }
    } catch (err) {
      console.error("Error verifying WAB ID:", err);
      toast.error("Error verifying WAB ID");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const loadSavedLists = async () => {
      if (player?.verified && player?.user_profile_id && savedLists.length === 0 && !isLoadingSavedLists) {
        console.log("Loading lists for verified player with profile ID:", player.user_profile_id);
        await fetchLists(player.wab_id || '');
      }
    };
    
    loadSavedLists();
  }, [player?.verified, player?.user_profile_id, savedLists.length, isLoadingSavedLists]);

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

  const handleListUpload = (
    playerId: string, 
    listContent: string, 
    parsedUnits?: Unit[], 
    metadata?: ListMetadata
  ) => {
    dispatch({
      type: 'UPDATE_PLAYER',
      payload: {
        id: playerId,
        updates: { list: listContent }
      }
    });

    if (parsedUnits && parsedUnits.length > 0) {
      dispatch({
        type: 'ADD_PLAYER_UNITS',
        payload: {
          playerId,
          units: parsedUnits
        }
      });
    }

    if (metadata) {
      setListMetadata(metadata);
    }
  };

  const handleSavedListSelect = (listId: string) => {
    console.log("Selected list ID:", listId);
    const selectedList = savedLists.find(list => list.id === listId);
    console.log("Found selected list:", selectedList);
    
    if (!selectedList) {
      console.error("Selected list not found");
      return;
    }
    
    const listText = `${selectedList.name}\n${selectedList.faction}\n\n`;
    const units: Unit[] = selectedList.units.map((unit, index) => ({
      id: `unit-${playerId}-${index}`,
      name: unit.name,
      player: playerId
    }));

    const metadata: ListMetadata = {
      title: selectedList.name,
      faction: selectedList.faction,
      totalPoints: `${selectedList.units.reduce((sum, unit) => sum + (unit.pointsCost * unit.quantity), 0)} pts`
    };

    handleListUpload(playerId, listText, units, metadata);
    
    toast.success(`List "${selectedList.name}" loaded successfully`);
  };

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
          <Label>Saved Army Lists</Label>
          {isLoadingSavedLists ? (
            <p className="text-xs text-muted-foreground mt-1">Loading lists...</p>
          ) : savedLists.length > 0 ? (
            <Select onValueChange={handleSavedListSelect}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select a saved list" />
              </SelectTrigger>
              <SelectContent>
                {savedLists.map((list) => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name} ({list.faction})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              No saved lists available{playerWabId ? ` for ${playerWabId}` : ""}
            </p>
          )}
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

        {player?.list && (
          <div className="mt-4 space-y-2">
            {listMetadata.title && (
              <div className="bg-background/50 p-3 rounded-md border text-center">
                <h4 className="font-semibold">{listMetadata.title}</h4>
              </div>
            )}
            
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
