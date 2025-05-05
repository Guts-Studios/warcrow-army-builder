
import { TranslationsType } from './types';

export const faqTranslations: TranslationsType = {
  // FAQ questions
  faq_skill_properties: {
    en: 'What are skill properties?',
    es: '¿Qué son las propiedades de las habilidades?',
  },
  faq_skill_properties_answer: {
    en: 'Skill properties define the special characteristics and effects of a skill. They determine how a skill interacts with other game elements and can influence outcomes during gameplay.',
    es: 'Las propiedades de las habilidades definen las características y efectos especiales de una habilidad. Determinan cómo una habilidad interactúa con otros elementos del juego y pueden influir en los resultados durante la partida.',
  },
  faq_line_of_sight: {
    en: 'How does Line of Sight (LoS) work?',
    es: '¿Cómo funciona la Línea de Visión (LoS)?',
  },
  faq_line_of_sight_answer: {
    en: 'Line of Sight determines whether a unit can see another unit or target. It is calculated based on the positions of the units and any obstacles between them. When calculating LoS, keep in mind that a troop always has LOS towards itself and adjacent troops.',
    es: 'La Línea de Visión determina si una unidad puede ver a otra unidad u objetivo. Se calcula basándose en las posiciones de las unidades y cualquier obstáculo entre ellas. Al calcular la LoS, ten en cuenta que una tropa siempre tiene LoS hacia sí misma y hacia tropas adyacentes.',
  },
  faq_move_action: {
    en: 'What is the move action?',
    es: '¿Qué es la acción de movimiento?',
  },
  faq_move_action_answer: {
    en: 'The move action allows a unit to change its position on the battlefield. The distance and direction are determined by the unit\'s movement capabilities and any terrain effects. Keep in mind that your unit can perform the move action and stand still.',
    es: 'La acción de movimiento permite a una unidad cambiar su posición en el campo de batalla. La distancia y dirección están determinadas por las capacidades de movimiento de la unidad y los efectos del terreno. Ten en cuenta que tu unidad puede realizar la acción de movimiento y quedarse quieta.',
  },
  faq_push_back: {
    en: 'How do I push back a defeated unit?',
    es: '¿Cómo empujo hacia atrás una unidad derrotada?',
  },
  faq_push_back_answer: {
    en: 'When a unit is defeated, certain effects or abilities may allow you to push it back. This involves moving the unit a specified distance away from its current position, following the game\'s movement rules. The winning unit shoves the defeated unit at a distance equal to the defeated unit\'s first MOV value. If the move cannot be fully completed (due to the defeated unit colliding with or engaging an enemy unit), the winning unit must choose a new direction that maximizes the distance between the two units.',
    es: 'Cuando una unidad es derrotada, ciertos efectos o habilidades pueden permitirte empujarla hacia atrás. Esto implica mover la unidad a una distancia específica de su posición actual, siguiendo las reglas de movimiento del juego. La unidad ganadora empuja a la unidad derrotada a una distancia igual al primer valor de MOV de la unidad derrotada. Si el movimiento no puede completarse totalmente (debido a que la unidad derrotada colisiona o se enfrenta con una unidad enemiga), la unidad ganadora debe elegir una nueva dirección que maximice la distancia entre las dos unidades.',
  },
  faq_demoralized: {
    en: 'What happens to a demoralized unit?',
    es: '¿Qué le sucede a una unidad desmoralizada?',
  },
  faq_demoralized_answer: {
    en: 'A demoralized unit suffers penalties to its actions and may have reduced effectiveness in combat. If your unit is demoralized: It cannot be activated in any way. It cannot stress itself in any way and cannot reduce its stress. It cannot control objectives (we consider its conquest value null). If it participates in combat, it will always flee after the result. It cannot activate their command abilities.',
    es: 'Una unidad desmoralizada sufre penalizaciones en sus acciones y puede tener una efectividad reducida en combate. Si tu unidad está desmoralizada: No puede ser activada de ninguna manera. No puede estresarse de ninguna manera y no puede reducir su estrés. No puede controlar objetivos (consideramos su valor de conquista nulo). Si participa en combate, siempre huirá después del resultado. No puede activar sus habilidades de mando.',
  },
  faq_states: {
    en: 'What are states in the game?',
    es: '¿Qué son los estados en el juego?',
  },
  faq_states_answer: {
    en: 'States represent various conditions that can affect units, such as being stunned, poisoned, or enraged. Each state has specific effects and durations as outlined in the game rules.',
    es: 'Los estados representan varias condiciones que pueden afectar a las unidades, como estar aturdido, envenenado o enfurecido. Cada estado tiene efectos específicos y duraciones según se detalla en las reglas del juego.',
  },
  faq_damage: {
    en: 'How is damage calculated?',
    es: '¿Cómo se calcula el daño?',
  },
  faq_damage_answer: {
    en: 'Damage is calculated based on the attacking unit\'s strength, the defending unit\'s defenses, and any modifiers from skills or equipment. When the total of tokens is equal to or greater than the value of your Wounds attribute (W), one of your troops will be taken out of combat. Immediately remove the model from the battlefield and remove from its game profile as many damage tokens as its W value. When removing troops from a unit engaged in combat, you may not remove troops that cause your unit to no longer be engaged with the unit that has inflicted damage. If necessary, exchange the leading unit with another troop of the unit before removing it.',
    es: 'El daño se calcula basándose en la fuerza de la unidad atacante, las defensas de la unidad defensora y cualquier modificador de habilidades o equipo. Cuando el total de fichas es igual o mayor que el valor de tu atributo de Heridas (W), una de tus tropas será retirada del combate. Retira inmediatamente el modelo del campo de batalla y elimina de su perfil de juego tantas fichas de daño como su valor W. Al retirar tropas de una unidad implicada en combate, no puedes retirar tropas que hagan que tu unidad ya no esté implicada con la unidad que ha infligido el daño. Si es necesario, intercambia la unidad líder con otra tropa de la unidad antes de retirarla.',
  },
  faq_elite: {
    en: 'What defines an elite unit?',
    es: '¿Qué define a una unidad de élite?',
  },
  faq_elite_answer: {
    en: 'Elite units are distinguished by superior stats, abilities, or roles within the game. Elite rules apply to WP rolls, attack (cc and ranged), defense, and the effects of skills and spells of the unit. They do not apply to tinge or spell-blocking rolls (including Dispel). An Elite Spellcaster cannot turn the 4 from the tinge roll to 3 to avoid receiving tinge.',
    es: 'Las unidades de élite se distinguen por estadísticas superiores, habilidades o roles dentro del juego. Las reglas de élite se aplican a tiradas de WP, ataque (cc y a distancia), defensa, y los efectos de habilidades y hechizos de la unidad. No se aplican a tiradas de tinte o de bloqueo de hechizos (incluyendo Disipar). Un Lanzador de Hechizos de Élite no puede convertir el 4 de la tirada de tinte en 3 para evitar recibir tinte.',
  },
  faq_neutral: {
    en: 'What are neutral units?',
    es: '¿Qué son las unidades neutrales?',
  },
  faq_neutral_answer: {
    en: 'Neutral units are entities on the battlefield that are not controlled by any player. Neutral units are neither allies nor enemies of yours, so you cannot target them with your attacks, abilities, or spells unless they have the Hostile keyword. Hostile neutral units are enemies of all units of any faction, including other neutral units.',
    es: 'Las unidades neutrales son entidades en el campo de batalla que no están controladas por ningún jugador. Las unidades neutrales no son ni aliadas ni enemigas tuyas, por lo que no puedes atacarlas con tus ataques, habilidades o hechizos a menos que tengan la palabra clave Hostil. Las unidades neutrales hostiles son enemigas de todas las unidades de cualquier facción, incluidas otras unidades neutrales.',
  },
  faq_report_errors: {
    en: 'Where can I report typos or errors?',
    es: '¿Dónde puedo informar sobre errores tipográficos o errores?',
  },
  faq_report_errors_answer: {
    en: 'If you encounter any typos or errors in the game materials, please reach out to the support team through the official contact channels provided on the Warcrow website.',
    es: 'Si encuentras algún error tipográfico o error en los materiales del juego, comunícate con el equipo de soporte a través de los canales de contacto oficiales proporcionados en el sitio web de Warcrow.',
  },
  faq_permanent: {
    en: 'How do Permanent properties work?',
    es: '¿Cómo funcionan las propiedades Permanentes?',
  },
  faq_permanent_answer: {
    en: 'Passive skills and command skills with the Permanent property apply their effects even if the unit is not present on the battlefield; whether it is off the table due to Ambusher or Scout, after it has been destroyed, or, in the case of a Character, after they join a unit (even if the skill is not present in their unit game profile). Scout or Ambusher units with a Permanent ability, which are outside the battlefield, can decide to apply it (revealing its existence to the opponent) or not to do so (and remain hidden).',
    es: 'Las habilidades pasivas y habilidades de mando con la propiedad Permanente aplican sus efectos incluso si la unidad no está presente en el campo de batalla; ya sea fuera de la mesa debido a Emboscador o Explorador, después de haber sido destruida o, en el caso de un Personaje, después de unirse a una unidad (incluso si la habilidad no está presente en el perfil de juego de su unidad). Las unidades con Explorador o Emboscador con una habilidad Permanente, que están fuera del campo de batalla, pueden decidir aplicarla (revelando su existencia al oponente) o no hacerlo (y permanecer ocultas).',
  },
  faq_slowed: {
    en: 'What is the Slowed state?',
    es: '¿Qué es el estado Ralentizado?',
  },
  faq_slowed_answer: {
    en: 'Your unit can only use one of the two MOV values when performing the move and assault actions. A unit with the slowed state applies its effects during the "No one gets left behind" step. If a demoralized unit with the slowed state flees, it does not apply the effects of the state. If a unit with the slowed state performs a charge, you must subtract 4 strides from your charge movement and will remove the status at the end of your activation.',
    es: 'Tu unidad solo puede usar uno de los dos valores de MOV cuando realiza las acciones de movimiento y asalto. Una unidad con el estado ralentizado aplica sus efectos durante el paso "Nadie se queda atrás". Si una unidad desmoralizada con el estado ralentizado huye, no aplica los efectos del estado. Si una unidad con estado ralentizado realiza una carga, debes restar 4 pasos de tu movimiento de carga y eliminarás el estado al final de tu activación.',
  },
  faq_cover: {
    en: 'How does Cover work?',
    es: '¿Cómo funciona la Cobertura?',
  },
  faq_cover_answer: {
    en: 'Only the adjacent units benefit from Cover, not the unit with the keyword itself.',
    es: 'Solo las unidades adyacentes se benefician de la Cobertura, no la unidad con la palabra clave en sí.',
  },
  faq_scout: {
    en: 'How does Scout deployment work?',
    es: '¿Cómo funciona el despliegue de Explorador?',
  },
  faq_scout_answer: {
    en: 'If a Scout unit deploys at the start of the game, it cannot move or attack. However, when you deploy as Scout once the game has started, you may perform a single simple action (activating a skill, casting a spell, etc.). If a unit is already deployed it cannot be redeployed. If you want to join a Character to a unit (so that it gains the keyword Scout/Ambusher by effect of a skill), leave both off the battlefield and place the Character\'s profile card under the unit\'s. When the unit deploys, the Character must deploy as part of it.',
    es: 'Si una unidad Explorador se despliega al inicio del juego, no puede moverse ni atacar. Sin embargo, cuando te despliegas como Explorador una vez que el juego ha comenzado, puedes realizar una única acción simple (activar una habilidad, lanzar un hechizo, etc.). Si una unidad ya está desplegada, no puede volver a desplegarse. Si quieres unir un Personaje a una unidad (para que gane la palabra clave Explorador/Emboscador por efecto de una habilidad), deja ambos fuera del campo de batalla y coloca la carta de perfil del Personaje debajo de la de la unidad. Cuando la unidad se despliegue, el Personaje debe desplegarse como parte de ella.',
  },
  faq_rounds: {
    en: 'What happens with rounds, turns and activations?',
    es: '¿Qué sucede con las rondas, turnos y activaciones?',
  },
  faq_rounds_answer: {
    en: 'If you don\'t have units on the battlefield (for example, they are Scout or Ambusher), you can pass or activate one of your Scout or Ambusher units. If in the middle of a round a company runs out of units on the table, scoring happens at the end of the round. You will have to pass until it ends. In case the effects of different skills, passive skills, command skills, or spells occur simultaneously, the player with the initiative decides which one is applied first.',
    es: 'Si no tienes unidades en el campo de batalla (por ejemplo, son Explorador o Emboscador), puedes pasar o activar una de tus unidades Explorador o Emboscador. Si en medio de una ronda una compañía se queda sin unidades en la mesa, la puntuación sucede al final de la ronda. Tendrás que pasar hasta que termine. En caso de que los efectos de diferentes habilidades, habilidades pasivas, habilidades de mando o hechizos ocurran simultáneamente, el jugador con la iniciativa decide cuál se aplica primero.',
  },
  faq_movement: {
    en: 'How does movement work with friendly units?',
    es: '¿Cómo funciona el movimiento con unidades aliadas?',
  },
  faq_movement_answer: {
    en: 'A unit can end its movement adjacent to a friendly unit. Allied units do not block movement. The unit leader can move through the other models of their own unit.',
    es: 'Una unidad puede terminar su movimiento adyacente a una unidad amiga. Las unidades aliadas no bloquean el movimiento. El líder de la unidad puede moverse a través de los otros modelos de su propia unidad.',
  },
  faq_charge: {
    en: 'How does Charge movement work?',
    es: '¿Cómo funciona el movimiento de Carga?',
  },
  faq_charge_answer: {
    en: 'There are no restrictions on Charge movement, as long as your leader ends up engaged with the enemy unit. You are allowed to not engage the closest enemy model at first and you are allowed to not take the shortest path. However, a unit is not allowed to engage in combat with multiple enemy units when it performs a charge or an assault. You must choose a single target when you charge or assault.',
    es: 'No hay restricciones en el movimiento de Carga, siempre que tu líder termine enfrentado a la unidad enemiga. Se te permite no enfrentarte al modelo enemigo más cercano primero y se te permite no tomar el camino más corto. Sin embargo, una unidad no puede enfrentarse en combate con múltiples unidades enemigas cuando realiza una carga o un asalto. Debes elegir un solo objetivo cuando cargas o asaltas.',
  },
  faq_objectives: {
    en: 'How is control of objectives calculated?',
    es: '¿Cómo se calcula el control de objetivos?',
  },
  faq_objectives_answer: {
    en: 'Control of an objective is always checked from the leader, not any model in the unit. Remember: Control of an objective is only checked when a unit ends its activation within 3 steps of it.',
    es: 'El control de un objetivo siempre se comprueba desde el líder, no desde cualquier modelo de la unidad. Recuerda: El control de un objetivo solo se comprueba cuando una unidad termina su activación a menos de 3 pasos de él.',
  },
  faq_stress: {
    en: 'How does stress and morale work?',
    es: '¿Cómo funciona el estrés y la moral?',
  },
  faq_stress_answer: {
    en: 'You can shoot into melee to stress your own unit. You can stress during an activation if you know that the stress from said activation will put you over the threshold, as long as you are under your MOR value.',
    es: 'Puedes disparar a la melé para estresar a tu propia unidad. Puedes estresarte durante una activación si sabes que el estrés de dicha activación te pondrá por encima del umbral, siempre y cuando estés por debajo de tu valor de MOR.',
  },
  faq_magic: {
    en: 'How do Magic and Dispel work?',
    es: '¿Cómo funcionan la Magia y Disipar?',
  },
  faq_magic_answer: {
    en: 'A Spellcaster can have more than one spell with duration active at the same time. Spells that resolve as "ranged attacks" follow the usual rules for ranged attacks. When a non-Spellcaster unit attempts to block a spell using the Dispel keyword, it does not suffer stress. You cannot Dispel and block a spell with a spellcaster at the same time - you must choose one method.',
    es: 'Un Lanzador de Hechizos puede tener más de un hechizo con duración activo al mismo tiempo. Los hechizos que se resuelven como "ataques a distancia" siguen las reglas habituales para ataques a distancia. Cuando una unidad que no es Lanzador de Hechizos intenta bloquear un hechizo usando la palabra clave Disipar, no sufre estrés. No puedes Disipar y bloquear un hechizo con un lanzador de hechizos al mismo tiempo - debes elegir un método.',
  },
  faq_tinge: {
    en: 'How does Tinge work?',
    es: '¿Cómo funciona el Tinte?',
  },
  faq_tinge_answer: {
    en: 'At the beginning of the round, you must check the effects of the tinge with each of your units affected by it, and you must do it separately. If there are multiple units in your company with tinge tokens, you must roll for each one and apply the corresponding effects separately.',
    es: 'Al comienzo de la ronda, debes verificar los efectos del tinte con cada una de tus unidades afectadas por él, y debes hacerlo por separado. Si hay varias unidades en tu compañía con fichas de tinte, debes tirar por cada una y aplicar los efectos correspondientes por separado.',
  },
};
