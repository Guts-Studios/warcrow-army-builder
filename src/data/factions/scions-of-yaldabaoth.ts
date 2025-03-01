
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
  specialRules: ["Bloodlust", "Shove (5)", "Displace (8)"]
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
  specialRules: ["Frightened", "Slowed"]
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
  specialRules: ["Shove (2)", "Slowed", "Displace (8)"]
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
  specialRules: ["Slowed", "Diplsace (8)"] // Note: There seems to be a typo in "Diplsace" but I'm keeping it as provided
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
  specialRules: ["Vulnerable", "Place (10)"]
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
  availability: 2,
  specialRules: ["Frightened", "Bloodlust", "Repeat a Die"]
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
  availability: 1
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
  specialRules: ["Repeat a Die"]
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
  specialRules: ["Shove (3)", "Displace (3)", "Repeat a Die"]
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
  specialRules: ["Slowed"]
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
  command: 1
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
  specialRules: ["Frightened", "Shove (3)", "Displace (3)"]
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
  specialRules: ["Slowed", "Frightened", "Place", "Displace", "Repeat a Die"]
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
  command: 2
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
  command: 2
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
  availability: 3
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
  specialRules: ["Vulnerable", "Frightened", "Slowed", "Disarmed"]
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
  command: 1
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
  specialRules: ["Frightened", "Place (7)"]
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
  specialRules: ["Frightened"]
};

const namadin: Unit = {
  id: "namadin",
  name: "Namadin",
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
  specialRules: ["Vulnerable", "Frightened", "Impassable"]
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
  command: 1
};

// Named Characters / High Command
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
  command: 3
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
  command: 3
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
  command: 3
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
  namadin,
  needle,
  
  // Named Characters / High Command
  nuada,
  masterKeorl,
  masterNepharim
];
