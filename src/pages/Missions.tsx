import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Mission {
  id: string;
  title: string;
  imageUrl: string;
}

const missions: Mission[] = [
  {
    id: "consolidated-progress",
    title: "Consolidated Progress",
    imageUrl: "/art/missions/consolidated_progress.jpg",
  },
  {
    id: "fog-of-death",
    title: "Fog of Death",
    imageUrl: "/art/missions/fog_of_death.jpg",
  },
  {
    id: "take-positions",
    title: "Take Positions",
    imageUrl: "/art/missions/take_positions.jpg",
  },
];

const Missions = () => {
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(missions[0]);

  return (
    <div className="min-h-screen bg-warcrow-background">
      {/* Navigation Header */}
      <div className="bg-warcrow-accent/50 p-4 md:p-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img 
            src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
            alt="Warcrow Logo" 
            className="h-16 md:h-20 cursor-pointer"
            onClick={() => navigate('/landing')}
          />
          <div className="flex gap-3 md:gap-4">
            <Button
              onClick={() => navigate('/builder')}
              className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors"
            >
              Army Builder
            </Button>
            <Button
              onClick={() => navigate('/rules')}
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
            >
              Rules
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold text-warcrow-gold mb-8">Missions</h1>
        <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-8">
          {/* Mission List */}
          <div className="space-y-4">
            {missions.map((mission) => (
              <Card
                key={mission.id}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedMission?.id === mission.id
                    ? "bg-warcrow-accent border-warcrow-gold"
                    : "bg-warcrow-accent/50 hover:bg-warcrow-accent border-warcrow-accent"
                }`}
                onClick={() => setSelectedMission(mission)}
              >
                <h3 className="text-warcrow-text font-semibold">{mission.title}</h3>
              </Card>
            ))}
          </div>

          {/* Mission Display */}
          <div className="bg-warcrow-accent/30 rounded-lg p-4">
            {selectedMission ? (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
                  {selectedMission.title}
                </h2>
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={selectedMission.imageUrl}
                    alt={selectedMission.title}
                    className="w-full h-auto rounded-lg"
                    loading="eager"
                  />
                </div>
              </div>
            ) : (
              <div className="text-warcrow-text text-center py-8">
                Select a mission to view its details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions;