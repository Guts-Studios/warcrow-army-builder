import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mission } from "./types";

interface MissionListProps {
  missions: Mission[];
  selectedMission: Mission | null;
  onSelectMission: (mission: Mission) => void;
  isLoading: boolean;
}

export const MissionList = ({ 
  missions, 
  selectedMission, 
  onSelectMission, 
  isLoading 
}: MissionListProps) => {
  return (
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
              onClick={() => onSelectMission(mission)}
            >
              {mission.title}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};