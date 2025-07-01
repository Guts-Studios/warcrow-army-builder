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
import { getMissionTitle, getFeatTitle } from "@/utils/missionTranslations";

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

        // Community missions with your provided details
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

        // Combine missions and translate titles (removed duplicate official missions)
        const allMissions = [...formattedMissions, ...communityMissions].map(mission => ({
          ...mission,
          displayTitle: getMissionTitle(mission.title, language)
        }));

        console.log(`[Missions] Loaded ${allMissions.length} total missions`);
        setMissions(allMissions);
        
        if (allMissions.length > 0) {
          setSelectedMission(allMissions[0]);
        }

        // Real feats data from your provided information
        const realFeats = [
          {
            id: 'feat-track',
            name: 'Track',
            details: 'Required material\n •4 event tokens, numbered from 1 to 4.\n\nPreparation\n\nThe company that wins the initiative receives event tokens 1 and 3, the rival company receives event tokens 2 and 4.\n\nEach company places one of their event tokens on the "1" position of the turn counter (track meter).\n\n After deploying all units in the game preparation phase (including Scouts), each company, in deployment order, places their remaining event token on any point of the battlefield farther than 10 strides away from their deployment zone (vestige).\n\n Tracking and Vestiges\n\n• Event tokens on the turn counter represent each company\'s track meter.\n• Event tokens on the battlefield represent vestiges.\n• Units may move through vestiges, but cannot finish their movement on them.\n• Each company has their own track meter and own vestiges.\n• Companies cannot interact with the rival\'s vestiges.\n\nTracking a vestige\n\nCharacter units and units with a joined Character that finish their activation adjacent to their company\'s vestige can track it:\n\n• The unit makes a WP test.\n• Scout and Ambusher units add ORG to their roll.\n• During the switches step of the roll, units may stress themselves to add 1 SUCCESS to their roll.\n• When a unit passes the test with 2 SUCCESS, the company advances the track meter by 1 position on the turn counter. Then, the rival company must place the vestige at 15 strides of its current position (it cannot be placed on Impassable terrain).\n\nScoring\n\nWhen a company advances their track meter to position "4" of the turn counter it obtains 4 AP and the rival company obtains as many AP as its current position on the track meter minus 1.\n\nAt the end of the game, if neither company got their track meter to position "4":\n\n• Each company obtains as many AP as the current position of their track meter.'
          },
          {
            id: 'feat-decapitation',
            name: 'Decapitation',
            details: 'Required material\n\n• 2 event tokens.\n\nCommander\n\n• Companies must deploy their commander during the deployment phase (they cannot use Scout or Ambusher).\n• If the commander is removed from the battlefield by any effect it will be considered eliminated (for scoring purposes)\n• The commander cannot join any unit.\n\nContract\n\nAfter deploying all units in the game preparation phase (including Scouts), each company, in deployment order, chooses a unit from the rival company as their contract (place an event token on their profile card).\n\n• The contract cannot be the commander\n• If the contract is removed from the battlefield by any effect it will be considered eliminated (for scoring purposes).\n• If the unit with the contract has a joined Character, the contract will be considered eliminated once the unit is destroyed, even if the Character survives.\n• A company that couldn\'t choose its contract (because there were no deployed enemy units) will do so at the end of the round. A demoralized unit cannot be chosen as a contract. If a company still can\'t choose its contract at the end of a round, it will do so at the end of the next one.\n\nScoring\n\nAt the end of the game, each company obtains:\n\n• 2 AP if they eliminated the rival\'s commander.\n• 1 AP if their commander hasn\'t been eliminated.\n• 1 AP if they eliminated their contract.'
          },
          {
            id: 'feat-the-rift',
            name: 'The Rift',
            details: 'Required material\n\n• 2 fog markers.\n• 2 event tokens.\n\nFog\n\nAfter deploying all units in the preparation phase (including Scouts), each company, in deployment order, must place a fog marker further than 20 strides from their deployment zone.\n\nThese fog markers cannot be moved.\n\nCharacter units and units with a joined Character that finish their activation adjacent to one of the fog markers may begin sealing the rift.\n\nSealing the Rift\n\nThe unit performs a WP test, using the Character\'s WP. The company places an event token on the turn counter, 6 positions ahead of the current turn, and then moves it back 1 position for each SUCCESS they got in the test.\n\n• Spellcaster Characters add ORG to their roll.\n\nIf the unit sealing the rift is no longer adjacent to the fog marker or if it activates, the event token is removed.\n\nA unit cannot begin sealing a rift that is already being sealed by another unit.\n\nWhen the event token is activated, the company sealing the rift obtains the fog marker (and removes it from the battlefield).\n\nScoring\n\nAt the end of the game, each company gets 2 AP for each fog marker it obtained.'
          },
          {
            id: 'feat-banner',
            name: 'Banner',
            details: 'Required material\n\n• 4 event tokens, numbered from 1 to 4.\n\nPreparation\n\nThe company that wins the initiative receives event tokens 1 and 3, the rival company receives event tokens 2 and 4.\n\nEach company places one of their event tokens on the "1" position of the turn counter (glory meter).\n\nAfter deploying all units in the game preparation phase (including Scouts and Ambushers), each company, in deployment order, chooses one of their deployed units to carry the banner, placing an event token on their profile card.\n\n• Characters carrying the banner cannot join a unit\n• A unit carrying the banner cannot have a joined Character.\n\nBanner\n\nFor each WOUND inflicted by the unit carrying the banner, its company advances their glory meter 1 position on the turn counter. If the glory meter is on position "10", move the rival company\'s glory meter back (to a minimum of 1).\n\nLost banner\n\nIf the unit carrying the banner flees, is destroyed or leaves the battlefield, the company controlling it places the banner on the battlefield, adjacent to its leader, before removing the unit from the battlefield or fleeing.\n\nPick up the banner\n\nIf a company\'s banner is on the battlefield, any adjacent allied unit may pick it up performing the Pick up banner simple action.\n\nScoring\n\nAt the end of the game, each company gets:\n\n• 1 AP if their rival lost its banner at any point.\n• 1 AP if they didn\'t lose their own banner\n• 1 AP if their glory meter is on the same position as their rivals.\n• 2 AP if their glory meter is higher on the turn counter than their rivals.'
          },
          {
            id: 'feat-resources',
            name: 'Resources',
            details: 'Required material\n\n• 2 event tokens.\n\nPreparation\n\nThe company that wins the initiative receives event token 1, the rival company receives event token 2.\n\nEach company places their event token on position "1" of the turn counter (resource meter).\n\nResources\n\nUnits further than 12 strides from their deployment zone that are not engaged in combat may stress themselves at the end of their activation to obtain resources.\n\nObtain resources\n\nThe unit performs a simple roll, the dice of which will depend on the amount of troops in the unit (Support counts when calculating the number of troops for this action). The unit\'s company advances their resource meter 1 position for each SUCCESS they got. If the resource meter is on position "10", instead of advancing the resource meter, move the rival company\'s resource meter back (to a minimum of 1).\n\nA company cannot obtain resources more than once per turn.\n\nDice rolled:\n• 1 Troop: YLW\n• 2-3 Troops: YLW ORG\n• 4+ Troops: YLW ORG RED\n\nScoring\n\nAt the end of the game, each company obtains:\n\n• 1 AP if their resource meter is on position 4 or higher.\n• 1 AP if their resource meter is on position 7 or higher.\n• 1 AP if their resource meter is on position 10.\n• 1 AP if their resource meter is higher on the turn counter than their rival\'s'
          }
        ];
        
        // Translate feat titles
        const translatedFeats = realFeats.map(feat => ({
          ...feat,
          displayName: getFeatTitle(feat.name, language)
        }));
        
        setFeats(translatedFeats);
        if (translatedFeats.length > 0) {
          setSelectedFeat(translatedFeats[0]);
        }
      } catch (error) {
        console.error('[Missions] Unexpected error:', error);
        setError('An unexpected error occurred while loading missions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMissions();
  }, [language]); // Add language as dependency to re-fetch when language changes

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
