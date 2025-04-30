
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
          isHomebrew: false, // Mark as official
          isOfficial: true
        }));

        // Add the Tree Mother official mission with updated details
        formattedMissions.push({
          id: 'official-tree-mother',
          title: 'Tree Mother',
          details: 'Preparation\nThe battlefield is 60x60 strides in size.\nGame size: 205 points.\n• Blue deployment zone: Sÿenann (defending side)\n• Red deployment zone: Raiders (attacking side)\nBefore starting the game, randomly place one of the\nfollowing tokens on each of the objectives:\n• Tinge token.\n• Damage token.\n• Command token.\n• Activation token.\nPlace Event 1 token in position 1 on the turn counter.\n\nThe Tree Mother\nTo represent the Tree Mother, use a 60mm base.\n\nRounds\n• The first round lasts 5 turns.\n• The second round lasts 4 turns.\n• The third round lasts 3 turns.\n• The fourth round lasts 2 turns.\n\nEvent 1: The Tree Mother\nWhen this event is triggered do the following:\n• Forest Protectors. A Nemorous Sÿenann Character\ncan be stressed so that the Mother Tree is considered\nan ally of the Sÿenann during its activation.\n• The Tree Mother is activated (use the behavior on\nits profile).\n• Advance the Event 1 token 3 positions (Mother Tree\nhas INI 3).\n\nScoring\nAt the end of the scenario:\n• Sÿenann (defending side):\n» 1 VP for each sÿena sprout that isn\'t destroyed\n» 1 VP if the Tree Mother has not been destroyed\n• Raiders (attacking side):\n» 1 VP for each sÿena sprout destroyed\n» 1 VP if the Tree Mother has been destroyed\n\nEnd of the game\nThe game ends when any of the following conditions are\nmet; at the end of round 4, when one of the companies\nhas no units on the battlefield, when all units of one of\nthe companies are demoralized, or if the Mother Tree\nand all 4 sÿena sprouts have been destroyed.\n\nWoods\nWoods in the blue deployment zone have the keywords:\nBlock LoS and Cover (BLK).\n\nSÿena sprouts\nEach brown objective represents a sÿena sprout.\n\nDestroy a sprout\nAny unit of the raiding faction can destroy a sprout by\nperforming the simple action destroy sprout. To do so,\nthe unit must meet the following requirements:\n• The raiding unit must be adjacent to the sÿena sprout.\n• The raiding unit cannot be locked in combat.\n• The Tree Mother must not be adjacent to the sprout.\nTo resolve the action:\n• The raiding unit must face off its attack (without\nactivating switches or adding modifiers) at the defense\nvalue [d7][d7][d9] If the Sÿenann control the target\n(sprout), they add [d7][d7] to the defense roll.\n• If the raiding unit rolls at least 1 uncanceled [d1], during\nresolution, destroy the sprout (flip the objective\nmarker so its brown side is not showing).\n\nReturn home\nWhen a Sÿenann unit is required to flee, it will do so by\nmoving towards the nearest battlefield edge (ignoring\nthe deployment zone condition).',
          isHomebrew: false,
          isOfficial: true
        });

        // Add community missions - Adding isOfficial: false to fix the TypeScript error
        const communityMissions = [
          {
            id: 'community-breached-front',
            title: 'Breached Front',
            details: 'Preparation\nPlace 4 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\nEach round lasts 5 turns.\n\nScoring\nAt the end of each round, you obtain:\n• 2 VP for controlling the center neutral objective (1).\n• 1 VP for controlling East neutral objective (2).\n• 1 VP for controlling your color objective.\n• 1 VP for controlling your opponent\'s color objective.\n\nEnd of the game\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nThis mission was created by our Community member Anthony Pham, aka Viridian',
            isHomebrew: true,
            isOfficial: false,
            communityCreator: 'Anthony Pham, aka Viridian'
          },
          {
            id: 'community-battle-lines',
            title: 'Battle Lines',
            details: 'Preparation\nPlace 6 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\nEach round lasts 5 turns.\n\nScoring\nAt the end of each round, you obtain:\n• 2 VP for controlling your opponent\'s color objective (A).\n• 1 VP for controlling your color objective (A).\n• 1 VP for controlling each neutral objective (B or C).\n• 1 VP for controlling both neutral objectives (B and C).\n\nEnd of game\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nSpecial Rules\nThe Supply Chest– Use a 30mm objective marker to represent the Supply Chest. Place the Supply chest as indicated by the Objective S on the map. The Supply Chest behaves like an objective, but the players start the game controlling their color supply chest. While you control your Supply Chest, once per Round after a unit activates, choose another unit within 20 strides of one of your color objectives that you control. This unit may activate and perform only one action, and it does not receive stress or an activation token. If your opponent controls a Supply Chest at the end of any round, remove the Supply Chest from the game.\n\nThis mission was created by our Community member Anthony Pham, aka Viridian',
            isHomebrew: true,
            isOfficial: false,
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
