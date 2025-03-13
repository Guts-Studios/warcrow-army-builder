
import { ExtendedUnit } from "@/types/extended-unit";

export const extendedUnits: ExtendedUnit[] = [
  {
    id: "agressors",
    name: "Aggressors",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/card/agressors_card.jpg",
    stats: {
      mov: "3-2 (9)",
      w: 2,
      wp: 2,
      mor: 2,
      avb: 1,
      characteristics: ["Human", "Infantry"],
      members: "3+",
      conquest: 1
    },
    profile1: {
      attack: {
        modifier: "⚡★!!",
        diceColors: "🔴🟠🟠🟡🔵★",
        switchValue: "2 !!",
        switch1: "Cancel 1 symbol from your target",
        switchValue2: "1 !",
        switch2: "Target receives disarmed state"
      },
      defense: {
        modifier: "⚡ 🔴 !",
        diceColors: "🟢🔵🔵⚫",
        switchValue: "2 !!",
        switch1: "Cancel 1 symbol from your attacker"
      }
    },
    profile2: {
      attack: {
        modifier: "⚡★!",
        diceColors: "🔴🔴🟡🟡"
      },
      defense: {
        modifier: "⚡+🟠!",
        diceColors: "🟢🔵",
        switchValue: "1 !",
        switch1: "Cancel 1 symbol from your attacker"
      }
    },
    skills: [],
    commands: [
      {
        name: "Broadswords",
        description: "Target: enemy unit engaged with you. When you declare an attack against the target, shove it (2). Then, displace (4) to engage with your target. Start the combat."
      }
    ],
    passives: [
      {
        name: "Commitment and Composure",
        description: "Do not cancel any die or automatic symbol from your rolls because of being engaged in combat with more than one enemy unit."
      }
    ]
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Cover (BLK)", description: "Provides cover" }
    ],
    specialRules: ["Frightened"],
    highCommand: false,
    availability: 2,
    imageUrl: "/art/card/black_legion_arquebusiers_card.jpg",
    stats: {
      mov: "3-2 (7)",
      w: 2,
      wp: 1,
      mor: 1,
      avb: 2,
      characteristics: ["Human", "Infantry"],
      members: "3+",
      conquest: 1
    },
    profile1: {
      range: "12",
      ranged: {
        diceColors: "🔴🟠🟡🟡🟡",
        switchValue: "1★",
        switch1: "Inflict 1 wound to your target"
      },
      attack: {
        diceColors: "🟠🟠🟡🟡"
      },
      defense: {
        diceColors: "🟢🔵🛡",
        switchValue: "1 !",
        switch1: "Add 🛡 to your roll"
      }
    },
    profile2: {
      range: "12",
      ranged: {
        diceColors: "🟠🟠🟡🟡🟡",
        switchValue: "1 ★"
      },
      attack: {
        diceColors: "🟡🟡🟡",
        switchValue: "1★",
        switch1: "Inflict 1 wound to your target"
      },
      defense: {
        diceColors: "🟢🛡",
        switchValue: "1 !",
        switch1: "Add 🛡 to your roll"
      }
    },
    skills: [],
    commands: [],
    passives: [
      {
        name: "Point-Blank",
        description: "Add 1 ⭐ to your ranged attack against units within 8 strides. If you inflict at least 1 ❗, your target receives the frightened state. Remember, you may apply these effects when you Hold and shoot."
      },
      {
        name: "Pavise",
        description: "When you are the target of a ranged attack, add 1 🛡 to your defense roll. You may repeat a die from your defense roll."
      }
    ]
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    pointsCost: 20,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" }
    ],
    highCommand: false,
    availability: 3,
    imageUrl: "/art/card/black_legion_bucklemen_card.jpg",
    stats: {
      mov: "3-3 (9)",
      w: 2,
      wp: 1,
      mor: 1,
      avb: 3,
      characteristics: ["Human", "Infantry"],
      members: "3+",
      conquest: 2
    },
    profile1: {
      attack: {
        diceColors: "🔴🟠🟠🟠",
        switchValue: "1 !",
        switch1: "Add 🛡 to your roll"
      },
      defense: {
        diceColors: "🟢🟢⚫",
        switchValue: "1🛡",
        switch1: "Add 🛡 to your roll"
      }
    },
    profile2: {
      attack: {
        diceColors: "🟠🟠🟡🟡",
        switchValue: "1 !",
        switch1: "Add 🛡 to your roll"
      },
      defense: {
        diceColors: "🔵🔵",
        switchValue: "1 !",
        switch1: "Add 🛡 to your roll"
      }
    },
    skills: [],
    commands: [],
    passives: []
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Cover (BLK)", description: "Provides cover" },
      { name: "Immovable", description: "Cannot be moved" }
    ],
    specialRules: ["Shove (3)"],
    highCommand: false,
    availability: 2,
    imageUrl: "/art/card/bulwarks_card.jpg",
    stats: {
      mov: "2-3 (8)",
      w: 3,
      wp: "🟠🟡",
      mor: 1,
      avb: 2,
      characteristics: ["Human", "Infantry", "Cover (⚫)", "Immovable"],
      members: "3+",
      conquest: 1
    },
    profile1: {
      attack: {
        diceColors: "🔴🟠★",
        switchValue: "1 !",
        switch1: "If you are engaged, shove (3) your target."
      },
      defense: {
        diceColors: "🟢⚫⚫🛡",
        switchValue: "2 !!",
        switch1: "Add 🛡 to your roll"
      }
    },
    profile2: {
      attack: {
        diceColors: "🟠🟡★",
        switchValue: "2 !!",
        switch1: "If you are engaged, shove (3) your target."
      },
      defense: {
        diceColors: "🟢🔵🔵",
        switchValue: "1 !!",
        switch1: "Add 1 🛡 to your roll"
      }
    },
    skills: [
      {
        name: "Taunt the Enemy",
        description: "Target: Non-Character enemy unit within 10 strides. If your target can charge or assault you, it is forced to do so unless it passes a WP test with 2⭐ (it is not considered activated). Your target may suffer 1 stress and repeat 1 die from its WP roll (only once). Your target cannot activate the switches of its attack roll."
      }
    ],
    commands: [],
    passives: [
      {
        name: "Hold Position",
        description: "Add 1 to your conquest value for each allied Infantry or Cavalry unit (that is not a Character) within 5 strides."
      },
      {
        name: "Charger's Folly",
        description: "When an enemy unit charges or assaults you, Add 1 ⭐⭐ to your defense roll. If your attacker is Cavalry or Large, add 1 additional ⭐. You may repeat 1 die from your defense roll."
      }
    ]
  },
  {
    id: "pioneers",
    name: "Pioneers",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Dwarf", description: "Dwarf race" },
      { name: "Ghent", description: "Ghent faction" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Dispel (BLU)", description: "Can dispel magic" },
      { name: "Scout", description: "Has scouting abilities" }
    ],
    specialRules: ["Shove (3)", "Disarmed", "Trap", "Slowed"],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/card/pioneers_card.jpg",
    stats: {
      mov: "2-3 (8)",
      w: 3,
      wp: 2,
      mor: 2,
      avb: 1,
      characteristics: ["Dwarf", "Ghent", "Infantry", "Dispel (🔵)", "Scout"],
      members: "2+",
      conquest: 1
    },
    profile1: {
      range: "10",
      ranged: {
        diceColors: "🔴🟠🟠🟡",
        switchValue: "2 !!",
        switch1: "Shove (3) your target. If you already activated this switch, cancel 🛡 from your target instead.",
        switchValue2: "1 !",
        switch2: "Your target receives disarmed state"
      },
      attack: {
        diceColors: "🟠🟠🟠🟡"
      },
      defense: {
        diceColors: "🟢⚫"
      }
    },
    profile2: {
      range: "10",
      ranged: {
        diceColors: "🟠🟠🟠🟡",
        switchValue: "1 !",
        switch1: "Your target receives disarmed state"
      },
      attack: {
        diceColors: "🟠🟡🟡🟡"
      },
      defense: {
        diceColors: "🔵"
      }
    },
    skills: [
      {
        name: "Mortar",
        description: "No LoS. Target enemy unit within 10 strides not engaged in combat. Resolve a ranged attack against the target. Your roll consists of 1 🔴 per each Pioneer in your unit (Characters do not count) plus 1 🔴 per troop inside the targeted unit (including Supports and up to 3 🔴). If you inflict at least 1 ❗, your target receives the frightened state."
      }
    ],
    commands: [],
    passives: [
      {
        name: "Shovelers",
        description: "Once per round. During your activation. Place within 5 strides of you a circular terrain element of 6 strides in diameter with the keyword Trap. You cannot place it on an Impasseable element. When an enemy unit gets in touch with your Trap during its activation, it receives the slowed state and must roll its defense to 🔴🔴🟡🟡. It will suffer 1 ❗ for each uncancelled ⚡. Once activated, remove the Trap."
      },
      {
        name: "Trench Yourselves!",
        description: "While you have not activated during the current round (no activation token on you), add 🟡 to your defense roll when you are the target of a ranged or melee attack. Enemy units cannot apply effects for charging or engaging in combat with you via assault."
      }
    ]
  }
];
