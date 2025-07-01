import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shuffle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mission, Feat } from "./types";
import { getMissionTitleTranslation, getFeatTitleTranslation } from "@/utils/missionTitleTranslations";

// Helper function to get mission image path
const getMissionImagePath = (missionTitle: string): string => {
  const titleToImage: Record<string, string> = {
    "Consolidated Progress": "/art/missions/consolidated_progress.jpg",
    "Take Positions": "/art/missions/take_positions.jpg",
    "Fog of Death": "/art/missions/fog_of_death.jpg",
    "Influence Zones": "/art/missions/influence_zones.jpg",
    "Expanse": "/art/missions/expanse.jpg",
    "Loot": "/art/missions/loot.jpg",
    "Quadrants": "/art/missions/quadrants.jpg",
    "Battle Lines": "/art/missions/battle_lines.jpg",
    "Breached Front": "/art/missions/breached_front.jpg",
    "Ghosts from the Mist": "/art/missions/ghosts_from_the_mist.jpg",
    "Sacred Land": "/art/missions/sacred_lands.jpg",
    "Rescue Mission": "/art/missions/rescue_mission.jpg",
  };
  
  return titleToImage[missionTitle] || "";
};

interface MissionGeneratorProps {
  missions: Mission[];
  feats: Feat[];
}

interface GeneratedScenario {
  mission: Mission;
  feat: Feat;
}

export const MissionGenerator = ({ missions, feats }: MissionGeneratorProps) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [includeOfficial, setIncludeOfficial] = useState(true);
  const [includeCommunity, setIncludeCommunity] = useState(true);
  const [generatedScenario, setGeneratedScenario] = useState<GeneratedScenario | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const generateScenario = () => {
    // Filter missions based on selected options
    const filteredMissions = missions.filter(mission => {
      if (mission.isHomebrew && !includeCommunity) return false;
      if (!mission.isHomebrew && !includeOfficial) return false;
      return true;
    });

    if (filteredMissions.length === 0 || feats.length === 0) {
      return;
    }

    // Randomly select one mission and one feat
    const randomMission = filteredMissions[Math.floor(Math.random() * filteredMissions.length)];
    const randomFeat = feats[Math.floor(Math.random() * feats.length)];

    setGeneratedScenario({
      mission: randomMission,
      feat: randomFeat
    });
  };

  const resetGenerator = () => {
    setGeneratedScenario(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Shuffle className="h-4 w-4" />
            Create Scenario
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-warcrow-dark border border-warcrow-gold/20">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold text-xl">The Scenario</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {!generatedScenario ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-warcrow-gold font-semibold">Filter Options</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="official"
                        checked={includeOfficial}
                        onCheckedChange={(checked) => setIncludeOfficial(checked as boolean)}
                      />
                      <label htmlFor="official" className="text-warcrow-text">
                        {t('official')} Missions
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="community"
                        checked={includeCommunity}
                        onCheckedChange={(checked) => setIncludeCommunity(checked as boolean)}
                      />
                      <label htmlFor="community" className="text-warcrow-text">
                        {t('community')} Missions
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={generateScenario}
                  disabled={!includeOfficial && !includeCommunity}
                  className="w-full"
                  variant="gold"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Generate Random Scenario
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Mission Card */}
                  <Card className="bg-black/70 border-warcrow-gold/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-warcrow-gold">
                          {getMissionTitleTranslation(generatedScenario.mission.title, language)}
                        </CardTitle>
                        <Badge 
                          variant={generatedScenario.mission.isHomebrew ? "outline" : "secondary"}
                          className={generatedScenario.mission.isHomebrew 
                            ? "bg-purple-800/40 text-purple-200 border-purple-600"
                            : "bg-warcrow-gold/20 text-warcrow-gold border-warcrow-gold/40"
                          }
                        >
                          {generatedScenario.mission.isHomebrew ? t('community') : t('official')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-warcrow-text text-sm max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {generatedScenario.mission.details}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Feat Card */}
                  <Card className="bg-black/70 border-warcrow-gold/20">
                    <CardHeader>
                      <CardTitle className="text-warcrow-gold">
                        {getFeatTitleTranslation(generatedScenario.feat.name, language)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-warcrow-text text-sm max-h-48 overflow-y-auto whitespace-pre-wrap">
                        {generatedScenario.feat.details}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Mission Image Card */}
                {getMissionImagePath(generatedScenario.mission.title) && (
                  <Card className="bg-black/70 border-warcrow-gold/20">
                    <CardHeader>
                      <CardTitle className="text-warcrow-gold text-center">Mission Map</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <img 
                        src={getMissionImagePath(generatedScenario.mission.title)}
                        alt={getMissionTitleTranslation(generatedScenario.mission.title, language)}
                        className="max-w-full h-auto rounded-md border border-warcrow-gold/20 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setShowImageModal(true)}
                      />
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-2">
                  <Button onClick={generateScenario} variant="outline">
                    <Shuffle className="h-4 w-4 mr-2" />
                    Generate New Scenario
                  </Button>
                  <Button onClick={resetGenerator} variant="ghost">
                    Back to Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      {generatedScenario && (
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="max-w-5xl max-h-[95vh] bg-warcrow-dark border border-warcrow-gold/20">
            <DialogHeader>
              <DialogTitle className="text-warcrow-gold text-center">
                {getMissionTitleTranslation(generatedScenario.mission.title, language)} - Mission Map
              </DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center">
              <img 
                src={getMissionImagePath(generatedScenario.mission.title)}
                alt={getMissionTitleTranslation(generatedScenario.mission.title, language)}
                className="max-w-full max-h-[80vh] object-contain rounded-md border border-warcrow-gold/20"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};