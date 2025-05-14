import { Unit } from "@/types/army";

export const scionsOfYaldabaothCharacters: Unit[] = [
  {
    id: "rumpy-ride",
    name: "Rumpy Ride",
    pointsCost: 45,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Dispel (BLU, BLK)", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Red Caps, Infantry, Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 2,
    imageUrl: "/art/card/rumpy_ride_card.jpg"
  },
  {
    id: "overseer",
    name: "Overseer",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Join (Gobblers, Bugbowls, Osseous)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Shove (4)", "Slowed", "Place (10)"],
    command: 2,
    imageUrl: "/art/card/overseer_card.jpg"
  },
  {
    id: "sightless",
    name: "Sightless",
    pointsCost: 15,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Join (Red Cap, Infantry)", description: "" }
    ],
    highCommand: false,
    availability: 3,
    imageUrl: "/art/card/sightless_card.jpg"
  },
  {
    id: "orc-husk",
    name: "Orc Husk",
    pointsCost: 10,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Golem", description: "" },
      { name: "Join (Infantry, Dead Flesh)", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Vulnerable", "Frightened", "Slowed", "Disarmed"],
    imageUrl: "/art/card/orc_husk_card.jpg"
  },
  {
    id: "harvester",
    name: "Harvester",
    pointsCost: 40,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Elf", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Golem", description: "" },
      { name: "Intimidating (2)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened"],
    command: 1,
    imageUrl: "/art/card/harvester_card.jpg"
  },
  {
    id: "feadhalu",
    name: "Feadhalu",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Living Flesh", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Golem", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened", "Place (7)"],
    imageUrl: "/art/card/feadhalu_card.jpg"
  },
  {
    id: "aodharu",
    name: "Aodharu",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Bloodlust", description: "" },
      { name: "Dispel (BLK, BLK)", description: "" },
      { name: "Golem", description: "" },
      { name: "Intimidating (2)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Frightened"],
    imageUrl: "/art/card/aodharu_card.jpg"
  },
  {
    id: "namaoin",
    name: "Namaoin",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Darkminded", description: "" },
      { name: "Elf", description: "" },
      { name: "Fog", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK, BLK)", description: "" },
      { name: "Spellcaster", description: "" }
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
      { name: "Character", description: "" },
      { name: "Darkminded", description: "" },
      { name: "Elf", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Dispel (BLU, BLK)", description: "" },
      { name: "Join (Living Flesh, Dead Flesh)", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 3,
    specialRules: ["Heal", "Frightened"],
    command: 1,
    imageUrl: "/art/card/needle_card.jpg"
  },
  {
    id: "puppeteer",
    name: "Puppeteer",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Darkminded", description: "" },
      { name: "Elf", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Spellcaster", description: "" },
      { name: "Join (Risen)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Place (5)"],
    command: 2,
    imageUrl: "/art/card/puppeteer_card.jpg"
  },
  {
    id: "progenitor-sculptor",
    name: "Progenitor Sculptor",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" },
      { name: "High Command", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Intimidating (2)", description: "" },
      { name: "Spellcaster", description: "" },
      { name: "Join (Infantry, Living Flesh)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    specialRules: ["Frightened", "Vulnerable", "Dispel (GRN)"],
    command: 2,
    imageUrl: "/art/card/progenitor_sculptor_card.jpg"
  }
];
