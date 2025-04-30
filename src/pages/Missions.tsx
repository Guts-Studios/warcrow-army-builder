
import * as React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { MissionHeader } from "@/components/missions/MissionHeader";
import { MissionList } from "@/components/missions/MissionList";
import { MissionDetails } from "@/components/missions/MissionDetails";
import type { Mission } from "@/components/missions/types";

const Missions = () => {
  const [selectedMission, setSelectedMission] = React.useState<Mission | null>(null);
  const [missions, setMissions] = React.useState<Mission[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMissions = async () => {
      try {
        const { data, error } = await supabase
          .from('rules_sections')
          .select('id, title, mission_details')
          .not('mission_details', 'is', null)
          .order('order_index');

        if (error) {
          console.error('Error fetching missions:', error);
          return;
        }

        // Format official missions
        const formattedMissions = data.map(mission => ({
          id: mission.id,
          title: mission.title,
          details: mission.mission_details || '',
          isHomebrew: false // Mark as official
        }));

        // Add community missions
        const communityMissions = [
          {
            id: 'community-breached-front',
            title: 'Breached Front',
            details: 'Preparation\nPlace 4 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\nEach round lasts 5 turns.\n\nScoring\nAt the end of each round, you obtain:\n• 2 VP for controlling the center neutral objective (1).\n• 1 VP for controlling East neutral objective (2).\n• 1 VP for controlling your color objective.\n• 1 VP for controlling your opponent\'s color objective.\n\nEnd of the game\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield. If you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nThis mission was created by our Community member Anthony Pham, aka Viridian',
            isHomebrew: true,
            communityCreator: 'Anthony Pham, aka Viridian'
          },
          {
            id: 'community-battle-lines',
            title: 'Battle Lines',
            details: 'Preparation\nPlace 6 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\nEach round lasts 5 turns.\n\nScoring\nAt the end of each round, you obtain:\n• 2 VP for controlling your opponent\'s color objective (A).\n• 1 VP for controlling your color objective (A).\n• 1 VP for controlling each neutral objective (B or C).\n• 1 VP for controlling both neutral objectives (B and C).\n\nEnd of game\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nSpecial Rules\nThe Supply Chest– Use a 30mm objective marker to represent the Supply Chest. Place the Supply chest as indicated by the Objective S on the map. The Supply Chest behaves like an objective, but the players start the game controlling their color supply chest. While you control your Supply Chest, once per Round after a unit activates, choose another unit within 20 strides of one of your color objectives that you control. This unit may activate and perform only one action, and it does not receive stress or an activation token. If your opponent controls a Supply Chest at the end of any round, remove the Supply Chest from the game.\n\nThis mission was created by our Community member Anthony Pham, aka Viridian',
            isHomebrew: true,
            communityCreator: 'Anthony Pham, aka Viridian'
          }
        ];

        // Add the community missions to the formatted missions
        formattedMissions.push(...communityMissions);

        setMissions(formattedMissions);
        if (formattedMissions.length > 0) {
          setSelectedMission(formattedMissions[0]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, []);

  return (
    <div className="min-h-screen bg-warcrow-background">
      <MissionHeader />
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MissionList
            missions={missions}
            selectedMission={selectedMission}
            onSelectMission={setSelectedMission}
            isLoading={isLoading}
          />
          <div className="md:col-span-2">
            <MissionDetails mission={selectedMission} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions;
