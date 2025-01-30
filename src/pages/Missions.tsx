import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [selectedMission, setSelectedMission] = React.useState<Mission | null>(missions[0]);

  return (
    <div className="min-h-screen bg-warcrow-background">
      {/* Navigation Header */}
      <div className="bg-black/50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
              alt="Warcrow Logo" 
              className="h-12"
            />
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
              onClick={() => navigate('/builder')}
            >
              Army Builder
            </Button>
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
              onClick={() => navigate('/rules')}
            >
              Rules
            </Button>
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
              onClick={() => navigate('/landing')}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission List */}
          <Card className="bg-warcrow-accent p-6">
            <h2 className="text-xl font-bold text-warcrow-gold mb-4">Missions</h2>
            <div className="space-y-2">
              {missions.map((mission) => (
                <Button
                  key={mission.id}
                  variant="outline"
                  className={`w-full justify-start ${
                    selectedMission?.id === mission.id
                      ? "border-warcrow-gold text-warcrow-gold"
                      : "border-warcrow-muted text-warcrow-text hover:border-warcrow-gold hover:text-warcrow-gold"
                  }`}
                  onClick={() => setSelectedMission(mission)}
                >
                  {mission.title}
                </Button>
              ))}
            </div>
          </Card>

          {/* Mission Display */}
          <div className="md:col-span-2">
            {selectedMission ? (
              <div>
                <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
                  {selectedMission.title}
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="relative rounded-lg overflow-hidden cursor-pointer transition-opacity hover:opacity-90">
                      <img
                        src={selectedMission.imageUrl}
                        alt={selectedMission.title}
                        className="w-full h-auto rounded-lg"
                        loading="eager"
                      />
                      {selectedMission.id === "fog-of-death" && (
                        <div className="absolute bottom-4 right-4 bg-black/70 text-warcrow-gold px-3 py-1 rounded-full text-sm">
                          Click to zoom
                        </div>
                      )}
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
                    <img
                      src={selectedMission.imageUrl}
                      alt={selectedMission.title}
                      className="w-full h-full object-contain"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="text-warcrow-text text-center py-8">
                Select a mission to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions;