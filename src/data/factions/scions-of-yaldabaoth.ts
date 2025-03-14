import { Unit } from "@/types/army";

// Troops
const flamecobs: Unit = {
  id: "flamecobs",
  name: "Flamecobs",
  pointsCost: 20,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Projectile", description: "" },
    { name: "Red Cap", description: "" }
  ],
  highCommand: false,
  availability: 1,
  imageUrl: "/art/card/flamecobs_card.jpg"
};

const osseous: Unit = {
  id: "osseous",
  name: "Osseous",
  pointsCost: 20,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Projectile", description: "" },
    { name: "Red Cap", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Bloodlust", "Shove (5)", "Displace (8)"],
  imageUrl: "/art/card/osseous_card.jpg"
};

const stompers: Unit = {
  id: "stompers",
  name: "Stompers",
  pointsCost: 25,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Projectile", description: "" },
    { name: "Red Cap", description: "" },
    { name: "Favorable Terrain (Rugged)", description: "" },
    { name: "Intimidating (1)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Frightened", "Slowed"],
  imageUrl: "/art/card/stompers_card.jpg"
};

const bugbowls: Unit = {
  id: "bugbowls",
  name: "Bugbowls",
  pointsCost: 30,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Projectile", description: "" },
    { name: "Red Cap", description: "" },
    { name: "Cover (BLU)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Shove (2)", "Slowed", "Displace (8)"],
  imageUrl: "/art/card/bugbowls_card.jpg"
};

const gobblers: Unit = {
  id: "gobblers",
  name: "Gobblers",
  pointsCost: 30,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Infantry", description: "" },
    { name: "Projectile", description: "" },
    { name: "Red Cap", description: "" },
    { name: "Fearless", description: "" },
    { name: "Scout", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Slowed", "Diplsace (8)"],
  imageUrl: "/art/card/gobblers_card.jpg"
};

const crucible: Unit = {
  id: "crucible",
  name: "Crucible",
  pointsCost: 55,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Red Cap", description: "" },
    { name: "Dispel (BLU)", description: "" },
    { name: "Golem", description: "" },
    { name: "Intimidating (1)", description: "" },
    { name: "Large", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Vulnerable", "Place (10)"],
  imageUrl: "/art/card/crucible_card.jpg"
};

const intact: Unit = {
  id: "intact",
  name: "Intact",
  pointsCost: 25,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Human", description: "" },
    { name: "Infantry", description: "" },
    { name: "Living Flesh", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Frightened", "Bloodlust", "Repeat a Die"],
  imageUrl: "/art/card/intact_card.jpg"
};

const anointed: Unit = {
  id: "anointed",
  name: "Anointed",
  pointsCost: 45,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Human", description: "" },
    { name: "Infantry", description: "" },
    { name: "Living Flesh", description: "" },
    { name: "Fearless", description: "" },
    { name: "Intimidating (1)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  imageUrl: "/art/card/anointed_card.jpg"
};

const marked: Unit = {
  id: "marked",
  name: "Marked",
  pointsCost: 35,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Human", description: "" },
    { name: "Infantry", description: "" },
    { name: "Living Flesh", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Repeat a Die"],
  imageUrl: "/art/card/marked_card.jpg"
};

const markedMarksmen: Unit = {
  id: "marked-marksmen",
  name: "Marked Marksmen",
  pointsCost: 25,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Human", description: "" },
    { name: "Infantry", description: "" },
    { name: "Living Flesh", description: "" },
    { name: "Scout", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Shove (3)", "Displace (3)", "Repeat a Die"],
  imageUrl: "/art/card/marked_marksmen_card.jpg"
};

const husks: Unit = {
  id: "husks",
  name: "Husks",
  pointsCost: 15,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Dead Flesh", description: "" },
    { name: "Risen", description: "" },
    { name: "Golem", description: "" }
  ],
  highCommand: false,
  availability: 2,
  specialRules: ["Slowed"],
  imageUrl: "/art/card/husks_card.jpg"
};

const echoes: Unit = {
  id: "echoes",
  name: "Echoes",
  pointsCost: 40,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Elf", description: "" },
    { name: "Infantry", description: "" },
    { name: "Elite", description: "" },
    { name: "Golem", description: "" },
    { name: "Intimidating (1)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Impassable", "Immovable"],
  command: 1,
  imageUrl: "/art/card/echoes_card.jpg"
};

const mornmab: Unit = {
  id: "mornmab",
  name: "Mornmab",
  pointsCost: 50,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Living Flesh", description: "" },
    { name: "Dispel (BLK)", description: "" },
    { name: "Golem", description: "" },
    { name: "Large", description: "" },
    { name: "Intimidating (2)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Frightened", "Shove (3)", "Displace (3)"],
  imageUrl: "/art/card/mornmab_card.jpg"
};

const kipleacht: Unit = {
  id: "kipleacht",
  name: "Kipleacht",
  pointsCost: 30,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Living Flesh", description: "" },
    { name: "Ambusher", description: "" },
    { name: "Golem", description: "" },
    { name: "Large", description: "" },
    { name: "Intimidating (1)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  specialRules: ["Slowed", "Frightened", "Place", "Displace", "Repeat a Die"],
  imageUrl: "/art/card/kipleacht_card.jpg"
};

// Characters
const rumpyRide: Unit = {
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
};

const overseer: Unit = {
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
};

const sightless: Unit = {
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
};

const orcHusk: Unit = {
  id: "orc-husk",
  name: "Orc Husk",
  pointsCost: 10,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Dead Flesh", description: "" },
    { name: "Risen", description: "" },
    { name: "Golem", description: "" },
    { name: "Join (Infantry, Dead Flesh)", description: "" }
  ],
  highCommand: false,
  availability: 2,
  specialRules: ["Vulnerable", "Frightened", "Slowed", "Disarmed"],
  imageUrl: "/art/card/orc_husk_card.jpg"
};

const harvester: Unit = {
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
};

const feadhalu: Unit = {
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
};

const aodharu: Unit = {
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
};

const namaoin: Unit = {
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
};

const needle: Unit = {
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
};

const puppeteer: Unit = {
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
};

const progenitorSculptor: Unit = {
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
};

const nuada: Unit = {
  id: "nuada",
  name: "Nuada",
  pointsCost: 55,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Alven", description: "" },
    { name: "Character", description: "" },
    { name: "Elf", description: "" },
    { name: "High Commander", description: "" },
    { name: "Elite", description: "" }
  ],
  highCommand: true,
  availability: 1,
  specialRules: ["Heal", "Bloodlust", "Fearless", "Slowed"],
  command: 3,
  imageUrl: "/art/card/nuada_card.jpg"
};

const masterKeorl: Unit = {
  id: "master-keorl",
  name: "Master Keorl",
  pointsCost: 50,
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
  command: 3,
  imageUrl: "/art/card/master_keorl_card.jpg"
};

const masterNepharim: Unit = {
  id: "master-nepharim",
  name: "Master Nepharim",
  pointsCost: 50,
  faction: "scions-of-yaldabaoth",
  keywords: [
    { name: "Character", description: "" },
    { name: "Dead Flesh", description: "" },
    { name: "Darkminded", description: "" },
    { name: "Elf", description: "" },
    { name: "High Command", description: "" },
    { name: "Intimidating (2)", description: "" },
    { name: "Spellcaster", description: "" },
    { name: "Join (Infantry, Dead Flesh)", description: "" }
  ],
  highCommand: true,
  availability: 1,
  specialRules: ["Place (5)"],
  command: 3,
  imageUrl: "/art/card/master_nepharim_card.jpg"
};

// Export all units for this faction
export const scionsOfYaldabaothUnits: Unit[] = [
  // Troops
  flamecobs,
  osseous,
  stompers,
  bugbowls,
  gobblers,
  crucible,
  intact,
  anointed,
  marked,
  markedMarksmen,
  husks,
  echoes,
  mornmab,
  kipleacht,
  
  // Characters
  rumpyRide,
  overseer,
  sightless,
  orcHusk,
  harvester,
  feadhalu,
  aodharu,
  namaoin,
  needle,
  puppeteer,
  progenitorSculptor,
  
  // Named Characters / High Command
  nuada,
  masterKeorl,
  masterNepharim
];
