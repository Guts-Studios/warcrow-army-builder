
import { armyTranslations } from './army';
import { TranslationsType } from './types';

export const translations: TranslationsType = {
  // App title and basic navigation
  appTitle: {
    en: 'Warcrow Army Builder',
    es: 'Constructor de Ejércitos Warcrow',
    fr: 'Constructeur d\'Armée Warcrow'
  },
  
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
  
  // Common actions
  save: {
    en: 'Save',
    es: 'Guardar',
    fr: 'Enregistrer'
  },
  cancel: {
    en: 'Cancel',
    es: 'Cancelar',
    fr: 'Annuler'
  },
  delete: {
    en: 'Delete',
    es: 'Eliminar',
    fr: 'Supprimer'
  },
  edit: {
    en: 'Edit',
    es: 'Editar',
    fr: 'Modifier'
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
  }
};
