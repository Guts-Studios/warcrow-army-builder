
import { Unit } from "@/types/army";
import { vercana } from "./vercana";

export const hegemonyOfEmbersigCharacters: Unit[] = [
  vercana,
  {
    id: "marhael-the-refused",
    name: "Marhael The Refused",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 45,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Mercenary", description: "" }
    ],
    specialRules: ["Stubborn"],
    imageUrl: "/art/card/marhael_the_refused_card.jpg"
  },
  {
    id: "trabor-slepmund",
    name: "Trabor Slepmund",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 50,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Engineer", description: "" }
    ],
    specialRules: ["Inventor"],
    imageUrl: "/art/card/trabor_slepmund_card.jpg"
  }
];
