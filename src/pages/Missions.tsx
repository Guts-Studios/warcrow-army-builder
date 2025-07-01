
import * as React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { MissionList } from "@/components/missions/MissionList";
import { MissionDetails } from "@/components/missions/MissionDetails";
import { FeatList } from "@/components/missions/FeatList";
import { FeatDetails } from "@/components/missions/FeatDetails";
import type { Mission } from "@/components/missions/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/common/PageHeader";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Missions = () => {
  const [selectedMission, setSelectedMission] = React.useState<Mission | null>(null);
  const [selectedFeat, setSelectedFeat] = React.useState<any | null>(null);
  const [missions, setMissions] = React.useState<Mission[]>([]);
  const [feats, setFeats] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { language, t } = useLanguage();

  React.useEffect(() => {
    const fetchMissions = async () => {
      try {
        console.log('[Missions] Fetching missions from Supabase...');
        
        const { data, error } = await supabase
          .from('rules_sections')
          .select('id, title, mission_details')
          .not('mission_details', 'is', null)
          .order('order_index');

        if (error) {
          console.error('[Missions] Supabase error:', error);
          setError('Failed to load missions from database');
          return;
        }

        // Format official missions from database
        const formattedMissions = data.map(mission => ({
          id: mission.id,
          title: mission.title,
          details: mission.mission_details || '',
          isHomebrew: false,
          isOfficial: true
        }));

        // Add the new official missions from your data
        const newOfficialMissions = [
          {
            id: 'official-consolidated-progress',
            title: 'Consolidated Progress',
            details: 'Preparation\n\nPlace 5 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\n\nEach round lasts for 5 turns.\n\nScoring\n\nAt the end of each round, you obtain:\n\n• 1 VP if you control the central objective\n• 1 VP if you control your opponent\'s objective (1)\n• 2 VPs if you control your opponent\'s objective (2)\n• 1 VP if your opponent controls neither of your objectives (1 and 2)\n\nEnd of the game\n\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points, the result will be a tie.',
            isHomebrew: false,
            isOfficial: true
          },
          {
            id: 'official-take-positions',
            title: 'Take Positions',
            details: 'Preparation\n\nPlace 4 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\n\nEach round lasts for 5 turns.\n\nScoring\n\nAt the end of each round, you obtain:\n\n• 1 VP for each objective you control with your opponent\'s color.\n• 1 VP if your opponent doesn\'t control any of the objectives of your color.\n\nEnd of the game\n\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield. If you have more Victory Points than your opponent at the end of the game, you win.\n\nIf you and your opponent have the same number of Victory Points, the result will be a tie.',
            isHomebrew: false,
            isOfficial: true
          },
          {
            id: 'official-fog-of-death',
            title: 'Fog of Death',
            details: 'Preparation\n\nPlace an objective marker in the center of the battlefield, as shown in the diagram. This marker represents an ancient and powerful arcane artifact capable of manipulating the fog that surrounds the companies.\n\nThe player who deploys first must place a conquest marker (showing its color) adjacent to the objective marker. This marker indicates which side controls the artifact at all times, so it begins under the control of the first company to deploy.\n\nPlace the four Fog markers each in one corner of the battlefield, as shown in the diagram.\n\nPlace an event token on position 3 of the turn counter.\n\nRounds\n\nEach round lasts for 4 turns.\n\nEvent\n\nWhen the event is activated do the following:\n\n• Displace all Fog markers Displace 10 strides in the direction of the conquest marker.\n• All units within 8 strides of any of the Fog markers must resolve a "Fog Effects" roll for each Fog marker within 8 strides of them. Whoever has the initiative decides which side resolves all their rolls first.\n• Advance the event token 3 positions on the turn counter.\n\nArcane artefact\n\nCompany units in control of the objective, which are within 3 strides of it, can perform the action:\n\nControl energy. Take a WP test. If you succeed, move the conquest marker in the desired direction 5 strides for each Success obtained.\n\nConquest marker\n\nThe conquest marker must always show the color of the side that controls the objective.\n\nAt the end of each turn, whoever controls the artifact (target) can move the conquest marker 2 strides in any direction. This marker can never end on units or terrain elements.\n\nFog effects\n\nWhen the event is activated, units within 8 strides of a Fog marker must roll ORG and apply the effects from the following table according to the result obtained. Units must resolve as many rolls as there are Fog markers within 8 strides.\n\nResult       Effect\n\nSuccess - The unit must face to face roll its defense roll against as many Success as there are troops in it and suffers as much damage as Success not canceled.\n\nSuccess, Special -  The unit must face to face roll its defense roll at 2 Success for each troop that is part of it and suffers as much damage as Success not canceled.\n\nSuccess, Hollow Special - The unit must face to face roll its defense roll against as many Success as there are troops in it and suffers as much damage as Success not canceled. The unit is stressed.\n\nHollow Success, Special -  The unit must face to face roll its defense roll at 4 Success and takes as much damage as Success not canceled.\n\nSpecial - The unit must face to face roll its defense roll at 6 Success and takes as much damage as Success not canceled. The unit becomes stressed.\n\nHollow Special -  Disoriented. The unit must make a move using its first MOV value in the direction indicated by its opponent.\n\nScoring\n\nYou gain 1 VP if you control the artifact (objective) and a Fog marker comes into contact with the conquest marker. In this case, remove the Fog marker from the game.\n\nAt the end of each round, you get:\n• 2 VPs if you control the artifact (objective)\n\nEnd of the game\n\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points, the result will be a tie.',
            isHomebrew: false,
            isOfficial: true
          },
          {
            id: 'official-influence-zones',
            title: 'Influence Zones',
            details: 'Required material\n\n• 2 red objective markers.\n• 2 blue objective markers.\n• 1 brown objective marker.\n\nRounds\n\nEach round has a duration of 5 turns.\n\nScoring\n\nAt the end of each round, each company obtains:\n\n• 1 MP if they control more objectives than their rival.\n• 1 MP if they control at least one objective of their rival\'s color.\n• 1 MP if they control at least 2 objectives.\n\nEnd of the game\n\nThe game ends at the end of round 3.\n\nStrategic domain\n\n• All units that are not demoralized have their conquest value increased by 1.\n• Conquest modifiers are not increased.\n\nInfluence zones\n\nUnits may contest control of objectives at 7 strides instead of 3.',
            isHomebrew: false,
            isOfficial: true
          },
          {
            id: 'official-expanse',
            title: 'Expanse',
            details: 'Required material\n\n• 4 brown objective markers.\n• 1 blue objective marker.\n\nPreparation\n\nBrown objective markers start the game controlled by the company that has their deployment zone adjacent to them.\n\nRounds\n\nEach round has a duration of 5 turns.\n\nScoring\n\nAt the end of each round, each company obtains:\n\n• 2 MP if they control more brown objectives than their rival.\n• 1 MP if they control the same amount of brown objectives as their rival.\n• 1 MP if they control the central objective (blue).\n\nEnd of the game\n\nThe game ends at the end of round 3.',
            isHomebrew: false,
            isOfficial: true
          },
          {
            id: 'official-loot',
            title: 'Loot',
            details: 'Required material\n\n• 2 red objective markers.\n• 2 blue objective markers.\n• 1 brown objective marker.\n\nRounds\n\nEach round has a duration of 5 turns.\n\nScoring\n\nAt the end of each round, each company obtains:\n\n• 1 MP if they have at least 1 loot.\n• 1 MP if they have more loot than their rival.\n• 1 MP if their rival has no loot.\n\nEnd of the game\n\nThe game ends at the end of round 3.\n\nLoot\n\nObjective markers are used to represent loot.\n\nThey use the following rules instead of those from the rulebook:\n\n• A unit adjacent to an objective marker may stress itself to pick it up (placing it on their profile card).\n• Units may move through an objective marker but cannot end their movement on one.\n• Units cannot pick up objective markers of their rival\'s color.\n• Units cannot carry more than 1 objective marker at the same time.\n• When a unit carrying loot is destroyed, the company controlling it places the loot adjacent to their leader before removing it from the battlefield. If the unit has an Officer Character joined, it may instead give the loot to the Character.\n• When a unit carrying loot becomes demoralized, place the objective marker adjacent to their leader before fleeing.\n• If a Character leaves a unit carrying loot, it can choose to take the loot or leave it in the unit.',
            isHomebrew: false,
            isOfficial: true
          },
          {
            id: 'official-quadrants',
            title: 'Quadrants',
            details: 'Rounds\n\nEach round has a duration of 5 turns.\n\nScoring\n\nAt the end of each round, each company gets:\n\n• 2 MP if they control more quadrants than their rival.\n• 1 MP if they control the same amount of quadrants as their rival.\n• 1 MP if they control at least 1 quadrant adjacent to their rival\'s deployment zone.\n\nEnd of the game\n\nThe game ends at the end of round 3.\n\nStrategic domain\n\n• All units that are not demoralized have their conquest value increased by 1.\n• Conquest value modifiers (from skills and effects) are not increased.\n\nQuadrants\n\nThe battlefield (not including deployment zones) is divided into four quadrants, which can be controlled as if they were objectives although no objective markers are used.\n\nUnits can contest control of a quadrant if their leader is within the quadrant (a leader whose base is in contact with more than one quadrant is not within any quadrant, so their unit cannot control or contest any quadrant).\n\nAlthough no objective markers are used, a conquest marker is placed in each quadrant to indicate which company controls it.',
            isHomebrew: false,
            isOfficial: true
          }
        ];

        // Update community missions with your provided details
        const communityMissions = [
          {
            id: 'community-battle-lines',
            title: 'Battle Lines',
            details: 'Preparation\nPlace 6 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\nEach round lasts 5 turns.\n\nScoring\nAt the end of each round, you obtain:\n    • 2 VP for controlling your opponent\'s color objective (A).\n    • 1 VP for controlling your color objective (A).\n    • 1 VP for controlling each neutral objective (B or C).\n    • 1 VP for controlling both neutral objectives (B and C)\n\nEnd of game\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield.\n\nIf you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nSpecial Rules\nThe Supply Chest– Use a 30mm objective marker to represent the Supply Chest. Place the Supply chest as indicated by the Objective S on the map. The Supply Chest behaves like an objective, but the players start the game controlling their color supply chest. While you control your Supply Chest, once per Round after a unit activates, choose another unit within 20 strides of one of your color objectives that you control. This unit may activate and perform only one action, and it does not receive stress or an activation token. If your opponent controls a Supply Chest at the end of any round, remove the Supply Chest from the game.\n\nThis Homebrew mission was created by our Community member Anthony Pham, aka Viridian',
            isHomebrew: true,
            isOfficial: false,
            communityCreator: 'Anthony Pham, aka Viridian'
          },
          {
            id: 'community-breached-front',
            title: 'Breached Front',
            details: 'Preparation\nPlace 4 objective markers on the battlefield with the colors shown in the diagram.\n\nRounds\nEach round lasts 5 turns.\n\nScoring\nAt the end of each round, you obtain:\n• 2 VP for controlling the center neutral objective (1).\n• 1 VP for controlling East neutral objective (2).\n• 1 VP for controlling your color objective\n• 1 VP for controlling your opponent\'s color objective\n\nEnd of the game\nThe game ends at the end of round 3 or when one of the companies has no units left on the battlefield. If you have more Victory Points than your opponent at the end of the game, you win. If you and your opponent have the same number of Victory Points the result will be a tie.\n\nThis Homebrew mission was created by our Community member Anthony Pham, aka Viridian',
            isHomebrew: true,
            isOfficial: false,
            communityCreator: 'Anthony Pham, aka Viridian'
          },
          {
            id: 'community-ghosts-from-mist',
            title: 'Ghosts from the Mist',
            details: 'Preparation\n\nPlace 4 fog ghosts (represented by generic objective markers) at centerline of the battlefield, also place 2 coloured objective markers on each half of the battlefield as shown in the diagram.\nPlace an event marker on position 2 on a dial.\n\nRounds\n\nEach round lasts 4 turns\n\nEvent\n\nWhen event is activated do the following:\n\nStarting with a player who has the initiative, whoever controls fog ghost markers can place them 5 strides from their current position. \nIf fog ghost marker player controls is placed adjusted to enemy unit- that unit must roll defence roll at **** and takes as much damage as * is not blocked.\nIf fog ghost marker player controls is placed adjusted to allied unit- that unit may clear 1 stress.\nAdvance event token 2 positions on the turn counter.\n\nScoring\n\nAt the end of each round you score:\n\n- 1 VP if more fog ghosts are fully on the opponent\'s half of the board than on your side of a board.\n- 1 VP if you control 3 fog ghosts or more\n- 1 VP if you control at least 1 fog ghost\n- 3 VP if fog ghost under your control is within 3 of the objective marker of your colour for each fog ghost marker within 3 of the objective marker of your colour. After scoring VPs this way, remove every fog ghost marker under your control within 3 of the objective marker of your colour from the game.\n\nEnd of the Game\n\nThe game ends at the end of round 3 or when one company has no units left on the battlefield.\n\nThis Homebrew mission was created by our Community member Vladimir Sagalov aka FinalForm',
            isHomebrew: true,
            isOfficial: false,
            communityCreator: 'Vladimir Sagalov aka FinalForm'
          },
          {
            id: 'community-sacred-land',
            title: 'Sacred Land',
            details: 'Preparation\n\nPlace 2 sacred altars and 3 lesser altars objective markers as shown in the diagram.\n\nRounds\n\nFirst round lasts 2 turns, Second round lasts 3 turns, Third round lasts 4 turns and Fourth round lasts 5 turns\n\nPrayers and Offerings\n\nIn this mission any unit may use special simple action Pray and special command ability Deity Offering\n\nPray: when your unit is within 3 from the lesser altar - you can use this action. Mark the unit that took this action with a Prayer token, it gets +1 to the conquest characteristic until the end of the game. This action can be used multiple times, to get multiple +1 conquest.\n\nDeity Offering: when your unit is within 3 from the sacred altar - you can use this command ability during the unit\'s activation. \n\nScoring\n\nAt the end of each round you score:\n\n- 1 VP if you control 2 or more lesser altars\n- 1 VP if you control 1 or more sacred altars\n- 1 VP if one or more units of your units with Prayer token is within 3 of lesser altar\n- 2 VP if one or more of your units with Prayer token are within 3 of sacred altar and they have High command characteristic or Spellcaster characteristic\n- 3 VP if you used Deity Offering on both sacred altars. You can score this 3 VPs only once per game.\n\nEnd of the Game\n\nThe game ends at the end of round 4 or when one company has no units left on the battlefield.\n\nThis Homebrew mission was created by our Community member Vladimir Sagalov aka FinalForm',
            isHomebrew: true,
            isOfficial: false,
            communityCreator: 'Vladimir Sagalov aka FinalForm'
          },
          {
            id: 'community-rescue-mission',
            title: 'Rescue Mission',
            details: 'Preparation\n\nPlace 6 Fallen comrade markers(represented by coloured objective markers) as shown in the diagram.\nPlace an event marker on position 5 on a dial.\n\nRounds\n\nEach round lasts 4 turns\n\nEvent\n\nWhen event is activated do the following:\n\nReplace all Fallen comrade markers with Mournful sights markers (represented by coloured objective markers of the same colour).\n\nRemove the event marker from the dial.\n\nRescuing the wounded\n\nIn this mission any unit may use special simple action Ensure survival: when your unit is within 3 from the Fallen comrade marker of your colour - you can use this action. \nYou can choose to place Survivor token on this unit or on any allied unit within 8. You can recover 1 trooper model in that unit. Remove that Fallen comrade marker from the game. \n\nIf unit with Survivor token is destroyed - discard Survivor token.\nIf an officer or support leaves the unit, you can choose which of them retains the Survivor token.\n\nAvenge the fallen\n\nIn this mission after your unit inficts any amount of damage to an enemy unit- place 1 vengeance token on that unit (you can represent it by d6 dice)\nIf your unit destroys an enemy unit - place 3 vengeance tokens on that unit instead. Your unit can never have more than 6 vengeance tokens. If you have to place any excessive vengeance tokens on a unit- discard them so there are no more than 6 vengeance tokens on your unit.\nUnit can repeat the number of dice on your attack rolls up to the number of vengeance tokens on it.\n\nScoring\n\nAt the end of each round you score:\n\n- 1 VP for each Fallen comrade token you control\n- 1 VP for each Survivor token on your units that are on the battlefield and are not engaged.\n- 1 VP for each 2 vengeance tokens on your units within 3 of Mournful sights markers of your colour. After scoring VPs this way, remove all the vengeance tokens from your units within 3 of Mournful sights markers of your colour. \n\nEnd of the Game\n\nThe game ends at the end of round 3 or when one company has no units left on the battlefield.\n\nThis Homebrew mission was created by our Community member Vladimir Sagalov aka FinalForm',
            isHomebrew: true,
            isOfficial: false,
            communityCreator: 'Vladimir Sagalov aka FinalForm'
          }
        ];

        // Combine all missions
        const allMissions = [...formattedMissions, ...newOfficialMissions, ...communityMissions];

        console.log(`[Missions] Loaded ${allMissions.length} total missions`);
        setMissions(allMissions);
        
        if (allMissions.length > 0) {
          setSelectedMission(allMissions[0]);
        }

        // Mock feats data for now - you can replace this with actual data later
        const mockFeats = [
          {
            id: 'feat-1',
            name: 'Sample Feat',
            details: 'This is a sample feat with detailed rules and mechanics.'
          }
        ];
        setFeats(mockFeats);
        if (mockFeats.length > 0) {
          setSelectedFeat(mockFeats[0]);
        }
      } catch (error) {
        console.error('[Missions] Unexpected error:', error);
        setError('An unexpected error occurred while loading missions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // Error boundary fallback
  if (error) {
    return (
      <div className="min-h-screen bg-warcrow-background">
        <PageHeader title="Missions">
          <LanguageSwitcher />
          <NavDropdown />
        </PageHeader>
        <div className="container mx-auto py-8">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
            <h2 className="text-red-400 text-xl font-bold mb-2">Error Loading Missions</h2>
            <p className="text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warcrow-background">
      <PageHeader title={t('missions')}>
        <LanguageSwitcher />
        <NavDropdown />
      </PageHeader>
      
      <div className="container mx-auto py-8">
        <Tabs defaultValue="missions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="missions">{t('missions')}</TabsTrigger>
            <TabsTrigger value="feats">Feats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="missions">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <MissionList
                missions={missions}
                selectedMission={selectedMission}
                onSelectMission={setSelectedMission}
                isLoading={isLoading}
                language={language}
              />
              <div className="md:col-span-2">
                <MissionDetails mission={selectedMission} isLoading={isLoading} language={language} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="feats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatList
                feats={feats}
                selectedFeat={selectedFeat}
                onSelectFeat={setSelectedFeat}
                isLoading={isLoading}
              />
              <div className="md:col-span-2">
                <FeatDetails feat={selectedFeat} isLoading={isLoading} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Missions;
