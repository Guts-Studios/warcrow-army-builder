
export interface SpecialRuleTranslation {
  en: string;
  es: string;
  fr: string;
  description_en: string;
  description_es: string;
  description_fr: string;
}

export const specialRuleTranslations: Record<string, SpecialRuleTranslation> = {
  "Place": {
    en: "Place",
    es: "Colocar",
    fr: "Placer",
    description_en: "Allows a unit to be placed anywhere on the battlefield within the specified distance.",
    description_es: "Permite que una unidad se coloque en cualquier lugar del campo de batalla dentro de la distancia especificada.",
    description_fr: "Permet à une unité d'être placée n'importe où sur le champ de bataille dans la distance spécifiée."
  },
  "Shove": {
    en: "Shove",
    es: "Empujar",
    fr: "Bousculer",
    description_en: "Pushes enemy units back by the specified distance.",
    description_es: "Empuja a las unidades enemigas hacia atrás a la distancia especificada.",
    description_fr: "Repousse les unités ennemies de la distance spécifiée."
  },
  "Vulnerable": {
    en: "Vulnerable",
    es: "Vulnerable",
    fr: "Vulnérable",
    description_en: "The unit takes additional damage from attacks.",
    description_es: "La unidad recibe daño adicional de los ataques.",
    description_fr: "L'unité subit des dégâts supplémentaires des attaques."
  },
  "Disarmed": {
    en: "Disarmed",
    es: "Desarmado",
    fr: "Désarmé",
    description_en: "The unit cannot make attacks this turn.",
    description_es: "La unidad no puede realizar ataques en este turno.",
    description_fr: "L'unité ne peut pas effectuer d'attaques ce tour-ci."
  }
  // Add more special rules as needed
};
