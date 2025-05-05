
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
  // Adding all the new FAQ items
  faq_face_to_face: {
    en: 'How do face to face rolls work in combat?',
    es: '¿Cómo funcionan las tiradas cara a cara en combate?',
  },
  faq_face_to_face_answer: {
    en: 'If during a face to face roll in combat one of the units disengages (for example, due to a switch), you must still resolve the face to face roll even though both units disengage during any of the steps.',
    es: 'Si durante una tirada cara a cara en combate una de las unidades se desvincula (por ejemplo, debido a un cambio), aún debes resolver la tirada cara a cara aunque ambas unidades se desvinculen durante cualquiera de los pasos.',
  },
  faq_repeat_die: {
    en: 'How do die repetitions work?',
    es: '¿Cómo funcionan las repeticiones de dados?',
  },
  faq_repeat_die_answer: {
    en: 'If you can repeat a die or a roll and your opponent has a skill that forces you to repeat as well, you resolve all your repetitions first (in the order you want) and then resolve the effects indicated by the skills of your opponent.',
    es: 'Si puedes repetir un dado o una tirada y tu oponente tiene una habilidad que te obliga a repetir también, resuelves todas tus repeticiones primero (en el orden que quieras) y luego resuelves los efectos indicados por las habilidades de tu oponente.',
  },
  faq_engage: {
    en: 'How does engaging with enemy units work?',
    es: '¿Cómo funciona el enfrentamiento con unidades enemigas?',
  },
  faq_engage_answer: {
    en: 'Skills like Tundra Marauder\'s Snow Leopard Tattoo allow you to Displace (X) and engage with enemy units. To engage you need your leader to come in contact with any troop of the enemy unit. If the leader of your unit cannot reach the enemy, you cannot engage with any other troop of the unit.',
    es: 'Habilidades como el Tatuaje del Leopardo de las Nieves de los Merodeadores de la Tundra te permiten Desplazar (X) y enfrentarte con unidades enemigas. Para enfrentarte necesitas que tu líder entre en contacto con cualquier tropa de la unidad enemiga. Si el líder de tu unidad no puede alcanzar al enemigo, no puedes enfrentarte con ninguna otra tropa de la unidad.',
  },
  faq_lose_combat: {
    en: 'What happens when you lose combat?',
    es: '¿Qué sucede cuando pierdes el combate?',
  },
  faq_lose_combat_answer: {
    en: 'You\'d lose the combat and therefore suffer 1 stress. However, you can benefit from the extra movement for destroying a unit.',
    es: 'Perderías el combate y, por lo tanto, sufrirías 1 de estrés. Sin embargo, puedes beneficiarte del movimiento extra por destruir una unidad.',
  },
  faq_modifiers: {
    en: 'How do multiple modifiers work?',
    es: '¿Cómo funcionan múltiples modificadores?',
  },
  faq_modifiers_answer: {
    en: 'If a unit has a modifier and so does the Character who joined it, you must stress for each of the modifiers separately if you want to activate different modifiers.',
    es: 'Si una unidad tiene un modificador y también lo tiene el Personaje que se unió a ella, debes estresarte por cada uno de los modificadores por separado si quieres activar diferentes modificadores.',
  },
  faq_positioning: {
    en: 'How do positioning maneuvers work?',
    es: '¿Cómo funcionan las maniobras de posicionamiento?',
  },
  faq_positioning_answer: {
    en: 'During positioning maneuvers, there is no maximum distance the models can displace to be engaged again with the enemy. If after finishing a combat only the leaders remain and they are distanced, this situation should not occur (see Updates).',
    es: 'Durante las maniobras de posicionamiento, no hay una distancia máxima que los modelos puedan desplazar para volver a enfrentarse con el enemigo. Si después de terminar un combate solo quedan los líderes y están distanciados, esta situación no debería ocurrir (ver Actualizaciones).',
  },
  faq_remove_troops: {
    en: 'Who decides which troops are removed as casualties?',
    es: '¿Quién decide qué tropas se eliminan como bajas?',
  },
  faq_remove_troops_answer: {
    en: 'The owner of the miniatures that suffer the damage decides which miniatures are removed when there are casualties.',
    es: 'El dueño de las miniaturas que sufren el daño decide qué miniaturas se eliminan cuando hay bajas.',
  },
  faq_switches: {
    en: 'How do combat switches work?',
    es: '¿Cómo funcionan los cambios en combate?',
  },
  faq_switches_answer: {
    en: 'If you eliminate a unit with the switches, the combat still resolves all the combat steps indicated in the rules. For Displace as a defensive switch, you move before the damage is distributed, but despite displacing and thus disengaging, the combat continues and resolves until the end. Displacement and placement switches do not prevent you from receiving damage.',
    es: 'Si eliminas una unidad con los cambios, el combate aún resuelve todos los pasos de combate indicados en las reglas. Para Desplazar como un cambio defensivo, te mueves antes de que se distribuya el daño, pero a pesar de desplazarte y, por lo tanto, desvincularte, el combate continúa y se resuelve hasta el final. Los cambios de desplazamiento y colocación no evitan que recibas daño.',
  },
  faq_hostile_unit: {
    en: 'How do ranged attacks against Hostile units work?',
    es: '¿Cómo funcionan los ataques a distancia contra unidades Hostiles?',
  },
  faq_hostile_unit_answer: {
    en: 'If the Hostile unit is engaged with an enemy unit, this unit suffers stress if you attack the Hostile unit with a ranged attack.',
    es: 'Si la unidad Hostil está enfrentada a una unidad enemiga, esta unidad sufre estrés si atacas a la unidad Hostil con un ataque a distancia.',
  },
  faq_hold_shoot: {
    en: 'How does Hold and shoot work?',
    es: '¿Cómo funciona Mantener y disparar?',
  },
  faq_hold_shoot_answer: {
    en: 'One of the conditions to be able to shoot (including Hold and shoot) is not being engaged. You must choose a moment in which you are not engaged with the charging unit. While Hold and shoot rules don\'t allow the use of switches, a unit that uses Hold and shoot can benefit from passive skills related to ranged attacks. If a unit with a joined Officer loses all of its troops due to Hold and shoot of the target the unit was charging, the Character must use their MOV to charge. Should they not be able to move to engage, the action ends immediately.',
    es: 'Una de las condiciones para poder disparar (incluyendo Mantener y disparar) es no estar enfrentado. Debes elegir un momento en el que no estés enfrentado con la unidad que carga. Mientras que las reglas de Mantener y disparar no permiten el uso de cambios, una unidad que usa Mantener y disparar puede beneficiarse de habilidades pasivas relacionadas con ataques a distancia. Si una unidad con un Oficial unido pierde todas sus tropas debido a Mantener y disparar del objetivo al que la unidad estaba cargando, el Personaje debe usar su MOV para cargar. Si no pueden moverse para enfrentarse, la acción termina inmediatamente.',
  },
  faq_ranged_attack: {
    en: 'How do skills affect ranged attacks?',
    es: '¿Cómo afectan las habilidades a los ataques a distancia?',
  },
  faq_ranged_attack_answer: {
    en: 'If, as part of the effects of a skill, you perform or resolve a ranged attack and the skill specifies a value for the ranged attack, you cannot use your unit\'s ranged attack switches. If it only states to make a ranged attack, you will have to use the ranged attack roll and, therefore, have its switches accessible.',
    es: 'Si, como parte de los efectos de una habilidad, realizas o resuelves un ataque a distancia y la habilidad especifica un valor para el ataque a distancia, no puedes usar los cambios de ataque a distancia de tu unidad. Si solo indica hacer un ataque a distancia, tendrás que usar la tirada de ataque a distancia y, por lo tanto, tener sus cambios accesibles.',
  },
  faq_join_unit: {
    en: 'How does joining units work?',
    es: '¿Cómo funciona la unión de unidades?',
  },
  faq_join_unit_answer: {
    en: 'If your Character joins a unit that has not activated during the round and you get to the "No one gets left behind" step, they can move since the Character removes their activation token when joining. If a Character with a ranged attack bonus joins a unit without a ranged attack, that bonus is not applied since the unit itself cannot perform a ranged attack. A Character who joined a unit is considered a member of the unit and not an independent unit. For a Support Character inside a unit with a bonus skill that affects a target within X strides, all measurements must be made from the leader of said unit.',
    es: 'Si tu Personaje se une a una unidad que no se ha activado durante la ronda y llegas al paso "Nadie se queda atrás", pueden moverse ya que el Personaje elimina su ficha de activación al unirse. Si un Personaje con un bono de ataque a distancia se une a una unidad sin ataque a distancia, ese bono no se aplica ya que la unidad en sí no puede realizar un ataque a distancia. Un Personaje que se unió a una unidad se considera un miembro de la unidad y no una unidad independiente. Para un Personaje de Apoyo dentro de una unidad con una habilidad de bonificación que afecta a un objetivo dentro de X zancadas, todas las mediciones deben hacerse desde el líder de dicha unidad.',
  },
  faq_abandon_unit: {
    en: 'What happens when a Character leaves a unit?',
    es: '¿Qué sucede cuando un Personaje abandona una unidad?',
  },
  faq_abandon_unit_answer: {
    en: 'When a Character leaves a unit, the unit does not receive an activation token. A Character leaving their unit can move through friendly troops that are part of the unit they are leaving.',
    es: 'Cuando un Personaje abandona una unidad, la unidad no recibe una ficha de activación. Un Personaje que abandona su unidad puede moverse a través de tropas amigas que son parte de la unidad que está abandonando.',
  },
  faq_objective_control: {
    en: 'Can demoralized units control objectives?',
    es: '¿Pueden las unidades desmoralizadas controlar objetivos?',
  },
  faq_objective_control_answer: {
    en: 'No. Demoralized units should not be considered for objective control (treat them as if they were not on the battlefield).',
    es: 'No. Las unidades desmoralizadas no deben considerarse para el control de objetivos (trátalas como si no estuvieran en el campo de batalla).',
  },
  faq_command_skills: {
    en: 'Can demoralized units use command skills?',
    es: '¿Pueden las unidades desmoralizadas usar habilidades de mando?',
  },
  faq_command_skills_answer: {
    en: 'No, demoralized units cannot use command skills (see Updates).',
    es: 'No, las unidades desmoralizadas no pueden usar habilidades de mando (ver Actualizaciones).',
  },
  faq_disarmed: {
    en: 'How do the disarmed and vulnerable states work?',
    es: '¿Cómo funcionan los estados desarmado y vulnerable?',
  },
  faq_disarmed_answer: {
    en: 'The states disarmed and vulnerable apply after rolling the dice and before the switches.',
    es: 'Los estados desarmado y vulnerable se aplican después de tirar los dados y antes de los cambios.',
  },
  faq_frightened: {
    en: 'How does the frightened state interact with WP tests?',
    es: '¿Cómo interactúa el estado asustado con las pruebas de WP?',
  },
  faq_frightened_answer: {
    en: 'When a unit has a skill that allows it to repeat its failed WP tests and then suffers the frightener state, the state must be applied whenever applicable. If the first roll is successful, repeat for frightened and you can use your ability to repeat later. If the first roll is unsuccessful: repeat for the skill and in case of success, repeat for frightened.',
    es: 'Cuando una unidad tiene una habilidad que le permite repetir sus pruebas de WP fallidas y luego sufre el estado atemorizador, el estado debe aplicarse cuando sea aplicable. Si la primera tirada tiene éxito, repite para asustado y puedes usar tu habilidad para repetir más tarde. Si la primera tirada no tiene éxito: repite para la habilidad y en caso de éxito, repite para asustado.',
  },
  faq_traps: {
    en: 'What happens when multiple Traps activate simultaneously?',
    es: '¿Qué sucede cuando se activan varias Trampas simultáneamente?',
  },
  faq_traps_answer: {
    en: 'If two Traps activate at the same time, the player with the initiative decides the order of activation of the Traps.',
    es: 'Si dos Trampas se activan al mismo tiempo, el jugador con la iniciativa decide el orden de activación de las Trampas.',
  },
  faq_rugged: {
    en: 'How does the Rugged keyword work?',
    es: '¿Cómo funciona la palabra clave Robusto?',
  },
  faq_rugged_answer: {
    en: 'If no \'X\' value is specified for Rugged, the effect applies to all units.',
    es: 'Si no se especifica ningún valor \'X\' para Robusto, el efecto se aplica a todas las unidades.',
  },
  faq_war_surgeon: {
    en: 'How does the War Surgeon\'s "Medic!" ability work?',
    es: '¿Cómo funciona la habilidad "¡Médico!" del Cirujano de Guerra?',
  },
  faq_war_surgeon_answer: {
    en: 'You should roll "Medic!" every time the unit is about to suffer damage, first during the switches step (all damage from switches should be added into one total), and then at the resolution.',
    es: 'Deberías tirar "¡Médico!" cada vez que la unidad esté a punto de sufrir daño, primero durante el paso de los cambios (todo el daño de los cambios debe sumarse en un total), y luego en la resolución.',
  },
  faq_lady_telia: {
    en: 'How does Lady Télia\'s "Headshot" skill work?',
    es: '¿Cómo funciona la habilidad "Disparo a la cabeza" de Lady Télia?',
  },
  faq_lady_telia_answer: {
    en: 'If Lady Télia performs her "Headshot" skill against an Elite Character inside a unit without Elite, this Character can apply Elite to their defense roll, since they are using their own profile and not the unit\'s. The Character should defend using their profile defense value as if they were alone and not joined to a unit (therefore including automatic symbols should they have any).',
    es: 'Si Lady Télia realiza su habilidad "Disparo a la cabeza" contra un Personaje de Élite dentro de una unidad sin Élite, este Personaje puede aplicar Élite a su tirada de defensa, ya que está usando su propio perfil y no el de la unidad. El Personaje debe defenderse usando su valor de defensa de perfil como si estuvieran solos y no unidos a una unidad (por lo tanto, incluye símbolos automáticos si los tienen).',
  },
  faq_pioneers: {
    en: 'How do the Pioneers\' abilities work?',
    es: '¿Cómo funcionan las habilidades de los Pioneros?',
  },
  faq_pioneers_answer: {
    en: 'If the Pioneers use their "Mortar" skill, and Lady Télia has joined the unit, they do not add her auto SUCCESS to that roll, as the skill specifies how to create the roll based on the number of troops. For the "Trench yourselves!" rule, there are two separate effects: the first has the condition of non-activation and the second always applies.',
    es: 'Si los Pioneros usan su habilidad "Mortero", y Lady Télia se ha unido a la unidad, no añaden su ÉXITO automático a esa tirada, ya que la habilidad especifica cómo crear la tirada en función del número de tropas. Para la regla "¡Atrincheraos!", hay dos efectos separados: el primero tiene la condición de no activación y el segundo siempre se aplica.',
  },
  faq_bulwarks: {
    en: 'Can Bulwarks taunt units already in combat?',
    es: '¿Pueden los Baluartes provocar a unidades ya en combate?',
  },
  faq_bulwarks_answer: {
    en: 'No, you cannot taunt a unit already engaged in combat, since charging is not an action a unit can perform while being engaged.',
    es: 'No, no puedes provocar a una unidad ya enfrentada en combate, ya que cargar no es una acción que una unidad pueda realizar mientras está enfrentada.',
  },
  faq_trabor: {
    en: 'How do Trabor\'s Automata work?',
    es: '¿Cómo funcionan los Autómatas de Trabor?',
  },
  faq_trabor_answer: {
    en: 'Automata use Trabor\'s MOV values and move only when Trabor does. The second person in the Automata chart refers exclusively to Trabor. Automata are Trabor\'s tokens from the Warcrow Adventures expansion pack, not considered a unit of 3 troops, therefore they do not need to stay in formation.',
    es: 'Los Autómatas usan los valores de MOV de Trabor y se mueven solo cuando Trabor lo hace. La segunda persona en la tabla de Autómatas se refiere exclusivamente a Trabor. Los Autómatas son fichas de Trabor del paquete de expansión Warcrow Adventures, no se consideran una unidad de 3 tropas, por lo tanto no necesitan mantener una formación.',
  },
  faq_evoker: {
    en: 'How do the Evoker\'s spells work?',
    es: '¿Cómo funcionan los hechizos del Evocador?',
  },
  faq_evoker_answer: {
    en: 'If a unit under the effects of Spirit of the Thermapleurus and the second alteration charges against an enemy unit and suffers stress due to Intimidating, the target of the charge flees and the charging unit loses the charge. For the Summon the rock spell\'s second alteration, the spell has a single target and the alteration grants the Remains active property to the effect: at the beginning of its activation, the target and all units within 5 strides suffer the slowed state. If the target never activates, nobody gets slowed.',
    es: 'Si una unidad bajo los efectos de Espíritu del Thermapleurus y la segunda alteración carga contra una unidad enemiga y sufre estrés debido a Intimidante, el objetivo de la carga huye y la unidad que carga pierde la carga. Para la segunda alteración del hechizo Invocar la roca, el hechizo tiene un solo objetivo y la alteración otorga la propiedad Permanece activo al efecto: al comienzo de su activación, el objetivo y todas las unidades dentro de 5 zancadas sufren el estado ralentizado. Si el objetivo nunca se activa, nadie se ralentiza.',
  },
  faq_dice_symbols: {
    en: 'How do dice and symbols work?',
    es: '¿Cómo funcionan los dados y símbolos?',
  },
  faq_dice_symbols_answer: {
    en: 'Dice symbols represent different outcomes and effects in the game. Each symbol has a specific meaning and impact on gameplay.',
    es: 'Los símbolos de dados representan diferentes resultados y efectos en el juego. Cada símbolo tiene un significado específico y un impacto en la jugabilidad.',
  },
  faq_pass: {
    en: 'What happens when you cannot activate any units?',
    es: '¿Qué sucede cuando no puedes activar ninguna unidad?',
  },
  faq_pass_answer: {
    en: 'If it\'s your activation and you don\'t have any units you can legally activate, you must pass.',
    es: 'Si es tu activación y no tienes ninguna unidad que puedas activar legalmente, debes pasar.',
  },
};
