import { Unit } from "../../../types/army";

export const hegemonyNamedCharacters: Unit[] = [
  {
    id: "dragoslav-bjelogric",
    name: "Dragoslav Bjelogríc",
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
    imageUrl: "/src/art/card/Dragosla_Bjelogríc_drago_the_anvil_card.jpg"
  }
];