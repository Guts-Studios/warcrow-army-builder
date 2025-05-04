
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { rulesTranslations } from "@/i18n/rules";

export interface Section {
  id: string;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

// Spanish translations for basic concepts chapter
const basicConceptsChapterES = {
  id: "basic-concepts",
  title: "Conceptos Básicos",
  sections: [
    {
      id: "basic-concepts-intro",
      title: "Conceptos Básicos",
      content: "En este capítulo encontrarás los conceptos básicos para jugar a WARCROW, incluyendo los atributos de las unidades, línea de visión, formaciones y otros elementos fundamentales del juego."
    },
    {
      id: "game-elements",
      title: "Elementos de Juego",
      content: "WARCROW es un juego de miniaturas que se desarrolla sobre una mesa de juego. Para jugar necesitas varios elementos:\n\n• Miniaturas: Representan tus tropas en el campo de batalla.\n• Perfiles de unidad: Contienen toda la información sobre tus tropas.\n• Un medidor (steps): Para medir las distancias en el juego.\n• Dados: WARCROW utiliza dados especiales de colores para resolver acciones.\n• Tokens: Para representar efectos, estados y otros elementos del juego."
    },
    {
      id: "line-of-sight",
      title: "Línea de Visión (LdV)",
      content: "La Línea de Visión (LdV) es una línea imaginaria que va desde cualquier punto de la base de una miniatura hasta cualquier punto de la base de otra miniatura. Si esta línea no está obstruida por ningún elemento de escenografía o por otra miniatura, entonces hay Línea de Visión.\n\nLa LdV es recíproca, es decir, si una miniatura tiene LdV a otra, esa otra miniatura también tiene LdV a la primera.\n\nAl calcular la LdV, ten en cuenta que:\n\nUna tropa siempre tiene LdV hacia sí misma y las tropas adyacentes.\n\n[[red]]Al calcular la LdV hacia una unidad, las tropas que la componen no bloquean la LdV a otros miembros de la misma unidad. Por ejemplo, cuando se traza la LdV sobre una unidad de Cazadores Orcos, los que están delante no bloquean la LdV a los que están detrás.[[/red]]"
    },
    {
      id: "attribute-profiles",
      title: "Perfiles de Atributos",
      content: "Cada unidad en WARCROW tiene un perfil con sus atributos y capacidades. Los atributos principales son:\n\n• MOV (Movimiento): Indica cuánto puede moverse la unidad en pasos.\n• MOR (Moral): Representa la resistencia mental y determinación de la unidad.\n• WP (Fuerza de Voluntad): La capacidad para resistir efectos mentales y psicológicos.\n• W (Heridas): Cuánto daño puede sufrir la unidad antes de ser eliminada.\n\nAdemás, cada unidad tiene dados de ataque y defensa representados por dados de colores."
    }
  ]
};

// Spanish translations for stress and morale chapter
const stressAndMoraleChapterES = {
  id: "stress-morale",
  title: "Estrés y Moral",
  sections: [
    {
      id: "stress-intro",
      title: "Estrés y Moral",
      content: "El estrés representa la presión psicológica que sufren tus tropas durante el combate. Cuando una unidad sufre determinados eventos negativos acumula tokens de estrés que pueden llevarla a desmoralizarse."
    },
    {
      id: "stress-generation",
      title: "Generación de Estrés",
      content: "Una unidad recibe estrés cuando:\n\n• Pierde un miembro de la unidad.\n• Realiza una maniobra en condiciones adversas.\n• Es objetivo de ciertas habilidades o hechizos.\n• Fallan tiradas de desafío en situaciones peligrosas.\n\nCada unidad puede acumular estrés hasta su valor de MOR (Moral). Cuando el nivel de estrés supera su MOR, la unidad debe realizar una prueba de WP (Fuerza de Voluntad)."
    },
    {
      id: "morale-checks",
      title: "Pruebas de Moral",
      content: "Cuando una unidad debe hacer una prueba de moral, lanza tantos dados como su valor de WP. Si obtiene al menos un éxito, la unidad supera la prueba y continúa normalmente, aunque sigue con su nivel de estrés actual. Si no obtiene ningún éxito, la unidad queda desmoralizada."
    },
    {
      id: "demoralization",
      title: "Desmoralización",
      content: "Una unidad desmoralizada:\n\n• Debe huir inmediatamente alejándose del enemigo.\n• No puede realizar acciones normales hasta recuperarse.\n• No cuenta para controlar objetivos de misión.\n• No puede recibir órdenes ni usar habilidades.\n\nPara recuperarse, una unidad desmoralizada debe usar su activación para hacer una prueba de WP. Si tiene éxito, se recupera pero mantiene su nivel de estrés."
    },
    {
      id: "stress-recovery",
      title: "Recuperación de Estrés",
      content: "Las unidades pueden eliminar tokens de estrés mediante:\n\n• La activación Rally, que permite hacer una prueba de WP para eliminar estrés.\n• Ciertas habilidades y efectos de personajes de apoyo.\n• Efectos especiales de cartas tácticas o habilidades de facción."
    }
  ]
};

// Spanish translations for prepare the game chapter
const prepareTheGameChapterES = {
  id: "prepare-game",
  title: "Preparar la Partida",
  sections: [
    {
      id: "prepare-intro",
      title: "Preparar la Partida",
      content: "Antes de iniciar una partida de WARCROW, debes seguir varios pasos para preparar todo correctamente."
    },
    {
      id: "battlefield",
      title: "Campo de Batalla",
      content: "Se recomienda jugar en un tablero de aproximadamente 120 x 120 cm (4' x 4'). El campo debe contar con elementos de escenografía suficientes para crear un entorno táctico interesante. Coloca entre 5-7 elementos de escenografía distribuidos de manera equilibrada."
    },
    {
      id: "mission-selection",
      title: "Selección de Misión",
      content: "Las misiones definen los objetivos a lograr durante la partida. Puede ser una misión oficial o una creada por la comunidad. La misión especificará:\n\n• Duración de la partida (número de rondas)\n• Objetivos a conseguir\n• Condiciones de victoria\n• Reglas especiales (si las hay)"
    },
    {
      id: "deployment",
      title: "Despliegue",
      content: "Cada misión tiene sus propias zonas de despliegue. Sigue estos pasos para el despliegue:\n\n1. Determina quién elige lado (normalmente mediante una tirada de dados)\n2. Determina quién despliega primero (normalmente mediante una tirada de dados)\n3. Despliega tus tropas alternando entre los jugadores hasta que todas estén en el campo"
    },
    {
      id: "unit-reservations",
      title: "Reservas de Unidades",
      content: "Algunas unidades tienen palabras clave especiales que les permiten desplegarse de manera diferente:\n\n• Explorador: Permite desplegar fuera de la zona de despliegue.\n• Emboscada: Permite desplegar la unidad más tarde durante la partida.\n\nLas reservas deben declararse durante el despliegue y seguir las reglas específicas de cada palabra clave."
    }
  ]
};

// Spanish translations for game round chapter
const gameRoundChapterES = {
  id: "game-round",
  title: "Ronda de Juego",
  sections: [
    {
      id: "round-intro",
      title: "Ronda de Juego",
      content: "La partida se juega en una serie de rondas, cada una dividida en 4 fases. Las rondas continúan hasta alcanzar el límite definido por la misión."
    },
    {
      id: "initiative-phase",
      title: "1. Fase de Iniciativa",
      content: "Al comienzo de cada ronda, ambos jugadores determinan quién tiene la iniciativa:\n\n1. Cada jugador lanza tantos dados como unidades tenga en el campo de batalla\n2. El jugador con más éxitos obtiene la iniciativa\n3. En caso de empate, gana la iniciativa quien la tuviera en la ronda anterior"
    },
    {
      id: "command-phase",
      title: "2. Fase de Mando",
      content: "Durante esta fase, los jugadores pueden utilizar habilidades de mando y otros efectos que se activan al principio de la ronda. El jugador con iniciativa actúa primero."
    },
    {
      id: "activation-phase",
      title: "3. Fase de Activación",
      content: "Los jugadores se turnan para activar sus unidades, una por una. El jugador con la iniciativa decide quién activa primero en cada turno de activación. Cuando una unidad se activa, puede realizar dos acciones:\n\n• Movimiento\n• Ataque\n• Magia/Rezo\n• Habilidades\n• Reagruparse\n• Asegurar\n\nLas acciones se pueden realizar en cualquier orden, pero no se puede repetir la misma acción en la misma activación (excepto Movimiento)."
    },
    {
      id: "activate-move",
      title: "Activar una unidad y mover",
      content: "Cuando activas una unidad, puedes moverla hasta su valor de MOV en pasos. El movimiento debe seguir estas reglas:\n\n• No puedes mover a través de otras unidades o terreno infranqueable\n• Debes mantener la formación al final del movimiento\n• No puedes separar la unidad en grupos\n\n[...] Ten en cuenta que:\n\n[[red]]Tu unidad puede realizar la acción de movimiento y permanecer inmóvil.[[/red]]"
    },
    {
      id: "combat",
      title: "Combate",
      content: "Sigue estos pasos para resolver el combate:\n\n1. Tu unidad debe realizar maniobras de posicionamiento si alguna de sus tropas no está involucrada en el combate. (Ver sección \"Maniobras de posicionamiento\").\n2. Selecciona un ataque cuerpo a cuerpo de tu perfil de unidad.\n3. Todas las tropas de tu unidad participan en el ataque, así como todas las tropas de la unidad enemiga defienden.\n4. Tu oponente reúne la tirada de defensa indicada en su panel de combate según el número de tropas en su unidad. Si la unidad incluye un Personaje, puede añadir dados o símbolos automáticos a la tirada. (Ver \"Personajes\"). En este punto deben declarar si su unidad está estresada para añadir su modificador a la tirada de defensa. Si tu oponente decide no hacerlo, no podrá cambiar de opinión más tarde.\n5. Reúne tu reserva de dados de ataque. Toma los dados indicados en el panel de combate de tu unidad según el número de tropas que hay actualmente en ella. Si tu unidad incluye un Personaje, puede añadir dados o símbolos automáticos a la tirada. (Ver \"Personajes\"). Declara ahora si tu unidad está estresada para añadir el modificador a su tirada de ataque.\n6. Resuelve una tirada Cara a Cara entre tu tirada de ataque y la tirada de defensa de tu oponente.\n7. Tu oponente recibe tanto daño como Éxitos queden en tu tirada y viceversa, tu unidad recibe tanto daño como Éxitos queden en la tirada de tu oponente.\n\n(FAQ V 1.2.1)"
    },
    {
      id: "end-phase",
      title: "4. Fase Final",
      content: "En esta fase se resuelven los efectos que ocurren al final de la ronda, como la recuperación de ciertas habilidades, evaluación de los objetivos controlados, y la preparación para la siguiente ronda."
    }
  ]
};

// Spanish translations for skills chapter
const skillsChapterES = {
  id: "skills",
  title: "Habilidades",
  sections: [
    {
      id: "skills-intro",
      title: "Habilidades",
      content: "Las habilidades son capacidades especiales que tienen las unidades y personajes en WARCROW. Estas pueden proporcionar ventajas en combate, movimiento, supervivencia u otros aspectos del juego."
    },
    {
      id: "skill-types",
      title: "Tipos de Habilidades",
      content: "En WARCROW encontramos varios tipos de habilidades:\n\n• Habilidades Pasivas: Están siempre activas y no requieren activación.\n• Habilidades Activas: Requieren una acción para ser utilizadas.\n• Habilidades de Mando: Solo pueden ser usadas por personajes con la característica de Oficial.\n• Habilidades de Facción: Específicas para ciertas facciones del juego."
    },
    {
      id: "skill-activation",
      title: "Activación de Habilidades",
      content: "Para utilizar una habilidad activa, la unidad debe:\n\n1. Estar activada y no desmoralizada.\n2. Declarar qué habilidad va a utilizar.\n3. Gastar una acción (a menos que la habilidad indique lo contrario).\n4. Cumplir con cualquier requisito específico de la habilidad (alcance, objetivo, etc.).\n5. Resolver los efectos según las instrucciones de la habilidad."
    },
    {
      id: "command-skills",
      title: "Habilidades de Mando",
      content: "Las habilidades de mando son especiales porque:\n\n• Solo pueden ser utilizadas por Oficiales.\n• Algunas afectan a otras unidades aliadas dentro de un rango determinado.\n• Pueden utilizarse durante la Fase de Mando o como parte de la activación del Oficial.\n• Normalmente representan órdenes, inspiración o tácticas especiales."
    },
    {
      id: "skill-limitations",
      title: "Limitaciones de Habilidades",
      content: "Es importante recordar que:\n\n• Una unidad no puede usar la misma habilidad más de una vez por activación (a menos que la habilidad lo especifique).\n• Las unidades desmoralizadas no pueden utilizar habilidades.\n• Las habilidades no pueden usarse durante ataques oportunistas a menos que lo indiquen específicamente.\n• Algunas habilidades tienen limitaciones de uso por ronda o por partida."
    }
  ]
};

// Spanish translations for magic and prayers chapter
const magicAndPrayersChapterES = {
  id: "magic-prayers",
  title: "Magia y Rezos",
  sections: [
    {
      id: "magic-intro",
      title: "Magia y Rezos",
      content: "La magia y los rezos representan las fuerzas sobrenaturales que algunos personajes y unidades pueden controlar en WARCROW. Aunque funcionan de manera similar, tienen algunas diferencias importantes."
    },
    {
      id: "spellcasters",
      title: "Lanzadores de Hechizos",
      content: "Los lanzadores de hechizos son personajes con la palabra clave Magia. Para lanzar un hechizo, siguen estos pasos:\n\n1. Declarar el hechizo a lanzar y su objetivo.\n2. Gastar una acción de Magia.\n3. Realizar una prueba de lanzamiento usando los dados indicados en el perfil del hechizo.\n4. Si obtiene suficientes éxitos, el hechizo se lanza correctamente.\n5. El objetivo puede tener derecho a una prueba de resistencia si el hechizo lo permite."
    },
    {
      id: "prayers",
      title: "Rezos",
      content: "Los rezos funcionan de manera similar a los hechizos pero están asociados con la palabra clave Rezo en lugar de Magia. Las principales diferencias son:\n\n• Los rezos suelen tener efectos más orientados a buffar aliados o debuffar enemigos.\n• Algunos rezos pueden tener restricciones relacionadas con las alineaciones o facciones.\n• Las mecánicas de fallo pueden ser diferentes a las de los hechizos."
    },
    {
      id: "magic-resistance",
      title: "Resistencia a la Magia",
      content: "Algunas unidades tienen la habilidad de resistir efectos mágicos. Cuando son objetivo de un hechizo, pueden realizar una prueba de resistencia utilizando sus dados de WP. Si obtienen suficientes éxitos, pueden reducir o anular completamente los efectos del hechizo."
    },
    {
      id: "magical-terrain",
      title: "Terreno Mágico",
      content: "Algunos escenarios incluyen elementos de terreno con propiedades mágicas que pueden afectar a los hechizos y rezos. Estos pueden aumentar o disminuir la potencia de ciertos hechizos, impedir su lanzamiento o crear efectos especiales cuando se usan habilidades mágicas cerca de ellos."
    }
  ]
};

// Spanish translations for terrain and cover chapter
const terrainAndCoverChapterES = {
  id: "terrain-cover",
  title: "Terreno y Cobertura",
  sections: [
    {
      id: "terrain-intro",
      title: "Terreno y Cobertura",
      content: "El terreno en WARCROW no solo define la estética del campo de batalla sino que también afecta tácticamente al juego, ofreciendo ventajas o presentando obstáculos a las tropas."
    },
    {
      id: "terrain-types",
      title: "Tipos de Terreno",
      content: "En WARCROW encontramos varios tipos de terreno:\n\n• Terreno Abierto: No ofrece ningún impedimento al movimiento o línea de visión.\n• Terreno Difícil: Reduce el movimiento de las tropas (cada paso en terreno difícil cuenta como 2).\n• Terreno Infranqueable: No permite el movimiento a través de él (muros altos, precipicios, etc.).\n• Obstáculos: Elementos como vallas o muros bajos que requieren pruebas para ser cruzados.\n• Terreno de Cobertura: Proporciona protección a las unidades."
    },
    {
      id: "cover",
      title: "Cobertura",
      content: "La cobertura ofrece protección a las unidades contra los ataques enemigos. Una unidad está en cobertura cuando:\n\n• Al menos el 50% de sus tropas están detrás de un elemento de terreno respecto al atacante.\n• El elemento proporciona suficiente masa o altura para ocultar parcialmente a las tropas.\n\nUna unidad en cobertura recibe un dado adicional de defensa contra ataques a distancia. Este beneficio no se aplica en combate cuerpo a cuerpo."
    },
    {
      id: "hiding",
      title: "Ocultación",
      content: "Algunas partes del terreno pueden proporcionar ocultación total, bloqueando completamente la línea de visión. Una unidad detrás de un elemento que bloquea completamente la línea de visión no puede ser objetivo de ataques a distancia o habilidades que requieren línea de visión."
    },
    {
      id: "structures",
      title: "Estructuras",
      content: "Las estructuras como edificios, torres o ruinas tienen reglas especiales:\n\n• Las unidades pueden ocupar estructuras si tienen el tamaño adecuado.\n• Las estructuras pueden proporcionar cobertura completa o parcial según cómo se posicione la unidad.\n• Algunas estructuras pueden tener pisos superiores accesibles.\n• Las unidades dentro de estructuras pueden obtener bonificaciones a la defensa o restricciones de movimiento."
    },
    {
      id: "special-terrain",
      title: "Terreno Especial",
      content: "Algunos elementos de terreno tienen reglas especiales:\n\n• Agua: Puede ralentizar el movimiento o impedir el paso a ciertas tropas.\n• Terreno Elevado: Proporciona ventajas a las unidades que lo ocupan.\n• Terreno Inestable: Puede requerir pruebas para evitar sufrir daños.\n• Terreno Mágico: Afecta a las habilidades de magia o proporciona efectos especiales."
    }
  ]
};

// Spanish translations for combat chapter
const combatChapterES = {
  id: "combat",
  title: "Combate",
  sections: [
    {
      id: "combat-intro",
      title: "Combate",
      content: "El combate es uno de los aspectos centrales de WARCROW, permitiendo a tus unidades enfrentarse tanto a distancia como cuerpo a cuerpo con las fuerzas enemigas."
    },
    {
      id: "attack-action",
      title: "Acción de Ataque",
      content: "Para realizar un ataque, sigue estos pasos:\n\n1. Declara qué unidad va a atacar y su objetivo.\n2. Verifica que el objetivo está en rango y línea de visión (para ataques a distancia).\n3. Lanza los dados de ataque indicados en el perfil de la unidad.\n4. El defensor lanza sus dados de defensa.\n5. Compara los resultados y aplica el daño y los efectos correspondientes."
    },
    {
      id: "ranged-combat",
      title: "Combate a Distancia",
      content: "El combate a distancia permite atacar a enemigos que están fuera del alcance cuerpo a cuerpo:\n\n• Requiere línea de visión clara hacia el objetivo.\n• El alcance de ataque está determinado por el arma (corto, medio o largo).\n• La cobertura proporciona beneficios defensivos al objetivo.\n• Algunas armas tienen reglas especiales como Area o Explosión."
    },
    {
      id: "close-combat",
      title: "Combate Cuerpo a Cuerpo",
      content: "El combate cuerpo a cuerpo ocurre cuando las unidades están en contacto base con base:\n\n• No requiere pruebas de alcance, pero las unidades deben estar adyacentes.\n• La cobertura generalmente no se aplica en combate cuerpo a cuerpo.\n• Algunas armas y habilidades tienen bonificaciones específicas para este tipo de combate.\n• Las unidades en combate cuerpo a cuerpo tienen restricciones de movimiento."
    },
    {
      id: "opportunity-attacks",
      title: "Ataques de Oportunidad",
      content: "Los ataques de oportunidad se producen cuando una unidad enemiga realiza ciertas acciones dentro del alcance cuerpo a cuerpo de tu unidad:\n\n• Se desencadenan principalmente cuando un enemigo intenta salir del contacto cuerpo a cuerpo.\n• Se resuelven antes de que la unidad enemiga complete su acción.\n• Son ataques cuerpo a cuerpo normales pero no cuentan como una acción para la unidad que los realiza.\n• No se pueden realizar si la unidad ya ha sido activada en esa ronda."
    },
    {
      id: "damage",
      title: "Daño",
      content: "Cuando una unidad sufre daño:\n\n• Coloca tokens de daño en su perfil según la cantidad de daño recibido.\n• Cuando los tokens de daño igualan o superan el valor de W (Heridas) de una tropa, esta es eliminada.\n• La eliminación de tropas puede generar estrés en la unidad.\n• Algunas unidades tienen habilidades especiales que modifican cómo reciben o recuperan daño."
    }
  ]
};

// Characters chapter in Spanish
const charactersChapterES = {
  id: "characters",
  title: "Personajes",
  sections: [
    {
      id: "characters-intro",
      title: "Personajes",
      content: "Los personajes son unidades de miniatura única que presentan la palabra clave Personaje en su perfil. Dependiendo de la fuerza de su liderazgo o su papel en su compañía, distinguimos entre Oficiales y Apoyos."
    },
    {
      id: "officers-and-supports",
      title: "Oficiales y Apoyos",
      content: "El tipo de Personaje que es una unidad está indicado por un icono en su perfil.\n\nAdemás de luchar individualmente como cualquier unidad, los Personajes pueden unirse a unidades aliadas para liderarlas, mejorar sus capacidades o darles habilidades únicas."
    },
    {
      id: "join-a-unit",
      title: "Unirse a una Unidad",
      content: "Los Personajes con la capacidad de unirse a una unidad tienen esto indicado en su perfil usando la palabra clave Unirse (X), donde \"X\" puede ser el nombre de una unidad, una característica, una palabra clave o varios grupos de ellos separados por líneas. (\"|\"). En el último caso, la unidad objetivo debe tener todas las palabras clave o características, o estar nombrada como al menos uno de los grupos\n\nLos Personajes que no tienen la palabra clave Unirse (X) no pueden unirse a ninguna unidad de ninguna manera.\n\nEjemplos:\n• Unirse (Infantería). El Personaje puede unirse a una unidad con la característica Infantería.\n• Unirse (Cazadores Orcos). El Personaje solo puede unirse a una unidad de \"Cazadores Orcos\".\n• Unirse (Infantería, Varank). El Personaje puede unirse a una unidad que tenga las características Infantería y Varank.\n• Unirse (Infantería, Ghent | Escudero). El Personaje puede unirse a una unidad que tenga las características Infantería y Ghent; o una unidad con la palabra clave Escudero.\n\nUna unidad no puede incluir más de un Personaje."
    },
    {
      id: "chain-of-command",
      title: "Comando en Cadena",
      content: "Los Personajes de tipo Oficial se convierten automáticamente en el líder de tropa de la unidad a la que se unen."
    },
    {
      id: "characters-joining-unit",
      title: "Personajes uniéndose a una unidad",
      content: "Puedes unir un Personaje a una unidad durante el despliegue o durante su activación."
    },
    {
      id: "join-during-deployment",
      title: "A. Unirse durante el despliegue",
      content: "Cuando estás a punto de desplegar tu Personaje, selecciona una de tus unidades ya desplegadas (que cumpla con los requisitos de su palabra clave Unirse y en la que no haya otro Personaje) y declara a tu oponente que tu Personaje está uniéndose a la unidad. Luego coloca el Personaje en el campo de batalla en formación con la unidad (puedes reubicar tropas para hacer espacio para ellos y asegurarte de que la unidad esté en formación).\n\nRecuerda que si el Personaje es de tipo Oficial, se convierte en el líder de tropa, por lo que las tropas de la unidad deben tener LdV hacia ellos y estar a 2 pasos.\n\nSi quieres desplegar tu Personaje con una unidad que esté desplegada en otro momento en el juego (por ejemplo, unidades de Cazador y Emboscada), debes reservarlas ocultas y desplegarlas al mismo tiempo que despliegas la unidad."
    },
    {
      id: "join-during-activation",
      title: "B. Unirse durante la activación",
      content: "Durante la activación, tu Personaje puede unirse a una unidad (que cumpla con los requisitos de su palabra clave Unirse) siempre que:\n\n• No haya otros Personajes en la unidad.\n• La unidad no esté desmoralizada.\n\nSi estos requisitos se cumplen, declara a tu oponente que el Personaje está uniéndose a la unidad. El único movimiento que tu Personaje puede realizar es el de movimiento (puedes moverte dos veces) y debe terminar su activación en formación con su nueva unidad (teniendo LdV y a 2 pasos del líder de tropa).\n\nAl final de su activación, en el caso de un Oficial, tu Personaje se convierte automáticamente en el líder de tropa, por lo que puedes intercambiar su posición con el anterior líder de tropa de la unidad para que todas las tropas estén en formación con el Personaje."
    },
    {
      id: "damage-stress-states",
      title: "Daño, estrés, estados y otros tokens",
      content: "Si tu Personaje tiene tokens en su perfil, haz lo siguiente para cada tipo de token:\n\n• Tokens de daño. El Personaje mantiene sus tokens de daño en su propio perfil. Mientras esté unido a una unidad, se ignorarán. Los tokens de daño solo se tomarán en cuenta de nuevo si la unidad es destruida o el Personaje se abandona ella.\n• Tokens de estrés. Compara el nivel de estrés entre el Personaje y la unidad y deja el más alto de los dos en la unidad.\n• Tokens de estado. Coloca los tokens de estado del Personaje en la unidad. Como solo puedes tener un token de cada estado, elimina cualquier estado repetido. (Ver \"Estados\").\n• Tokens de efectos. Si el Personaje tiene asignado algún número de tokens de efectos (por ejemplo, hechizos), se transfieren al perfil de la unidad.\n• Token de activación. Elimina el token de activación del Personaje."
    },
    {
      id: "character-game-profile",
      title: "Perfil de juego de Personaje en unidades",
      content: "Cuando un Personaje ha unido una unidad, debes usar su \"Perfil de juego de Personaje en unidad\". La unidad utilizará los valores que el Personaje comparte (por ejemplo, en el caso de los Oficiales, su WP).\n\nPara manejar esta unión más cómodamente, hemos diseñado las tarjetas con los perfiles de juego de tal manera que puedas colocar la tarjeta del Personaje debajo de la tarjeta de unidad, y por lo tanto, ambos perfiles se agruparán juntos.\n\nCuando estos valores sean absolutos, reemplazarán los de la unidad, mientras que si son modificadores (prefijados con \"+\") se añadirán a los de la unidad (aunque tenga un valor). Recuerda que cuando se modifica un lanzamiento, no puedes lanzar más de 3 dados del mismo color, por lo que ignora todos los dados de un color que excedan ese número."
    },
    {
      id: "combat",
      title: "Combate",
      content: "Los Personajes participan con su unidad en combate, proporcionando sus correspondientes modificadores y cambios si los tienen."
    },
    {
      id: "characters-as-members",
      title: "Personajes como miembros de una unidad",
      content: "Los Personajes de tipo Oficial cuentan como otro miembro de la unidad al determinar el número de tropas participantes en un combate (atacantes y defensores), así como para cuantificar el valor conquistador de la unidad (aunque el Personaje Oficial puede modificarlo).\n\nLos Apoyos no cuentan con el número de tropas en la unidad\n\nLos Personajes heredan todas las palabras clave de la unidad a la que se unen, ya que, para todos los propósitos, juegas con el perfil de la unidad mientras el Personaje está incluido en ella."
    },
    {
      id: "skills-and-spells",
      title: "Habilidades, habilidades pasivas y hechizos",
      content: "La unidad puede usar las habilidades, habilidades de comando, habilidades pasivas y hechizos presentes en el \"Perfil de juego de Personaje en unidad\" como si fueran sus propias, ya que es la unidad que activa y realiza las acciones."
    },
    {
      id: "characters-leaving-unit",
      title: "Personajes abandonando su unidad",
      content: "Para que tu Personaje abandone su unidad, sigue estos pasos:\n\n• Declara a tu oponente que tu Personaje está abandonando la unidad.\n• Tu Personaje puede realizar la acción de movimiento hasta dos veces (este movimiento no genera ataques oportunos)\n• Tu Personaje ha sido activado, por lo que coloca un Token de activación en su perfil.\n• Si el Personaje es un Oficial, puedes colocar al líder de tropa de la unidad en la posición que ocupaba el Personaje para que todas las otras tropas estén en formación.\n\nCuando un Personaje abandona una unidad, la unidad regresa a los valores originales de sus atributos. Si su nivel de estrés excede su nivel original MOR, realiza una prueba de WP. Si no pasa, la unidad está desmoralizada y debe huir inmediatamente. (Ver \"Estrés y moral. Huir\").\n\nRecuerda, cada vez que un Personaje abandone su unidad (o sea eliminado del juego debido a que se elimina), debes designar a un nuevo líder de tropa para la unidad."
    },
    {
      id: "damage-stress-tokens-leaving",
      title: "Tokens de daño, estrés, estados y otros tokens",
      content: "Si la unidad tiene tokens en su perfil, haz lo siguiente para cada tipo de token:\n\n• Tokens de daño. La unidad mantiene todos los tokens de daño. El Personaje solo mantiene los tokens de daño que tenía antes de unirse a la unidad.\n• Tokens de estrés. El Personaje recibe el mismo nivel de estrés que la unidad.\n• Tokens de estado. Coloca los mismos tokens de estado en tu Personaje que la unidad tiene.\n• Tokens de efectos. La unidad mantiene todos los tokens de efectos.\n\nLos Personajes no pueden unirse y abandonar una unidad (y viceversa) durante la misma activación."
    },
    {
      id: "assign-damage-characters",
      title: "Asignar daño a unidades con Personajes",
      content: "Los Personajes Oficiales que están en una unidad son los últimos en sufrir daño, ya que son el líder de tropa.\n\nLos Personajes de tipo Apoyo que están en una unidad pueden ser eliminados como cualquier otra tropa. Cuando el daño sufrido es igual al valor W (Heridas) de la unidad, puedes eliminar al Personaje de Apoyo en lugar de un soldado."
    },
    {
      id: "characters-destroyed-units",
      title: "Personajes y unidades destruidas",
      content: "Cuando todas las tropas de una unidad se han quedado sin combate, dedica el daño restante al Personaje. Debido a que la unidad ha sido destruida, el Personaje ya no forma parte de ella. Antes de eliminar la unidad del campo de batalla, realiza los siguientes pasos:\n\n• Separar la tarjeta del Personaje y la tarjeta de unidad.\n• Transferir los correspondientes tokens de la unidad al Personaje según se indica en la sección \"Tokens de daño, estrés, estados y otros tokens\".\n\nUna vez que se completen estos pasos, puedes eliminar todos los elementos de juego de la unidad del juego."
    }
  ]
};

// LineOfSightAndMovementChapterES
const lineOfSightAndMovementChapterES = {
  id: "line-of-sight-movement",
  title: "Línea de Visión y Movimiento",
  sections: [
    {
      id: "line-of-sight-intro",
      title: "Línea de Visión y Movimiento",
      content: "La línea de visión y el movimiento son aspectos fundamentales para el posicionamiento táctico de tus tropas en el campo de batalla."
    },
    {
      id: "line-of-sight-detail",
      title: "Línea de Visión en Detalle",
      content: "La línea de visión (LdV) determina qué pueden ver tus unidades en el campo de batalla:\n\n• Se traza desde cualquier punto de la base de la miniatura hasta cualquier punto de la base del objetivo.\n\n• Si la línea no está obstruida por terreno o miniaturas enemigas, hay LdV.\n\n• Las miniaturas de la misma unidad no bloquean la LdV entre sí.\n\n• El terreno con la regla 'bloquea LdV' interrumpe completamente la visión.\n\n• El terreno con la regla 'oscurece' proporciona bonificaciones defensivas pero no bloquea la LdV."
    },
    {
      id: "formation-rules",
      title: "Reglas de Formación",
      content: "Las unidades deben mantener formación para operar eficazmente:\n\n• Todas las miniaturas deben estar a un máximo de 2 pasos del líder de unidad.\n\n• Todas las miniaturas deben tener LdV hacia el líder de unidad.\n\n• Las unidades no pueden separarse en grupos.\n\n• El líder de unidad se escoge al inicio de la partida, pero puede cambiar durante el juego."
    },
    {
      id: "movement-details",
      title: "Detalles del Movimiento",
      content: "El movimiento en WARCROW se mide en pasos:\n\n• Cada unidad tiene un valor de MOV que indica cuántos pasos puede moverse.\n\n• El terreno difícil reduce la velocidad (cada paso cuenta como 2).\n\n• Una unidad siempre debe terminar su movimiento en formación.\n\n• Las unidades pueden realizar dos acciones de movimiento en la misma activación."
    }
  ]
};

export const useRules = () => {
  const { language } = useLanguage();
  
  const fetchRules = async () => {
    // Here we would normally fetch from the database
    // But for now we'll use the hardcoded data
    
    // English chapters
    if (language === 'en') {
      return rulesTranslations.en.chapters;
    }
    
    // Spanish chapters (hardcoded for now)
    if (language === 'es') {
      return [
        basicConceptsChapterES,
        stressAndMoraleChapterES,
        prepareTheGameChapterES,
        gameRoundChapterES,
        skillsChapterES,
        magicAndPrayersChapterES,
        terrainAndCoverChapterES,
        combatChapterES,
        charactersChapterES,
        lineOfSightAndMovementChapterES
      ];
    }
    
    // Default to English
    return rulesTranslations.en.chapters;
  };

  return useQuery({
    queryKey: ['rules', language],
    queryFn: fetchRules
  });
};
