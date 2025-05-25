
import { Unit } from "@/types/army";
import { vercana } from "./characters/vercana";

export const scionsOfYaldabaothCharacters: Unit[] = [
  {
    id: "overseer",
    name: "Overseer",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Red Cap", description: "Red Cap race" },
      { name: "Join (Gobblers, Bugbowls, Osseous)", description: "Can join Gobblers, Bugbowls, or Osseous units" }
    ],
    highCommand: false,
    availability: 1,
    command: 2,
    specialRules: ["Shove (4)", "Slowed", "Place (10)"],
    imageUrl: "/art/card/overseer_card.jpg"
  },
  {
    id: "puppeteer",
    name: "Puppeteer",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Darkminded", description: "Darkminded trait" },
      { name: "Elf", description: "Elf race" },
      { name: "Dispel (BLU)", description: "Can dispel BLU effects" },
      { name: "Spellcaster", description: "Can cast spells" },
      { name: "Join (Risen)", description: "Can join Risen units" }
    ],
    highCommand: false,
    availability: 1,
    command: 2,
    specialRules: ["Place (5)"],
    imageUrl: "/art/card/puppeteer_card.jpg"
  },
  {
    id: "rumpy-ride",
    name: "Rumpy Ride",
    pointsCost: 45,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Red Cap", description: "Red Cap race" },
      { name: "Dispel (BLU, BLK)", description: "Can dispel BLU and BLK effects" },
      { name: "Elite", description: "Elite unit" },
      { name: "Join (Red Caps, Infantry, Spellcaster)", description: "Can join Red Caps, Infantry, or Spellcaster units" }
    ],
    highCommand: false,
    availability: 1,
    command: 2,
    imageUrl: "/art/card/rumpy_ride_card.jpg"
  },
  {
    id: "aodharu",
    name: "Aodharu",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Risen", description: "Reanimated unit" },
      { name: "Bloodlust", description: "Gains bonuses from killing" },
      { name: "Dispel (BLK, BLK)", description: "Can dispel multiple BLK effects" },
      { name: "Golem", description: "Artificial construct" },
      { name: "Intimidating (2)", description: "Causes strong fear in nearby enemies" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened"],
    imageUrl: "/art/card/aodharu_card.jpg"
  },
  {
    id: "feadhalu",
    name: "Feadhalu",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Ambusher", description: "Can ambush enemy units" },
      { name: "Dispel (BLK)", description: "Can dispel BLK effects" },
      { name: "Golem", description: "Artificial construct" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened", "Place (7)"],
    imageUrl: "/art/card/feadhalu_card.jpg"
  },
  {
    id: "harvester",
    name: "Harvester",
    pointsCost: 40,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Risen", description: "Reanimated unit" },
      { name: "Elf", description: "Elf race" },
      { name: "Dispel (BLK)", description: "Can dispel BLK effects" },
      { name: "Golem", description: "Artificial construct" },
      { name: "Intimidating (2)", description: "Causes strong fear in nearby enemies" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Frightened"],
    imageUrl: "/art/card/harvester_card.jpg"
  },
  {
    id: "namaoin",
    name: "Namaoin",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Darkminded", description: "Darkminded trait" },
      { name: "Elf", description: "Elf race" },
      { name: "Fog", description: "Fog element" },
      { name: "Ambusher", description: "Can ambush enemy units" },
      { name: "Dispel (BLK, BLK)", description: "Can dispel multiple BLK effects" },
      { name: "Spellcaster", description: "Can cast spells" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Vulnerable", "Frightened", "Impassable"],
    imageUrl: "/art/card/namaoin_card.jpg"
  },
  {
    id: "needle",
    name: "Needle",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Darkminded", description: "Darkminded trait" },
      { name: "Elf", description: "Elf race" },
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Dispel (BLU, BLK)", description: "Can dispel BLU and BLK effects" },
      { name: "Join (Living Flesh, Dead Flesh)", description: "Can join Living Flesh or Dead Flesh units" },
      { name: "Spellcaster", description: "Can cast spells" }
    ],
    highCommand: false,
    availability: 3,
    command: 1,
    specialRules: ["Heal", "Frightened"],
    imageUrl: "/art/card/needle_card.jpg"
  },
  {
    id: "orc-husk",
    name: "Orc Husk",
    pointsCost: 10,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Risen", description: "Reanimated unit" },
      { name: "Golem", description: "Artificial construct" },
      { name: "Join (Infantry, Dead Flesh)", description: "Can join Infantry Dead Flesh units" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Vulnerable", "Frightened", "Slowed", "Disarmed"],
    imageUrl: "/art/card/orc_husk_card.jpg"
  },
  {
    id: "sightless",
    name: "Sightless",
    pointsCost: 15,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Red Cap", description: "Red Cap race" },
      { name: "Dispel (BLU)", description: "Can dispel BLU effects" },
      { name: "Join (Red Cap, Infantry)", description: "Can join Red Cap Infantry units" }
    ],
    highCommand: false,
    availability: 3,
    imageUrl: "/art/card/sightless_card.jpg"
  },
  vercana
];
