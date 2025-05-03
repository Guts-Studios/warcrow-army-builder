
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'es';

type Translations = {
  [key: string]: {
    en: string;
    es: string;
  };
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations: Translations = {
  // Common elements
  appTitle: {
    en: 'Army Builder',
    es: 'Constructor de Ejércitos',
  },
  playMode: {
    en: 'Play Mode',
    es: 'Modo de Juego',
  },
  // Rules page
  rulesTitle: {
    en: 'Rules',
    es: 'Reglas',
  },
  search: {
    en: 'Search',
    es: 'Buscar',
  },
  caseSensitive: {
    en: 'Case sensitive',
    es: 'Distinguir mayúsculas',
  },
  // Landing page
  home: {
    en: 'Home',
    es: 'Inicio',
  },
  buildArmy: {
    en: 'Build Army',
    es: 'Construir Ejército',
  },
  rules: {
    en: 'Rules',
    es: 'Reglas',
  },
  missions: {
    en: 'Missions',
    es: 'Misiones',
  },
  login: {
    en: 'Login',
    es: 'Iniciar Sesión',
  },
  signUp: {
    en: 'Sign Up',
    es: 'Registrarse',
  },
  profile: {
    en: 'Profile',
    es: 'Perfil',
  },
  logout: {
    en: 'Logout',
    es: 'Cerrar Sesión',
  },
  // Army builder
  yourArmy: {
    en: 'Your Army',
    es: 'Tu Ejército',
  },
  totalPoints: {
    en: 'Total Points',
    es: 'Puntos Totales',
  },
  availablePoints: {
    en: 'Available Points',
    es: 'Puntos Disponibles',
  },
  selectFaction: {
    en: 'Select Faction',
    es: 'Seleccionar Facción',
  },
  save: {
    en: 'Save',
    es: 'Guardar',
  },
  delete: {
    en: 'Delete',
    es: 'Eliminar',
  },
  edit: {
    en: 'Edit',
    es: 'Editar',
  },
  cancel: {
    en: 'Cancel',
    es: 'Cancelar',
  },
  // Factions
  hegemony: {
    en: 'Hegemony of Embersig',
    es: 'Hegemonía de Embersig'
  },
  tribes: {
    en: 'Northern Tribes',
    es: 'Tribus del Norte'
  },
  scions: {
    en: 'Scions of Yaldabaoth',
    es: 'Vástagos de Yaldabaoth'
  },
  syenann: {
    en: 'Syenann',
    es: 'Syenann'
  },
  // About page
  aboutUs: {
    en: 'About Us',
    es: 'Sobre Nosotros'
  },
  supportProject: {
    en: 'Support Our Project',
    es: 'Apoya Nuestro Proyecto'
  },
  ourMission: {
    en: 'Our Mission',
    es: 'Nuestra Misión'
  },
  contactUs: {
    en: 'Contact Us',
    es: 'Contáctanos'
  },
  ourSupporters: {
    en: 'Our Supporters',
    es: 'Nuestros Patrocinadores'
  },
  // Activity page
  activityFeed: {
    en: 'Activity Feed',
    es: 'Actividad Reciente'
  },
  allActivity: {
    en: 'All Activity',
    es: 'Toda la Actividad'
  },
  listUpdates: {
    en: 'List Updates',
    es: 'Actualizaciones de Listas'
  },
  friendUpdates: {
    en: 'Friend Updates',
    es: 'Actualizaciones de Amigos'
  },
  backToProfile: {
    en: 'Back to Profile',
    es: 'Volver al Perfil'
  },
  // Play mode
  createGame: {
    en: 'Create Game',
    es: 'Crear Partida'
  },
  joinGame: {
    en: 'Join Game',
    es: 'Unirse a Partida'
  },
  playerName: {
    en: 'Player Name',
    es: 'Nombre del Jugador'
  },
  selectMission: {
    en: 'Select Mission',
    es: 'Seleccionar Misión'
  },
  selectList: {
    en: 'Select List',
    es: 'Seleccionar Lista'
  },
  startGame: {
    en: 'Start Game',
    es: 'Iniciar Partida'
  },
  // Misc
  loading: {
    en: 'Loading...',
    es: 'Cargando...'
  },
  loadingMissions: {
    en: 'Loading missions...',
    es: 'Cargando misiones...'
  },
  loadingMissionDetails: {
    en: 'Loading mission details...',
    es: 'Cargando detalles de la misión...'
  },
  selectMissionToView: {
    en: 'Select a mission to view details',
    es: 'Selecciona una misión para ver detalles'
  },
  noResults: {
    en: 'No results found',
    es: 'No se encontraron resultados'
  },
  error: {
    en: 'Error',
    es: 'Error'
  },
  success: {
    en: 'Success',
    es: 'Éxito'
  },
  comingSoon: {
    en: 'Coming Soon',
    es: 'Próximamente'
  },
  // Mission page specific
  official: {
    en: 'Official',
    es: 'Oficial'
  },
  community: {
    en: 'Community',
    es: 'Comunidad'
  },
  mission: {
    en: 'Mission',
    es: 'Misión'
  },
  missionCard: {
    en: 'Mission Card',
    es: 'Carta de Misión'
  },
  missionCardEnlarged: {
    en: 'Mission Card (Enlarged)',
    es: 'Carta de Misión (Ampliada)'
  },
  missionCreatedBy: {
    en: 'Mission created by',
    es: 'Misión creada por'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Check if there's a saved language preference
  const getSavedLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'es') ? savedLanguage as Language : 'en';
  };

  const [language, setLanguage] = useState<Language>(getSavedLanguage());

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
