import * as React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Mission {
  id: string;
  title: string;
  details: string;
}

const MISSION_IMAGES: Record<string, string> = {
  'Consolidated Progress': 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
  'Take Positions': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
  'Fog of Death': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
};

const Missions = () => {
  const navigate = useNavigate();
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
      {/* Navigation Header */}
      <div className="bg-black/50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <img 
              src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
              alt="Warcrow Logo" 
              className="h-16"
            />
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
                onClick={() => navigate('/builder')}
              >
                Army Builder
              </Button>
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
                onClick={() => navigate('/rules')}
              >
                Rules
              </Button>
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
                onClick={() => navigate('/landing')}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission List */}
          <Card className="bg-warcrow-accent p-6">
            <h2 className="text-xl font-bold text-warcrow-gold mb-4">Missions</h2>
            {isLoading ? (
              <div className="text-warcrow-text text-center py-4">Loading missions...</div>
            ) : (
              <div className="space-y-2">
                {missions.map((mission) => (
                  <Button
                    key={mission.id}
                    variant="ghost"
                    className={`w-full justify-start text-lg font-medium ${
                      selectedMission?.id === mission.id
                        ? "text-warcrow-gold bg-black/20"
                        : "text-warcrow-text hover:text-warcrow-gold hover:bg-black/20"
                    }`}
                    onClick={() => setSelectedMission(mission)}
                  >
                    {mission.title}
                  </Button>
                ))}
              </div>
            )}
          </Card>

          {/* Mission Display */}
          <div className="md:col-span-2">
            {selectedMission ? (
              <div>
                <div className="mb-6">
                  <img
                    src={MISSION_IMAGES[selectedMission.title]}
                    alt={`${selectedMission.title} Mission`}
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                  />
                </div>
                <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
                  {selectedMission.title}
                </h2>
                <ScrollArea className="h-[calc(100vh-28rem)] pr-4">
                  <div className="text-warcrow-text whitespace-pre-wrap">
                    {selectedMission.details}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="text-warcrow-text text-center py-8">
                {isLoading ? "Loading mission details..." : "Select a mission to view details"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions;