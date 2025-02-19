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

        const formattedMissions = data.map(mission => ({
          id: mission.id,
          title: mission.title,
          details: mission.mission_details || ''
        }));

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
