
import { Unit, Faction } from '@/types/army';

// Faction definitions
export const factions: Faction[] = [
  {
    id: "syenann",
    name: "Sÿenann",
    name_es: "Sÿenann",
    name_fr: "Sÿenann"
  },
  {
    id: "northern-tribes",
    name: "Northern Tribes",
    name_es: "Tribus del Norte",
    name_fr: "Tribus du Nord"
  },
  {
    id: "hegemony-of-embersig",
    name: "Hegemony of Embersig",
    name_es: "Hegemonía de Embersig",
    name_fr: "Hégémonie d'Embersig"
  },
  {
    id: "scions-of-yaldabaoth",
    name: "Scions of Yaldabaoth",
    name_es: "Vástagos de Yaldabaoth",
    name_fr: "Rejetons de Yaldabaoth"
  }
];

// Static unit data generated from CSV files
export const units: Unit[] = [
  // Northern Tribes
  {
    id: "ahlwardt-ice-bear",
    name: "Ahlwardt, Ice Bear",
    name_es: "Ahlwardt, Oso De Hielo",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 60,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Beserker Rage" },
      { name: "Dispel" },
      { name: "Elite" },
      { name: "Join (Skin Changers)" }
    ],
    specialRules: ["Vulnerable"],
    highCommand: true,
    tournamentLegal: true,
    imageUrl: "/art/portrait/ahlwardt_ice_bear_portrait.jpg"
  },
  {
    id: "alborc",
    name: "Alborc",
    name_es: "Alborc",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 50,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Join (Infantry Orc)" },
      { name: "Join (Infantry Varank)" },
      { name: "Elite" }
    ],
    specialRules: ["Vulnerable", "Dispel (D)"],
    highCommand: true,
    tournamentLegal: true,
    imageUrl: "/art/portrait/alborc_portrait.jpg"
  },
  {
    id: "battle-scarred",
    name: "Battle-Scarred",
    name_es: "Cicatrices De Batalla",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Raging" }
    ],
    specialRules: ["Slowed", "Vulnerable", "Frightened", "Disarmed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/battle-scarred_portrait.jpg"
  },
  {
    id: "coal",
    name: "Coal",
    name_es: "Tizon",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 20,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Join (Iriavik)" }
    ],
    specialRules: ["Slowed", "Fix a Die"],
    highCommand: false,
    tournamentLegal: false,
    companion: "iriavik restless pup",
    imageUrl: "/art/portrait/coal_portrait.jpg"
  },
  {
    id: "contender",
    name: "Contender",
    name_es: "Contendiente",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Join (Infantry Orc)" },
      { name: "Raging" }
    ],
    specialRules: ["Vulnerable", "Shove (5)", "Attract (5)"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/contender_portrait.jpg"
  },
  {
    id: "darkmaster",
    name: "Darkmaster",
    name_es: "Amo De La Oscuridad",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Ambusher" },
      { name: "Dispel (BLK BLK)" },
      { name: "Join (Hunters)" }
    ],
    specialRules: ["Scout", "Disarmed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/darkmaster_portrait.jpg"
  },
  {
    id: "eskold-the-executioner",
    name: "Eskold the Executioner",
    name_es: "Eskold El Ejecutor",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Join (Infantry Varank)" },
      { name: "Join (Calvary Warg)" },
      { name: "Elite" }
    ],
    specialRules: [],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/eskold_the_executioner_portrait.jpg"
  },
  {
    id: "evoker",
    name: "Evoker",
    name_es: "Evocador",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Spellcaster" }
    ],
    specialRules: ["Intimidating (X)", "Flee", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/evoker_portrait.jpg"
  },
  {
    id: "hersir",
    name: "Hersir",
    name_es: "Hersir",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Beserker Rage" },
      { name: "Fearless" },
      { name: "Join (Infantry Varank)" }
    ],
    specialRules: ["Disarmed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/hersir_portrait.jpg"
  },
  {
    id: "ice-archers",
    name: "Ice Archers",
    name_es: "Arqueros De Hielo",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Archer" }
    ],
    specialRules: [],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/ice_archers_portrait.jpg"
  },
  {
    id: "iriavik-restless-pup",
    name: "Iriavik restless pup",
    name_es: "Iriavik cachorro inquieto",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 20,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Beast" },
      { name: "Join (Infantry Orc)" }
    ],
    specialRules: ["Beast", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/iriavik_restless_pup_portrait.jpg"
  },
  {
    id: "lotta",
    name: "Lotta",
    name_es: "Lotta",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Ambusher" },
      { name: "Join (Hunters)" },
      { name: "Archer" },
      { name: "Sniper" }
    ],
    specialRules: ["Flee", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/lotta_portrait.jpg"
  },
  {
    id: "mounted-wrathmane",
    name: "Mounted Wrathmane",
    name_es: "Wrathmane Montado",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 50,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Devastating Charge" },
      { name: "Command Attack" }
    ],
    specialRules: ["Disarmed", "Beast"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/mounted_wrathmane_portrait.jpg"
  },
  {
    id: "njord-the-merciless",
    name: "Njord the Merciless",
    name_es: "Njord El Despiadado",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 45,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Join (Infantry Varank)" },
      { name: "Elite" }
    ],
    specialRules: ["Elite", "Vulnerable"],
    highCommand: true,
    tournamentLegal: true,
    imageUrl: "/art/portrait/njord_the_merciless_portrait.jpg"
  },
  {
    id: "orc-hunters",
    name: "Orc Hunters",
    name_es: "Cazadores Orcos",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 30,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Ambusher" },
      { name: "Archer" }
    ],
    specialRules: ["Scout", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/orc_hunters_portrait.jpg"
  },
  {
    id: "ormuk",
    name: "Ormuk",
    name_es: "Ormuk",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Join (Infantry Orc)" },
      { name: "Elite" }
    ],
    specialRules: ["Vulnerable", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/ormuk_portrait.jpg"
  },
  {
    id: "prime-warrior",
    name: "Prime Warrior",
    name_es: "Guerrero Supremo",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Join (Infantry Varank)" },
      { name: "Elite" }
    ],
    specialRules: ["Elite", "Vulnerable"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/prime_warrior_portrait.jpg"
  },
  {
    id: "revenant",
    name: "Revenant",
    name_es: "Aparecido",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Join (Infantry Orc)" },
      { name: "Undead" },
      { name: "Spellcaster" }
    ],
    specialRules: ["Undead", "Slowed", "Flee"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/revenant_portrait.jpg"
  },
  {
    id: "selika",
    name: "Selika",
    name_es: "Selika",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Archer" },
      { name: "Join (Archers)" },
      { name: "Sniper" }
    ],
    specialRules: ["Flee", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/selika_portrait.jpg"
  },
  {
    id: "skin-changers",
    name: "Skin Changers",
    name_es: "Cambiadores De Piel",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 40,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Transformation" },
      { name: "Beast" }
    ],
    specialRules: ["Beast", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/skin_changers_portrait.jpg"
  },
  {
    id: "tattooist",
    name: "Tattooist",
    name_es: "Tatuador",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Join (Infantry Orc)" },
      { name: "Spellcaster" }
    ],
    specialRules: ["Spellcaster", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/tattooist_portrait.jpg"
  },
  {
    id: "tundra-marauders",
    name: "Tundra Marauders",
    name_es: "Merodeadores De La Tundra",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 35,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Raging" }
    ],
    specialRules: ["Vulnerable", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/tundra_marauders_portrait.jpg"
  },
  {
    id: "warg-riders",
    name: "Warg Riders",
    name_es: "Jinetes De Warg",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 45,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Beast" },
      { name: "Command Attack" }
    ],
    specialRules: ["Beast", "Disarmed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/warg_riders_portrait.jpg"
  },
  {
    id: "wisemane",
    name: "Wisemane",
    name_es: "Wisemane",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Join (Infantry Varank)" },
      { name: "Spellcaster" }
    ],
    specialRules: ["Spellcaster", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/wisemane_portrait.jpg"
  },
  {
    id: "wrathmane",
    name: "Wrathmane",
    name_es: "Wrathmane",
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    pointsCost: 25,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Beast" },
      { name: "Join (Infantry Varank)" }
    ],
    specialRules: ["Beast", "Disarmed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/wrathmane_portrait.jpg"
  },
  // Hegemony of Embersig
  {
    id: "aide",
    name: "Aide",
    name_es: "Ayudante",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Support" }
    ],
    specialRules: ["Support"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/aide_portrait.jpg"
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    name_es: "Arcabuceros Legion Negra",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 45,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Gunner" },
      { name: "Formation" }
    ],
    specialRules: [],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/black_legion_arquebusiers_portrait.jpg"
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    name_es: "Escuderos Legion Negra",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Shield Wall" },
      { name: "Formation" }
    ],
    specialRules: [],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/black_legion_bucklermen_portrait.jpg"
  },
  {
    id: "corporal",
    name: "Corporal",
    name_es: "Cabo",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Elite" }
    ],
    specialRules: ["Elite", "Vulnerable"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/corporal_portrait.jpg"
  },
  {
    id: "engineer",
    name: "Engineer",
    name_es: "Ingeniero",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Support" }
    ],
    specialRules: ["Support"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/engineer_portrait.jpg"
  },
  {
    id: "frostfire-herald",
    name: "Frostfire Herald",
    name_es: "Heraldo Escarchafuego",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Spellcaster" }
    ],
    specialRules: ["Spellcaster", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/frostfire_herald_portrait.jpg"
  },
  {
    id: "gale-falchion",
    name: "Gale Falchion",
    name_es: "Alfanje Vendaval",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Elite" }
    ],
    specialRules: ["Elite", "Vulnerable"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/gale_falchion_portrait.jpg"
  },
  {
    id: "grand-captain",
    name: "Grand Captain",
    name_es: "Gran Capitan",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 50,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Elite" }
    ],
    specialRules: ["Elite", "Vulnerable"],
    highCommand: true,
    tournamentLegal: true,
    imageUrl: "/art/portrait/grand_captain_portrait.jpg"
  },
  {
    id: "gunnery-corporal",
    name: "Gunnery Corporal",
    name_es: "Cabo Artillero",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Join (Gunner)" },
      { name: "Elite" }
    ],
    specialRules: ["Elite", "Vulnerable"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/gunnery_corporal_portrait.jpg"
  },
  {
    id: "lady-telia",
    name: "Lady Telia",
    name_es: "Lady Telia",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 45,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Elite" }
    ],
    specialRules: ["Elite", "Vulnerable"],
    highCommand: true,
    tournamentLegal: true,
    imageUrl: "/art/portrait/lady_telia_portrait.jpg"
  },
  {
    id: "marhael-the-refused",
    name: "Marhael the Refused",
    name_es: "Marhael El Rechazado",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Undead" }
    ],
    specialRules: ["Undead", "Slowed"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/marhael_the_refused_portrait.jpg"
  },
  {
    id: "nadezhda-lazard-champion-of-embersig",
    name: "Nadezhda Lazard Champion of Embersig",
    name_es: "Nadezhda Lazard Campeon De Embersig",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 55,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Elite" }
    ],
    specialRules: ["Elite", "Vulnerable"],
    highCommand: true,
    tournamentLegal: true,
    imageUrl: "/art/portrait/nadezhda_lazard_champion_of_embersig_portrait.jpg"
  },
  {
    id: "pioneers",
    name: "Pioneers",
    name_es: "Pioneros",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 2,
    command: 0,
    keywords: [
      { name: "Engineer" },
      { name: "Support" }
    ],
    specialRules: ["Support"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/pioneers_portrait.jpg"
  },
  {
    id: "strategos",
    name: "Strategos",
    name_es: "Estratego",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Elite" }
    ],
    specialRules: ["Elite", "Vulnerable"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/strategos_portrait.jpg"
  },
  {
    id: "war-surgeon",
    name: "War Surgeon",
    name_es: "Cirujano De Guerra",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Join (Infantry Human)" },
      { name: "Support" }
    ],
    specialRules: ["Support"],
    highCommand: false,
    tournamentLegal: true,
    imageUrl: "/art/portrait/war_surgeon_portrait.jpg"
  }
];
