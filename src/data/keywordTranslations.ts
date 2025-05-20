
export interface KeywordTranslation {
  en: string;
  es: string;
  fr: string;
  description_en: string;
  description_es: string;
  description_fr: string;
}

export const keywordTranslations: Record<string, KeywordTranslation> = {
  "Human": {
    en: "Human",
    es: "Humano",
    fr: "Humain",
    description_en: "Members of the human race, the most numerous and adaptable species.",
    description_es: "Miembros de la raza humana, la especie más numerosa y adaptable.",
    description_fr: "Membres de la race humaine, l'espèce la plus nombreuse et adaptable."
  },
  "Infantry": {
    en: "Infantry",
    es: "Infantería",
    fr: "Infanterie",
    description_en: "Ground-based troops that form the backbone of most armies.",
    description_es: "Tropas terrestres que forman la columna vertebral de la mayoría de los ejércitos.",
    description_fr: "Troupes terrestres qui forment l'épine dorsale de la plupart des armées."
  },
  "Character": {
    en: "Character",
    es: "Personaje",
    fr: "Personnage",
    description_en: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities.",
    description_es: "Los personajes son unidades de miniatura única que pueden unirse a unidades aliadas para liderarlas, mejorar sus capacidades o darles habilidades únicas.",
    description_fr: "Les personnages sont des unités de figurines uniques qui peuvent rejoindre des unités alliées pour les diriger, améliorer leurs capacités ou leur donner des capacités uniques."
  },
  "Colossal Company": {
    en: "Colossal Company",
    es: "Compañía Colosal",
    fr: "Compagnie Colossale",
    description_en: "Part of the elite Colossal Company units.",
    description_es: "Parte de las unidades de élite de la Compañía Colosal.",
    description_fr: "Partie des unités d'élite de la Compagnie Colossale."
  }
  // Add more keywords as needed
};
