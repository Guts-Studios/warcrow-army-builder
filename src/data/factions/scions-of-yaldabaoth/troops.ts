
import { Unit } from "@/types/army";

export const scionsOfYaldabaothTroops: Unit[] = [
  {
    id: "flamecobs",
    name: "Flamecobs",
    pointsCost: 20,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Projectile", description: "Has ranged attacks" },
      { name: "Red Cap", description: "Red Cap race" }
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/card/flamecobs_card.jpg"
  },
  {
    id: "osseous",
    name: "Osseous",
    pointsCost: 20,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Red Cap", description: "Red Cap race" },
      { name: "Projectile", description: "Has ranged attacks" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Bloodlust", "Shove (5)", "Displace (8)"],
    imageUrl: "/art/card/osseous_card.jpg"
  },
  {
    id: "stompers",
    name: "Stompers",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Red Cap", description: "Red Cap race" },
      { name: "Favorable Terrain (Rugged)", description: "Gains advantage in rugged terrain" },
      { name: "Intimidating (1)", description: "Causes fear in nearby enemies" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened", "Slowed"],
    imageUrl: "/art/card/stompers_card.jpg"
  },
  {
    id: "bugbowls",
    name: "Bugbowls",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Projectile", description: "Has ranged attacks" },
      { name: "Red Cap", description: "Red Cap race" },
      { name: "Cover (BLU)", description: "Provides cover against BLU damage" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Shove (2)", "Slowed", "Displace (8)"],
    imageUrl: "/art/card/bugbowls_card.jpg"
  },
  {
    id: "gobblers",
    name: "Gobblers",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Projectile", description: "Has ranged attacks" },
      { name: "Red Cap", description: "Red Cap race" },
      { name: "Fearless", description: "Immune to fear effects" },
      { name: "Scout", description: "Can deploy in advanced positions" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Slowed", "Displace (8)"],
    imageUrl: "/art/card/gobblers_card.jpg"
  },
  {
    id: "crucible",
    name: "Crucible",
    pointsCost: 55,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Red Cap", description: "Red Cap race" },
      { name: "Dispel (BLU)", description: "Can dispel BLU effects" },
      { name: "Golem", description: "Artificial construct" },
      { name: "Intimidating (1)", description: "Causes fear in nearby enemies" },
      { name: "Large", description: "Unit is of large size" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Vulnerable", "Place (10)"],
    imageUrl: "/art/card/crucible_card.jpg"
  },
  {
    id: "intact",
    name: "Intact",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Living Flesh", description: "Living unit type" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened", "Bloodlust", "Repeat a Die"],
    imageUrl: "/art/card/intact_card.jpg"
  },
  {
    id: "anointed",
    name: "Anointed",
    pointsCost: 45,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Fearless", description: "Immune to fear effects" },
      { name: "Intimidating (1)", description: "Causes fear in nearby enemies" }
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/card/anointed_card.jpg"
  },
  {
    id: "marked",
    name: "Marked",
    pointsCost: 35,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Living Flesh", description: "Living unit type" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Repeat a Die"],
    imageUrl: "/art/card/marked_card.jpg"
  },
  {
    id: "marked-marksmen",
    name: "Marked Marksmen",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "Human race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Scout", description: "Can deploy in advanced positions" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Shove (3)", "Displace (3)", "Repeat a Die"],
    imageUrl: "/art/card/marked_marksmen_card.jpg"
  },
  {
    id: "husks",
    name: "Husks",
    pointsCost: 15,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Risen", description: "Reanimated unit" },
      { name: "Golem", description: "Artificial construct" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Slowed"],
    imageUrl: "/art/card/husks_card.jpg"
  },
  {
    id: "echoes",
    name: "Echoes",
    pointsCost: 40,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Elf", description: "Elf race" },
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Elite", description: "Elite unit" },
      { name: "Golem", description: "Artificial construct" },
      { name: "Intimidating (1)", description: "Causes fear in nearby enemies" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Impassable", "Immovable"],
    command: 1,
    imageUrl: "/art/card/echoes_card.jpg"
  },
  {
    id: "mornmab",
    name: "Mornmab",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Dispel (BLK)", description: "Can dispel BLK effects" },
      { name: "Golem", description: "Artificial construct" },
      { name: "Large", description: "Unit is of large size" },
      { name: "Intimidating (2)", description: "Causes strong fear in nearby enemies" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened", "Shove (3)", "Displace (3)"],
    imageUrl: "/art/card/mornmab_card.jpg"
  },
  {
    id: "kipleacht",
    name: "Kipleacht",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Ambusher", description: "Can ambush enemy units" },
      { name: "Golem", description: "Artificial construct" },
      { name: "Large", description: "Unit is of large size" },
      { name: "Intimidating (1)", description: "Causes fear in nearby enemies" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Slowed", "Frightened", "Place (5)", "Displace (5)", "Repeat a Die"],
    imageUrl: "/art/card/kipleacht_card.jpg"
  }
];
