import { useState, useEffect } from 'react';
import { fetchListsByWabId } from '@/utils/profileUtils';
import { SavedList } from '@/types/army';
import { toast } from 'sonner';
import { Player } from '@/types/game';
import { supabase } from '@/integrations/supabase/client';
import { useEnvironment } from '@/hooks/useEnvironment';

export const useSavedLists = (player?: Player) => {
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [isLoadingSavedLists, setIsLoadingSavedLists] = useState(false);
  const [lastFetchedWabId, setLastFetchedWabId] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());
  const { isPreview } = useEnvironment();

  const fetchLists = async (wabId: string) => {
    if (!wabId) {
      console.log('No WAB ID provided, skipping fetch');
      return;
    }
    
    console.log(`Fetching lists for WAB ID: ${wabId}`, {timestamp: new Date().toISOString()});
    setIsLoadingSavedLists(true);
    
    try {
      setLastFetchedWabId(wabId);
      setLastRefresh(Date.now());
      
      // First try to get the user's own lists if they're logged in
      const { data: { session } } = await supabase.auth.getSession();
      let lists: SavedList[] = [];
      
      if (session?.user) {
        console.log('User is authenticated, fetching their lists', {userId: session.user.id});
        
        const { data, error } = await supabase
          .from('army_lists')
          .select('*')
          .eq('user_id', session.user.id);
          
        if (error) {
          console.error('Error fetching user lists:', error);
          toast.error('Error loading your cloud lists');
        } else if (data) {
          console.log(`Found ${data.length} lists for authenticated user`);
          lists = data.map((list: any) => ({
            id: list.id,
            name: list.name,
            faction: list.faction,
            units: Array.isArray(list.units) ? list.units : [],
            user_id: list.user_id,
            created_at: list.created_at,
            wab_id: list.wab_id
          }));
        }
      }
      
      // Additionally fetch by WAB ID if it's different from the user's ID
      if (wabId !== session?.user?.id && wabId !== 'preview-user-id') {
        try {
          const wabLists = await fetchListsByWabId(wabId);
          
          if (Array.isArray(wabLists) && wabLists.length > 0) {
            // Only add WAB lists that aren't already in the user's lists
            const existingIds = new Set(lists.map(list => list.id));
            const newWabLists = wabLists.filter(list => !existingIds.has(list.id));
            
            lists = [...lists, ...newWabLists];
            console.log(`Found ${newWabLists.length} additional lists by WAB ID`);
          } else {
            console.log(`No additional lists found by WAB ID: ${wabId}`);
          }
        } catch (wabErr) {
          console.error(`Error fetching lists by WAB ID: ${wabId}:`, wabErr);
        }
      }
      
      // Also get lists from localStorage - always try to load these
      try {
        const localData = localStorage.getItem('armyLists');
        if (localData) {
          const localLists = JSON.parse(localData) as SavedList[];
          
          if (Array.isArray(localLists) && localLists.length > 0) {
            // Ensure local lists don't accidentally have user_id property
            const processedLocalLists = localLists.map((list: SavedList) => {
              // If this is a local list, make sure it doesn't have user_id
              if (!list.user_id) {
                return list;
              }
              
              // If it matches the current user's ID, it's likely a cloud list
              // that was also saved locally - keep as is
              if (session?.user?.id && list.user_id === session.user.id) {
                return list;
              }
              
              // Otherwise it's a local list that somehow got a user_id - remove it
              const { user_id, ...listWithoutUserId } = list;
              return listWithoutUserId as SavedList;
            });
            
            // Only add local lists if they're not already in our lists
            const existingIds = new Set(lists.map(list => list.id));
            const newLocalLists = processedLocalLists.filter(list => !existingIds.has(list.id));
            
            lists = [...lists, ...newLocalLists];
            console.log(`Found ${newLocalLists.length} additional lists from localStorage`);
          }
        } else {
          console.log("No local lists found in localStorage");
        }
      } catch (localErr) {
        console.error('Error loading local lists:', localErr);
      }
      
      if (lists.length > 0) {
        console.log(`Total lists found: ${lists.length}`);
        setSavedLists(lists);
      } else {
        console.log(`No lists found for WAB ID: ${wabId}`);
        setSavedLists([]);
      }
    } catch (err) {
      console.error(`Error fetching lists for WAB ID: ${wabId}:`, err);
      toast.error("Error loading saved lists");
      
      // Try to load at least local lists as a fallback
      try {
        const localData = localStorage.getItem('armyLists');
        if (localData) {
          const localLists = JSON.parse(localData);
          setSavedLists(localLists);
          console.log(`Loaded ${localLists.length} fallback local lists`);
        }
      } catch (e) {
        console.error('Error loading fallback local lists:', e);
      }
    } finally {
      setIsLoadingSavedLists(false);
    }
  };

  // Auto-fetch lists when wab_id changes or player becomes verified
  useEffect(() => {
    if (player?.verified && player?.wab_id && !isLoadingSavedLists) {
      console.log("Player is verified, automatically fetching lists");
      fetchLists(player.wab_id);
    }
  }, [player?.verified, player?.wab_id, isLoadingSavedLists]);

  // Check auth status and user_id to fetch lists directly if logged in
  useEffect(() => {
    const checkAuthAndFetchLists = async () => {
      if (isLoadingSavedLists) return;
      
      // Always try to load local lists first for immediate display
      try {
        const localData = localStorage.getItem('armyLists');
        if (localData) {
          const localLists = JSON.parse(localData);
          // Filter out any lists that accidentally have user_id property
          const processedLocalLists = localLists.map((list: SavedList) => {
            if (!list.user_id) return list;
            const { user_id, ...listWithoutUserId } = list;
            return listWithoutUserId;
          });
          setSavedLists(processedLocalLists);
          console.log(`Loaded ${processedLocalLists.length} local lists`);
        }
      } catch (e) {
        console.error('Error loading local lists:', e);
      }
      
      // Then check if user is authenticated to fetch cloud lists
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log("User is authenticated, fetching lists directly");
          fetchLists(session.user.id);
        } else if (isPreview) {
          console.log("Preview environment detected, using local lists only");
        } else {
          console.log("User is not authenticated, using local lists only");
        }
      } catch (authError) {
        console.error('Error checking authentication:', authError);
        
        // On auth error, still try to display local lists
        try {
          const localData = localStorage.getItem('armyLists');
          if (localData) {
            const localLists = JSON.parse(localData);
            setSavedLists(localLists);
          }
        } catch (e) {
          console.error('Error loading local lists after auth error:', e);
        }
      }
    };
    
    checkAuthAndFetchLists();
  }, [isPreview, isLoadingSavedLists]);

  return {
    savedLists,
    isLoadingSavedLists,
    fetchLists,
    refreshLists: () => {
      console.log("Refreshing saved lists...");
      if (lastFetchedWabId) {
        fetchLists(lastFetchedWabId);
      } else {
        // If no WAB ID yet, try to get the user ID
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.id) {
            fetchLists(session.user.id);
          } else {
            // Try to load local lists at minimum
            try {
              const localData = localStorage.getItem('armyLists');
              if (localData) {
                const localLists = JSON.parse(localData);
                setSavedLists(localLists);
                console.log(`Refreshed to ${localLists.length} local lists`);
              }
            } catch (e) {
              console.error('Error refreshing local lists:', e);
            }
          }
        });
      }
    }
  };
};

export default useSavedLists;
