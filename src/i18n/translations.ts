
type Translation = {
  en: string;
  es: string;
};

type TranslationsType = {
  [key: string]: Translation;
};

export const translations: TranslationsType = {
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
  },
  // New landing page translations
  welcomeMessage: {
    en: 'Welcome to Warcrow Army Builder',
    es: 'Bienvenido al Constructor de Ejércitos de Warcrow'
  },
  version: {
    en: 'Version',
    es: 'Versión'
  },
  appDescription: {
    en: 'Create and manage your Warcrow army lists with ease.',
    es: 'Crea y gestiona tus listas de ejército de Warcrow con facilidad.'
  },
  loadingUserCount: {
    en: 'Loading user count...',
    es: 'Cargando conteo de usuarios...'
  },
  userCountMessage: {
    en: 'Currently serving {count} users and growing!',
    es: '¡Actualmente sirviendo a {count} usuarios y creciendo!'
  },
  inDevelopment: {
    en: 'Still in Development!',
    es: '¡Todavía en Desarrollo!'
  },
  recentNews: {
    en: 'News 4/30: New community missions added! Check out "Breached Front" and "Battle Lines" created by community member Anthony Pham. We\'re also smoothing out Play Mode and fixing rules issues. More updates coming soon!',
    es: 'Noticias 4/30: ¡Nuevas misiones comunitarias añadidas! Echa un vistazo a "Frente Violado" y "Líneas de Batalla" creadas por el miembro de la comunidad Anthony Pham. También estamos perfeccionando el Modo de Juego y arreglando problemas de reglas. ¡Más actualizaciones próximamente!'
  },
  signedAsGuest: {
    en: 'Signed in as Guest',
    es: 'Conectado como Invitado'
  },
  signOut: {
    en: 'Sign Out',
    es: 'Cerrar Sesión'
  },
  buyCoffee: {
    en: 'Buy us Coffee!',
    es: '¡Invítanos a un Café!'
  },
  viewChangelog: {
    en: 'View Changelog',
    es: 'Ver Registro de Cambios'
  },
  changelog: {
    en: 'Changelog',
    es: 'Registro de Cambios'
  },
  testersOnly: {
    en: 'Testers Only',
    es: 'Solo para Probadores'
  },
  testersOnlyDescription: {
    en: 'This feature is currently only available to testers. Please contact us if you\'d like to become a tester.',
    es: 'Esta función actualmente solo está disponible para probadores. Contáctanos si deseas convertirte en probador.'
  },
  haveFeedback: {
    en: 'Have ideas, issues, love, or hate to share?',
    es: '¿Tienes ideas, problemas, comentarios positivos o negativos para compartir?'
  },
  contactEmail: {
    en: 'Contact us at warcrowarmy@gmail.com',
    es: 'Contáctanos en warcrowarmy@gmail.com'
  },
  footerText: {
    en: 'WARCROW and all associated marks, logos, places, names, creatures, races and race insignia/devices/logos/symbols, vehicles, locations, weapons, units, characters, products, illustrations and images are either ® or ™, and/or © Corvus Belli S.L.L. This is a fan-made application and is not officially endorsed by or affiliated with Corvus Belli S.L.L.',
    es: 'WARCROW y todas las marcas asociadas, logotipos, lugares, nombres, criaturas, razas e insignias/dispositivos/logotipos/símbolos de raza, vehículos, ubicaciones, armas, unidades, personajes, productos, ilustraciones e imágenes son ® o ™, y/o © Corvus Belli S.L.L. Esta es una aplicación creada por fans y no está oficialmente respaldada ni afiliada a Corvus Belli S.L.L.'
  },
  logoAlt: {
    en: 'Warcrow Logo',
    es: 'Logo de Warcrow'
  },
  // Buttons
  startBuilding: {
    en: 'Start Building',
    es: 'Comenzar a Construir'
  },
  rulesReference: {
    en: 'Rules Reference',
    es: 'Referencia de Reglas'
  },
  armyBuilder: {
    en: 'Army Builder',
    es: 'Constructor de Ejércitos'
  },
  loadList: {
    en: 'Load',
    es: 'Cargar'
  },
  deleteList: {
    en: 'Delete',
    es: 'Eliminar'
  },
  newList: {
    en: 'New List',
    es: 'Nueva Lista'
  },
  saveListLocally: {
    en: 'Save List Locally',
    es: 'Guardar Lista Localmente'
  },
  cloudSave: {
    en: 'Cloud Save',
    es: 'Guardar en la Nube'
  },
  enterListName: {
    en: 'Enter list name',
    es: 'Ingrese nombre de la lista'
  },
  savedLists: {
    en: 'Saved Lists',
    es: 'Listas Guardadas'
  },
  verify: {
    en: 'Verify',
    es: 'Verificar'
  },
  idVerified: {
    en: 'ID verified',
    es: 'ID verificada'
  },
  scrollToTop: {
    en: 'Scroll to top',
    es: 'Volver arriba'
  },
  admin: {
    en: 'Admin',
    es: 'Administrador'
  },
  unitStats: {
    en: 'Unit Stats',
    es: 'Estadísticas de Unidades'
  }
};
