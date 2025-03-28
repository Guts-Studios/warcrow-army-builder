
import { useState, useEffect } from 'react';
import { fetchListsByWabId } from '@/utils/profileUtils';
import { SavedList } from '@/types/army';
import { toast } from 'sonner';
import { Player } from '@/types/game';

export const useSavedLists = (player?: Player) => {
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [isLoadingSavedLists, setIsLoadingSavedLists] = useState(false);
  const [lastFetchedWabId, setLastFetchedWabId] = useState<string | null>(null);

  const fetchLists = async (wabId: string) => {
    if (!wabId || lastFetchedWabId === wabId) return;
    
    setIsLoadingSavedLists(true);
    try {
      setLastFetchedWabId(wabId);
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
          toast.info("No saved lists found for this WAB ID", {
            id: `no-lists-${wabId}`
          });
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

  // Auto-fetch lists when wab_id changes or player becomes verified
  useEffect(() => {
    if (player?.verified && player?.wab_id && !isLoadingSavedLists && savedLists.length === 0 && lastFetchedWabId !== player.wab_id) {
      console.log("Player is verified, automatically fetching lists");
      fetchLists(player.wab_id);
    }
  }, [player?.verified, player?.wab_id, isLoadingSavedLists, savedLists.length, lastFetchedWabId]);

  // Load saved lists for verified player with profile ID
  useEffect(() => {
    const loadSavedLists = async () => {
      if (player?.verified && player?.user_profile_id && savedLists.length === 0 && !isLoadingSavedLists && lastFetchedWabId !== player.wab_id) {
        console.log("Loading lists for verified player with profile ID:", player.user_profile_id);
        await fetchLists(player.wab_id || '');
      }
    };
    
    loadSavedLists();
  }, [player?.verified, player?.user_profile_id, savedLists.length, isLoadingSavedLists, lastFetchedWabId, player?.wab_id]);

  return {
    savedLists,
    isLoadingSavedLists,
    fetchLists
  };
};
