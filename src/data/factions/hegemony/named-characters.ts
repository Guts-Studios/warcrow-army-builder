import { Unit } from "../../../types/army";

export const hegemonyNamedCharacters: Unit[] = [
  {
    id: "dragoslav-bjelogric",
    name: "Dragoslav Bjelogríc, Drago the Anvil",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "High Command", description: "High Command unit" },
      { name: "Human", description: "Human race" },
      { name: "Bloodlust (Varank)", description: "Has Bloodlust against Varank" },
      { name: "Elite", description: "Elite unit" },
      { name: "Join (Bucklermen | Bulwark)", description: "Can join Bucklermen or Bulwark units" },
    ],
    highCommand: true,
    imageUrl: "/art/card/dragoslav_bjelogric_card.jpg" 
  },
  {
    id: "lady-telia",
    name: "Lady Télia",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Elite", description: "Elite unit" },
      { name: "Scout", description: "Has scouting abilities" },
      { name: "Join (Arquebusiers | Pioneers)", description: "Can join Arquebusiers or Pioneers units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/lady_telia_card.jpg"
  },
  {
    id: "marhael-the-refused",
    name: "Marhael the Refused",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    highCommand: false,
    imageUrl: "/art/card/marhael_the_refused_card.jpg"
  },
  {
    id: "nadezhda-lazard",
    name: "Nadezhda Lazard, Champion of Embersig",
    faction: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Human", description: "Human race" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/nadezhda_lazard_champion_of_embersig_card.jpg"
  },
  {
    id: "amelia-hellbroth",
    name: "Amelia Hellbroth",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "High Command", description: "High Command unit" },
      { name: "Human", description: "Human race" },
      { name: "Elite", description: "Elite unit" },
      { name: "Join (Infantry)", description: "Can join Infantry units" },
    ],
    highCommand: true,
    imageUrl: "/art/card/amelia_hellbroth_card.jpg"
  },
  {
    id: "nayra-caladren",
    name: "Nayra Caladren",
    faction: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "Elite", description: "Elite unit" },
      { name: "Elf", description: "Elf race" },
      { name: "Fearless", description: "Has the Fearless ability" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    highCommand: false,
    imageUrl: "/art/card/nayra_caladren_card.jpg"
  },
  {
    id: "naergon-caladren",
    name: "Naergon Caladren",
    faction: "hegemony-of-embersig",
    pointsCost: 15,
    availability: 1,
    keywords: [
      { name: "Aestari", description: "Aestari race" },
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "Elf", description: "Elf race" },
      { name: "Spellcaster", description: "Can cast spells" },
    ],
    highCommand: false,
    imageUrl: "/art/card/naergon_caladren_card.jpg"
  },
  {
    id: "trabor-slepmund",
    name: "Trabor Slepmund",
    faction: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    keywords: [
      { name: "Character", description: "Character unit type" },
      { name: "Colossal Company", description: "Part of Colossal Company" },
      { name: "Dwarf", description: "Dwarf race" },
      { name: "Ghent", description: "Ghent faction" },
      { name: "Dispel", description: "Can dispel magic" },
      { name: "Join (War Rig)", description: "Can join War Rig units" },
    ],
    highCommand: false,
    imageUrl: "/art/card/trabor_slepmund_card.jpg"
  },
  {
    id: "mk-os-automata",
    name: "MK-OS Automata",
    faction: "hegemony-of-embersig",
    pointsCost: 0,
    availability: 3,
    keywords: [],
    highCommand: false,
    imageUrl: "/art/card/mk-os_automata_card.jpg"
  }
];
