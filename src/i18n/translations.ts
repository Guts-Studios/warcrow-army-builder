
import { armyTranslations } from './army';
import { landingTranslations } from './landing';
import { commonTranslations } from './common';
import { uiTranslations } from './ui';
import { faqTranslations } from './faq';
import { unitsTranslations } from './units';
import { missionTranslations } from './missions';
import { TranslationsType } from './types';

export const translations: TranslationsType = {
  // App title and basic navigation
  appTitle: {
    en: 'Warcrow Army Builder',
    es: 'Constructor de Ejércitos Warcrow',
    fr: 'Constructeur d\'Armée Warcrow'
  },
  
  // Import all common translations
  ...commonTranslations,
  
  // Import UI translations
  ...uiTranslations,
  
  // Import FAQ translations
  ...faqTranslations,
  
  // Import units translations
  ...unitsTranslations,
  
  // Import mission translations
  ...missionTranslations,
  
  // Landing page translations
  ...landingTranslations,
  
  // Army builder specific translations
  ...Object.fromEntries(
    Object.entries(armyTranslations).map(([key, value]) => [`army.${key}`, value])
  ),
  
  // Direct army translations without prefix for backward compatibility
  ...armyTranslations,

  // Navigation and common UI
  home: {
    en: 'Home',
    es: 'Inicio',
    fr: 'Accueil'
  },
  rules: {
    en: 'Rules',
    es: 'Reglas',
    fr: 'Règles'
  },
  rulesTitle: {
    en: 'Rules',
    es: 'Reglas',
    fr: 'Règles'
  },
  faq: {
    en: 'FAQ',
    es: 'Preguntas Frecuentes',
    fr: 'FAQ'
  },
  about: {
    en: 'About',
    es: 'Acerca de',
    fr: 'À propos'
  },
  profile: {
    en: 'Profile',
    es: 'Perfil',
    fr: 'Profil'
  },
  login: {
    en: 'Login',
    es: 'Iniciar Sesión',
    fr: 'Connexion'
  },
  logout: {
    en: 'Logout',
    es: 'Cerrar Sesión',
    fr: 'Déconnexion'
  },
  
  // Missing keys that are causing console warnings
  prepareTheGame: {
    en: 'Prepare the Game',
    es: 'Preparar el Juego',
    fr: 'Préparer le Jeu'
  },
  supportUs: {
    en: 'Support Us',
    es: 'Apóyanos',
    fr: 'Soutenez-nous'
  },
  
  // Unit and army related
  points: {
    en: 'points',
    es: 'puntos',
    fr: 'points'
  },
  unitCard: {
    en: 'Unit Card',
    es: 'Tarjeta de Unidad',
    fr: 'Carte d\'Unité'
  },

  // Missing translations that might be needed elsewhere
  logoAlt: {
    en: 'Warcrow Logo',
    es: 'Logo de Warcrow',
    fr: 'Logo Warcrow'
  },
  testersOnly: {
    en: 'Testers Only',
    es: 'Solo para Probadores',
    fr: 'Testeurs Seulement'
  },
  testersOnlyDescription: {
    en: 'This feature is only available to testers.',
    es: 'Esta función solo está disponible para probadores.',
    fr: 'Cette fonctionnalité n\'est disponible que pour les testeurs.'
  },
  haveFeedback: {
    en: 'Have feedback or found a bug?',
    es: '¿Tienes comentarios o encontraste un error?',
    fr: 'Vous avez des commentaires ou avez trouvé un bug?'
  },
  contactEmail: {
    en: 'warcrowarmy@gmail.com',
    es: 'warcrowarmy@gmail.com',
    fr: 'warcrowarmy@gmail.com'
  }
};
