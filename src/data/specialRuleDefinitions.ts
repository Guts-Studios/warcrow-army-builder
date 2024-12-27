export const specialRuleDefinitions: { [key: string]: string } = {
  "Vulnerable": "Your unit must cancel one die from its defense rolls in which it has rolled at least one 3. In the case of multiple dice, your opponent will choose which one. You must apply this effect after rolling the dice (with all possible repetitions), but just before starting the Switches step.",
  "Frightened": "Your unit must re-roll all of its successful Willpower Tests (maximum once per test). Remove this state when you pass a willpower test.",
  "Disarmed": "Your unit must cancel one die from its attack rolls in which it has obtained at least one 1. In the case of multiple dice, your opponent will choose which one. You must apply this effect after rolling the dice (with all possible repetitions), but just before starting the Switches step.",
  "Slowed": "Your unit cannot use its second movement value (MOV) when performing the move and assault actions. Additionally, you must subtract 4 strides from your charge movement (up to a minimum value of 0).",
  "Scout": "Scout units can deploy right after all other units on both sides have finished deploying. They represent advance guards that have recognized the terrain or the enemy and choose the best position.",
  "Fix a Die": "When an effect allows you to 'fix a die', before rolling your dice, you may select one of your die sides. You then roll the rest of your dice pool and calculate the result, using the chosen face on your fixed die as if that die had rolled that face naturally.",
  "Shove (5)": "The target unit must distance itself from your unit by making a movement of 5 strides in the direction that joins the center of the opponent's troop leaders base to the center of your troop leaders base.",
  "Attract (5)": "The target unit must approach your unit by making a movement of 5 strides in the direction that joins the center of the opponents troop leaders base to the center of your troop leaders base.",
  "Place (3)": "Indicate a point on the battlefield 3 strides from your unit's troop leader. Whoever controls the target unit must take their troop leader and place it on the designated point.",
  "Displace (3)": "The unit you displace must make a straight movement of 3 strides in the direction you indicate. The effects of Terrain elements cannot affect this move (except Impassable).",
  "Immune to State": "If your unit receives a condition to which it is immune, do not place the token on its profile and ignore its effects completely",
  "Flee": "If your unit flees, you must immediately move it using both of its MOV values towards your deployment zone, following the shortest possible path.",
  "Rugged": "Units receive the slowed state at any moment they are adjacent to the terrain element during their activation.",
  "Trap": "This terrain feature has been created by a unit using a skill or spell. Units that can remove traps can remove this terrain element from the battlefield.",
  "Intimidating (X)": "When this unit engages in combat, the enemy unit must perform a WP test in which they must obtain at least as many 1 as indicated by 'X' to avoid stress.",
  "Dispel (D)": "When this unit is targeted by a spell it can attempt to block it. The 'D' value indicates the dice or automatic symbols that must be rolled to block the spell."
};