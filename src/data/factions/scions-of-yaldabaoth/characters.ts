
import { Unit } from "@/types/army";

export const scionsOfYaldabaothCharacters: Unit[] = [
  {
    id: "aodharu",
    name: "Aodharu",
    name_es: "Aodharu",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Bloodlust", description: "" },
      { name: "Dispel (BLK BLK)", description: "" },
      { name: "Golem", description: "" },
      { name: "Intimidating (2)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Frightened"],
    tournamentLegal: true,
    imageUrl: "/art/card/aodharu_card.jpg"
  },
  {
    id: "feadhalu",
    name: "Feadhalu",
    name_es: "Feadhalu",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Living Flesh", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Golem", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Frightened", "Place (7)"],
    tournamentLegal: true,
    imageUrl: "/art/card/feadhalu_card.jpg"
  },
  {
    id: "harvester",
    name: "Harvester",
    name_es: "Segador",
    pointsCost: 40,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
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
    command: 1,
    specialRules: ["Frightened"],
    tournamentLegal: true,
    imageUrl: "/art/card/harvester_card.jpg"
  },
  {
    id: "namaoin",
    name: "Namaoin",
    name_es: "Namaoin",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Darkminded", description: "" },
      { name: "Elf", description: "" },
      { name: "Fog", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Dispel (BLK BLK)", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Vulnerable", "Frightened", "Impassable"],
    tournamentLegal: true,
    imageUrl: "/art/card/namaoin_card.jpg"
  },
  {
    id: "needle",
    name: "Needle",
    name_es: "Aguja",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Darkminded", description: "" },
      { name: "Elf", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Dispel (BLU BLK)", description: "" },
      { name: "Join (Living Flesh Dead Flesh)", description: "" },
      { name: "Spellcaster", description: "" }
    ],
    highCommand: false,
    availability: 3,
    command: 1,
    specialRules: ["Heal", "Frightened"],
    tournamentLegal: true,
    imageUrl: "/art/card/needle_card.jpg"
  },
  {
    id: "orc-husk",
    name: "Orc Husk",
    name_es: "Cascara Orco",
    pointsCost: 10,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Golem", description: "" },
      { name: "Join (Infantry Dead Flesh)", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: ["Vulnerable", "Frightened", "Slowed", "Disarmed"],
    tournamentLegal: true,
    imageUrl: "/art/card/orc_husk_card.jpg"
  },
  {
    id: "overseer",
    name: "Overseer",
    name_es: "Capataz",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Join (Gobblers, Bugbowls, Osseous)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 2,
    specialRules: ["Shove (4)", "Slowed", "Place (10)"],
    tournamentLegal: true,
    imageUrl: "/art/card/overseer_card.jpg"
  },
  {
    id: "puppeteer",
    name: "Puppeteer",
    name_es: "Titiritera",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
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
    command: 2,
    specialRules: ["Place (5)"],
    tournamentLegal: true,
    imageUrl: "/art/card/puppeteer_card.jpg"
  },
  {
    id: "rumpy-ride",
    name: "Rumpy Ride",
    name_es: "Cabalgachepas",
    pointsCost: 45,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Dispel (BLU BLK)", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Red Caps Infantry Spellcaster)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 2,
    specialRules: [],
    tournamentLegal: true,
    imageUrl: "/art/card/rumpy_ride_card.jpg"
  },
  {
    id: "sightless",
    name: "Sightless",
    name_es: "Cegaton",
    pointsCost: 15,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Join (Red Cap, Infantry)", description: "" }
    ],
    highCommand: false,
    availability: 3,
    command: 0,
    specialRules: [],
    tournamentLegal: true,
    imageUrl: "/art/card/sightless_card.jpg"
  },
  {
    id: "vercana",
    name: "Vercana",
    name_es: "Vercana",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Mercenary", description: "" },
      { name: "Ambusher", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Place (5)"],
    tournamentLegal: false,
    imageUrl: "/art/card/vercana_card.jpg"
  }
];
