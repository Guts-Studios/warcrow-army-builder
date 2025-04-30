
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

        // Add homebrew mission
        const homebrewMission = {
          id: 'homebrew-community',
          title: 'Homebrew: Color Control',
          details: 'Preparation\nPlace 4 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\nEach round lasts 5 turns.\n\nScoring\nAt the end of each round, you obtain:\n• 2 VP for controlling the center neutral objective (1).\n• 1 VP for controlling East neutral objective (2).\n• 1 VP for controlling your color objective.\n• 1 VP for controlling your opponent\'s color objective.\n\nEnd of the game\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield. If you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nThis Homebrew mission was created by our Community member Anthony Pham, aka Viridian'
        };

        const formattedMissions = data.map(mission => ({
          id: mission.id,
          title: mission.title,
          details: mission.mission_details || ''
        }));

        // Add the homebrew mission to the formatted missions
        formattedMissions.push(homebrewMission);

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
