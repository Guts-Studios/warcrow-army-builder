
import { ExtendedUnit } from "@/types/extendedUnit";

export const sampleExtendedUnits: ExtendedUnit[] = [
  {
    id: "aggressors",
    name: "Aggressors",
    cost: 40,
    stats: { 
      MOV: "3-2 (9)", 
      W: 2, 
      WP: 2, 
      MOR: 2, 
      AVB: 1 
    },
    type: "Human - Infantry",
    keywords: ["Human", "Infantry"],
    attacks: [
      { 
        members: "3+", 
        modifier: "⚡★!!", 
        dice: ["🔴", "🟠", "🟠", "🟡", "🔵★"], 
        switches: [
          { value: "2!!", "effect": "Cancel 1 symbol from your target" },
          { value: "1!", "effect": "Target receives disarmed state" }
        ] 
      },
      { 
        members: "2-", 
        modifier: "⚡★!", 
        dice: ["🔴", "🔴", "🟡", "🟡"], 
        switches: [
          { value: "1!", "effect": "Cancel 1 symbol from your attacker" }
        ] 
      }
    ],
    defenses: [
      { 
        modifier: "⚡🔴!", 
        dice: ["🟢", "🔵", "🔵", "⚫"], 
        switches: [
          { value: "2!!", "effect": "Cancel 1 symbol from your attacker" }
        ] 
      },
      { 
        modifier: "⚡+🟠!", 
        dice: ["🟢", "🔵"], 
        switches: [
          { value: "1!", "effect": "Cancel 1 symbol from your attacker" }
        ] 
      }
    ],
    abilities: {
      skill: "Broadswords: Target: enemy unit engaged with you. When you declare an attack against the target, shove it (2). Then, displace (4) to engage with your target. Start the combat.",
      passive: "Commitment and Composure: Do not cancel any die or automatic symbol from your rolls because of being engaged in combat with more than one enemy unit."
    },
    imageUrl: "/art/card/agressors_card.jpg"
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    cost: 30,
    stats: {
      MOV: "3-2 (7)",
      W: 2,
      WP: 1,
      MOR: 1,
      AVB: 2
    },
    type: "Human - Infantry",
    keywords: ["Human", "Infantry", "Cover (⚫)"],
    attacks: [
      {
        members: "3+",
        dice: ["🔴", "🟠", "🟡", "🟡", "🟡"],
        switches: [
          { value: "1★", "effect": "Inflict 1 wound to your target" }
        ]
      },
      {
        members: "2-",
        dice: ["🟠", "🟠", "🟡", "🟡", "🟡"],
        switches: [
          { value: "1★", "effect": "Inflict 1 wound to your target" }
        ]
      }
    ],
    defenses: [
      {
        dice: ["🟢", "🔵", "🛡"],
        switches: [
          { value: "1!", "effect": "Add 🛡 to your roll" }
        ]
      },
      {
        dice: ["🟢", "🛡"],
        switches: [
          { value: "1!", "effect": "Add 🛡 to your roll" }
        ]
      }
    ],
    abilities: {
      passive: "Point-Blank: Add 1 ⭐ to your ranged attack against units within 8 strides. If you inflict at least 1 ❗, your target receives the frightened state.",
      command: "Pavise: When you are the target of a ranged attack, add 1 🛡 to your defense roll. You may repeat a die from your defense roll."
    },
    imageUrl: "/art/card/black_legion_arquebusiers_card.jpg"
  }
];
