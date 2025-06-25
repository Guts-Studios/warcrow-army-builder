
import { Unit } from "@/types/army";

export const scionsOfYaldabaothTroops: Unit[] = [
  {
    id: "anointed",
    name: "Anointed",
    name_es: "Ungidos",
    pointsCost: 45,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Fearless", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    tournamentLegal: true,
    imageUrl: "/art/card/anointed_card.jpg"
  },
  {
    id: "bugbowls",
    name: "Bugbowls",
    name_es: "Bichos Bola",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Cover (BLU)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Shove (2)", "Slowed", "Displace (8)"],
    tournamentLegal: true,
    imageUrl: "/art/card/bugbowls_card.jpg"
  },
  {
    id: "crucible",
    name: "Crucible",
    name_es: "Crisol",
    pointsCost: 55,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Red Cap", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Golem", description: "" },
      { name: "Intimidating (1)", description: "" },
      { name: "Large", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Vulnerable", "Place (10)"],
    tournamentLegal: true,
    imageUrl: "/art/card/crucible_card.jpg"
  },
  {
    id: "echoes",
    name: "Echoes",
    name_es: "Ecos",
    pointsCost: 40,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Elf", description: "" },
      { name: "Infantry", description: "" },
      { name: "Elite", description: "" },
      { name: "Golem", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 1,
    specialRules: ["Impassable", "Immovable"],
    tournamentLegal: true,
    imageUrl: "/art/card/echoes_card.jpg"
  },
  {
    id: "flamecobs",
    name: "Flamecobs",
    name_es: "Llameantes",
    pointsCost: 20,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: [],
    tournamentLegal: true,
    imageUrl: "/art/card/flamecobs_card.jpg"
  },
  {
    id: "gobblers",
    name: "Gobblers",
    name_es: "Engullidores",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Fearless", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed", "Diplsace (8)"],
    tournamentLegal: true,
    imageUrl: "/art/card/gobblers_card.jpg"
  },
  {
    id: "husks",
    name: "Husks",
    name_es: "Cascaras",
    pointsCost: 15,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Golem", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: ["Slowed"],
    tournamentLegal: true,
    imageUrl: "/art/card/husks_card.jpg"
  },
  {
    id: "intact",
    name: "Intact",
    name_es: "Intactos",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: ["Frightened", "Bloodlust", "Repeat a Die"],
    tournamentLegal: true,
    imageUrl: "/art/card/intact_card.jpg"
  },
  {
    id: "kipleacht",
    name: "Kipleacht",
    name_es: "Kipleacht",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Living Flesh", description: "" },
      { name: "Ambusher", description: "" },
      { name: "Golem", description: "" },
      { name: "Large", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Slowed", "Frightened", "Place", "Displace", "Repeat a Die"],
    tournamentLegal: true,
    imageUrl: "/art/card/kipleacht_card.jpg"
  },
  {
    id: "marked",
    name: "Marked",
    name_es: "Marcados",
    pointsCost: 35,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Repeat a Die"],
    tournamentLegal: true,
    imageUrl: "/art/card/marked_card.jpg"
  },
  {
    id: "marked-marksmen",
    name: "Marked Marksmen",
    name_es: "Marcados Tiradores",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Shove (3)", "Displace (3)", "Repeat a Die"],
    tournamentLegal: true,
    imageUrl: "/art/card/marked_marksmen_card.jpg"
  },
  {
    id: "mornmab",
    name: "Mornmab",
    name_es: "Mornmab",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Living Flesh", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Golem", description: "" },
      { name: "Large", description: "" },
      { name: "Intimidating (2)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Frightened", "Shove (3)", "Displace (3)"],
    tournamentLegal: true,
    imageUrl: "/art/card/mornmab_card.jpg"
  },
  {
    id: "osseous",
    name: "Osseous",
    name_es: "Huesudos",
    pointsCost: 20,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Bloodlust", "Shove (5)", "Displace (8)"],
    tournamentLegal: true,
    imageUrl: "/art/card/osseous_card.jpg"
  },
  {
    id: "stompers",
    name: "Stompers",
    name_es: "Pisadores",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Projectile", description: "" },
      { name: "Red Cap", description: "" },
      { name: "Favorable Terrain (Rugged)", description: "" },
      { name: "Intimidating (1)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Frightened", "Slowed"],
    tournamentLegal: true,
    imageUrl: "/art/card/stompers_card.jpg"
  }
];
