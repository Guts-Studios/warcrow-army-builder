import { Unit } from "@/types/army";

export const hegemonyOfEmbersigCharacters: Unit[] = [
  // Nadezhda Lazard, Champion of Embersig - NOT high command
  {
    id: "nadezhda_lazard_champion_of_embersig",
    name: "Nadezhda Lazard, Champion of Embersig",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    highCommand: false,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Infantry)", "Disarmed", "Vulnerable"],
    imageUrl: "/art/card/nadezhda_lazard_champion_of_embersig_card.jpg"
  },
  // Marhael The Refused - NOT high command, regular character
  {
    id: "marhael_the_refused",
    name: "Marhael the Refused",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    highCommand: false,
    command: 1,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
    ],
    specialRules: ["Fearless", "Spellcaster", "Place (11)"],
    imageUrl: "/art/card/marhael_the_refused_card.jpg"
  },
  // Aide
  {
    id: "aide",
    name: "Aide",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    highCommand: false,
    command: 1,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
    ],
    specialRules: ["Fearless", "Spellcaster", "Place (10)"],
    imageUrl: "/art/card/aide_card.jpg"
  },
  // Corporal
  {
    id: "corporal",
    name: "Corporal",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    highCommand: false,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Human, Infantry)"],
    imageUrl: "/art/card/corporal_card.jpg"
  },
  // Frostfire Herald
  {
    id: "frostfire_herald",
    name: "Frostfire Herald",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
    ],
    specialRules: ["Fearless", "Spellcaster", "Slowed", "Impassable"],
    imageUrl: "/art/card/frostfire_herald_card.jpg"
  },
  // Gunnery Corporal
  {
    id: "gunnery_corporal",
    name: "Gunnery Corporal",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 1,
    highCommand: false,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Arquebusiers | Pioneers)", "Repeat a die"],
    imageUrl: "/art/card/gunnery_corporal_card.jpg"
  },
  // War Surgeon
  {
    id: "war_surgeon",
    name: "War Surgeon",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Infantry)"],
    imageUrl: "/art/card/war_surgeon_card.jpg"
  },
  // Lady Télia
  {
    id: "lady_telia",
    name: "Lady Télia",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    highCommand: false,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Elite", description: "" },
      { name: "Scout", description: "" }
    ],
    specialRules: ["Join (Arquebusiers | Pioneers)", "Frightened", "Aim", "Repeat a Die"],
    imageUrl: "/art/card/lady_telia_card.jpg"
  },
  // Nayra Caladren
  {
    id: "nayra_caladren",
    name: "Nayra Caladren",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Elf", description: "" }
    ],
    specialRules: ["Elite", "Fearless", "Spellcaster", "Disarmed", "Slowed", "Vulnerable"],
    imageUrl: "/art/card/nayra_caladren_card.jpg"
  },
  // Naegon Caladren - Updated with correct image path
  {
    id: "naegon_caladren",
    name: "Naegon Caladren",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    highCommand: false,
    command: 1,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Elf", description: "" }
    ],
    specialRules: ["Spellcaster", "Place (5)", "Disarmed", "Displace (5)", "Frightened"],
    imageUrl: "/art/card/naergon_caladren_card.jpg"
  },
  // Trabor Slepmund
  {
    id: "trabor_slepmund",
    name: "Trabor Slepmund",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    highCommand: false,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Dwarf", description: "" },
      { name: "Ghent", description: "" }
    ],
    specialRules: ["Dispel (BLU)", "Join (War Rig)", "Disarmed"],
    imageUrl: "/art/card/trabor_slepmund_card.jpg"
  },
  // Gale Falchion
  {
    id: "gale_falchion",
    name: "Gale Falchion",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Aestari", description: "" },
      { name: "Character", description: "" },
      { name: "Elf", description: "" }
    ],
    specialRules: ["Spellcaster"],
    imageUrl: "/art/card/gale_falchion_card.jpg"
  },
  // Engineer
  {
    id: "engineer",
    name: "Engineer",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Ghent", description: "" },
      { name: "Dwarf", description: "" }
    ],
    specialRules: ["Dispel (BLU)", "Join (Infantry | War Machine)"],
    imageUrl: "/art/card/engineer_card.jpg"
  },
  // Ansera Noighman
  {
    id: "ansera_noighman",
    name: "Ansera Noighman",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Ghent", description: "" },
      { name: "Dwarf", description: "" }
    ],
    specialRules: ["Dispel (BLU)", "Join (Infantry | War Machine)"],
    imageUrl: "/art/card/ansera_noighman_card.jpg"
  },
  // Vercana
  {
    id: "vercana",
    name: "Vercana",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Mercenary", description: "" }
    ],
    specialRules: ["Ambusher", "Place (5)"],
    imageUrl: "/art/card/vercana_card.jpg"
  },
  // Strategos
  {
    id: "strategos",
    name: "Strategos",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 1,
    highCommand: false,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Infantry)"],
    imageUrl: "/art/card/strategos_card.jpg"
  }
];
