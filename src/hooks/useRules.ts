import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Section {
  id: string;
  title: string;
  content: string;
}

interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

// Spanish translations for static content
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
      content: "Los Personajes con la capacidad de unirse a una unidad tienen esto indicado en su perfil usando la palabra clave Unirse (X), donde \"X\" puede ser el nombre de una unidad, una característica, una palabra clave o varias grupos de ellos separados por líneas. (\"|\"). En el último caso, la unidad objetivo debe tener todos los palabras clave o características, o estar nombrada como al menos uno de los grupos\n\nLos Personajes que no tienen la palabra clave Unirse (X) no pueden unirse a ninguna unidad de ninguna manera.\n\nEjemplos:\n• Unirse (Infantería). El Personaje puede unirse a una unidad con la característica Infantería.\n• Unirse (Cazadores Orcos). El Personaje solo puede unirse a una unidad de \"Cazadores Orcos\".\n• Unirse (Infantería, Varank). El Personaje puede unirse a una unidad que tenga las características Infantería y Varank.\n• Unirse (Infantería, Ghent | Escudero). El Personaje puede unirse a una unidad que tenga las características Infantería y Ghent; o una unidad con la palabra clave Escudero.\n\nUna unidad no puede incluir más de un Personaje."
    },
    {
      id: "chain-of-command",
      title: "Comando en Cadena",
      content: "Los Personajes de tipo Oficial se convierten automáticamente en el líder de tropa del unidad a la que se unen."
    },
    {
      id: "characters-joining-unit",
      title: "Personajes uniendo a una unidad",
      content: "Puedes unir un Personaje a una unidad durante la desplazamiento o durante su activación."
    },
    {
      id: "join-during-deployment",
      title: "A. Unirse durante el desplazamiento",
      content: "Cuando estás a punto de desplegar tu Personaje, selecciona una de tus unidades ya desplegadas (que cumpla con los requisitos de su palabra clave Unirse y en la que no haya otro Personaje) y declara a tu oponente que tu Personaje está uniendo la unidad. Luego coloca el Personaje en el campo de batalla en formación con la unidad (puedes reubicar tropas para hacer espacio para ellos y asegurarte de que la unidad esté en formación).\n\nRecuerda que si el Personaje es de tipo Oficial, se convierte en el líder de tropa, por lo que las tropas de la unidad deben tener LdV hacia ellos y estar a 2 pasos.\n\nSi quieres desplegar tu Personaje con una unidad que esté desplegada en otro momento en el juego (por ejemplo, unidades de Cazador y Ambuscada), debes reservarlas ocultas y desplegarlas al mismo tiempo que desplegas la unidad."
    },
    {
      id: "join-during-activation",
      title: "B. Unirse durante la activación",
      content: "Durante la activación, tu Personaje puede unirse a una unidad (que cumpla con los requisitos de su palabra clave Unirse) siempre que:\n\n• No haya otros Personajes en la unidad.\n• La unidad no esté desmotivada.\n\nSi estos requisitos se cumplen, declara a tu oponente que el Personaje está uniendo la unidad. El único movimiento que tu Personaje puede realizar es el de movimiento (puedes moverte dos veces) y debe terminar su activación en formación con su nueva unidad (teniendo LdV y a 2 pasos del líder de tropa).\n\nAl final de su activación, en el caso de un Oficial, tu Personaje se convierte automáticamente en el líder de tropa, por lo que puedes intercambiar su posición con el anterior líder de tropa de la unidad para que todas las tropas estén en formación con el Personaje."
    },
    {
      id: "damage-stress-states",
      title: "Daño, estrés, estados y otros tokens",
      content: "Si tu Personaje tiene tokens en su perfil, haz lo siguiente para cada tipo de token:\n\n• Tokens de daño. El Personaje mantiene sus tokens de daño en su propio perfil. Mientras esté unido a una unidad, se ignorarán. Los tokens de daño solo se tomarán en cuenta de nuevo si la unidad es destruida o el Personaje se abandona ella."
    },
    {
      id: "character-game-profile",
      title: "Perfil de juego de Personaje en unidades",
      content: "Cuando un Personaje ha unido una unidad, debes usar su \"Perfil de juego de Personaje en unidad\". La unidad utilizará los valores que el Personaje comparte (por ejemplo, en el caso de los Oficiales, su WP).\n\nPara manejar esta unión más cómodamente, hemos diseñado las tarjetas con los perfiles de juego de tal manera que puedas colocar la tarjeta del Personaje debajo de la tarjeta de unidad, y por lo tanto, ambos perfiles se agruparán juntos.\n\nCuando estos valores sean absolutos, reemplazarán los de la unidad, mientras que si son modificadores (prefijados con \"+\") se añadirán a los de la unidad (aunque tenga un valor). Recuerda que cuando se modifica un lanzamiento, no puedes lanzar más de 3 dados de la misma color, por lo que ignora todos los dados de una color que excedan ese número."
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
      content: "La unidad puede usar las habilidades, habilidades de comando, habilidades pasivas y hechizos presentes en el \"Perfil de juego de Personaje en unidad\" como si fueran su propias, ya que es la unidad que activa y realiza las acciones."
    },
    {
      id: "characters-leaving-unit",
      title: "Personajes abandonando su unidad",
      content: "Para que tu Personaje abandone su unidad, sigue estos pasos:\n\n• Declara a tu oponente que tu Personaje está abandonando la unidad.\n• Tu Personaje puede realizar el movimiento acción hasta dos veces (este movimiento no genera ataques oportunos)\n• Tu Personaje ha sido activado, por lo que coloca un Token de activación en su perfil.\n• Si el Personaje es un Oficial, puedes colocar al líder de tropa de la unidad en la posición que ocupaba el Personaje para que todas las otras tropas estén en formación.\n\nCuando un Personaje abandona una unidad, la unidad regresa a los valores originales de sus atributos. Si su nivel de estrés excede su nivel original MOR, realiza una prueba de WP. Si no pasa, la unidad está desmotivada y debe huir inmediatamente. (Ver \"Estrés y morale. Huir\").\n\nRecuerda, cada vez que un Personaje abandone su unidad (o sea eliminado del juego debido a que se elimina), debes designar a un nuevo líder de tropa para la unidad."
    },
    {
      id: "damage-stress-tokens-leaving",
      title: "Tokens de daño, estrés, estados y otros tokens",
      content: "Si la unidad tiene tokens en su perfil, haz lo siguiente para cada tipo de token:\n\n• Tokens de daño. La unidad mantiene todos los tokens de daño. El Personaje solo mantiene los tokens de daño que tenía antes de unirse a la unidad.\n• Tokens de estrés. Recibe el mismo nivel de estrés que la unidad.\n• Tokens de estado. Coloca los mismos tokens de estado en tu Personaje que la unidad tiene.\n• Tokens de efectos. La unidad mantiene todos los tokens de efectos.\n\nLos Personajes no pueden unirse y unirse a una unidad (y viceversa) durante la misma activación."
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

export const useRules = () => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ["rules", language],
    queryFn: async () => {
      const { data: chaptersData, error: chaptersError } = await supabase
        .from("rules_chapters")
        .select("*")
        .order("order_index");

      if (chaptersError) throw chaptersError;

      const { data: sectionsData, error: sectionsError } = await supabase
        .from("rules_sections")
        .select("*")
        .order("order_index");

      if (sectionsError) throw sectionsError;

      // Find the basic concepts chapter and line of sight section
      const basicConceptsChapter = chaptersData.find(chapter => 
        chapter.title.toLowerCase().includes("basic concepts"));
      
      let lineOfSightSection = null;
      if (basicConceptsChapter) {
        lineOfSightSection = sectionsData.find(section => 
          section.chapter_id === basicConceptsChapter.id && 
          section.title.toLowerCase().includes("line of sight"));
      }
      
      // If we found the Line of Sight section, update its content with our custom formatted text
      if (lineOfSightSection) {
        if (language === 'en') {
          lineOfSightSection.content = `${lineOfSightSection.content}\n\nWhen calculating LoS, keep in mind that:\n\nA troop always has LOS towards itself and adjacent troops.\n\n[[red]]When calculating the LoS to a unit, the troops that make it up do not block the LoS to other members of the same unit. For example, when tracing LoS over an Orc Hunter unit, those in front do not block the LoS to those behind.[[/red]]`;
        } else {
          lineOfSightSection.content = `${lineOfSightSection.content}\n\nAl calcular la LdV, ten en cuenta que:\n\nUna tropa siempre tiene LdV hacia sí misma y las tropas adyacentes.\n\n[[red]]Al calcular la LdV hacia una unidad, las tropas que la componen no bloquean la LdV a otros miembros de la misma unidad. Por ejemplo, cuando se traza la LdV sobre una unidad de Cazadores Orcos, los que están delante no bloquean la LdV a los que están detrás.[[/red]]`;
        }
      }
      
      // Find the "Activate a unit and move" section and update it
      const activateAndMoveSection = sectionsData.find(section => 
        section.title.toLowerCase().includes("activate a unit and move"));
      
      if (activateAndMoveSection) {
        if (language === 'en') {
          activateAndMoveSection.content = `${activateAndMoveSection.content}\n\n[...] Keep in mind that:\n\n[[red]]Your unit can perform the move action and stand still.[[/red]]`;
        } else {
          activateAndMoveSection.content = `${activateAndMoveSection.content}\n\n[...] Ten en cuenta que:\n\n[[red]]Tu unidad puede realizar la acción de movimiento y permanecer inmóvil.[[/red]]`;
        }
      }

      const charactersChapter = language === 'en' ? {
        id: "characters",
        title: "Characters",
        sections: [
          {
            id: "characters-intro",
            title: "Characters",
            content: "Characters are single miniature units that feature the Character keyword in their profile. Depending on the strength of their leadership or their role in your company, we distinguish between Officers and Supports."
          },
          {
            id: "officers-and-supports",
            title: "Officers and Supports",
            content: "The type of Character a unit is is indicated by an icon on its profile.\n\nIn addition to fighting individually like any unit, Characters can join allied units to lead them, improve their capabilities, or give them unique abilities."
          },
          {
            id: "join-a-unit",
            title: "Join a Unit",
            content: "Characters with the ability to join a unit have it indicated in their profile using the keyword Join (X), where \"X\" can be the name of a unit, a characteristic, a keyword or several groups of them separated by lines. (\"|\"). In the latter case, the target unit must have all the keywords or characteristics, or be named as at least one of the groups\n\nCharacters who do not have the Join (X) keyword cannot join any unit in any way.\n\nExamples:\n• Join (Infantry). The Character can join a unit with the Infantry characteristic.\n• Join (Orc Hunters). The Character can only join a unit of \"Orc Hunters\".\n• Join (Infantry, Varank). The Character can join a unit that has the Infantry and Varank characteristics.\n• Join (Infantry, Ghent | Scout). The character can join a unit that has the Infantry and Ghent characteristics; or a unit with the Scout keyword.\n\nA unit cannot include more than one Character."
          },
          {
            id: "chain-of-command",
            title: "Chain of command",
            content: "Officer type Characters automatically become the troop leader of the unit they join."
          },
          {
            id: "characters-joining-unit",
            title: "Characters joining a unit",
            content: "You can join a Character to a unit during deployment or during its activation."
          },
          {
            id: "join-during-deployment",
            title: "A. Join during deployment",
            content: "When you are going to deploy your Character, select one of your units that is already deployed (that meets the requirements of its keyword Join and in which there is no other Character) and declare to your opponent that your Character is joining the unit. Then place the Character on the battlefield in formation with the unit (you can reposition troops to make room for them and ensure the unit is in formation).\n\nRemember that if the Character is of the Officer type they become the troop leader, so the unit's troops must have LoS towards them and be within 2 strides.\n\nIf you want to deploy your Character with a unit that is deployed at another time in the game (for example, Scout and Ambusher units), you must reserve them hidden and deploy them at the same time you deploy the unit."
          },
          {
            id: "join-during-activation",
            title: "B. Join during activation",
            content: "During activation, your Character can join a unit (that meets the requirements of its Join keyword) as long as:\n\n• There are no other Characters in the unit.\n• The unit is not demoralized.\n\nIf these requirements are met, declare to your opponent that the Character is joining the unit. The only action your Character can perform is move (you can move twice) and they must finish their activation in formation with their new unit (having LoS and being 2 strides from the troop leader).\n\nAt the end of their activation, in the case of an Officer, your Character automatically becomes the troop leader, so you can exchange their position with the previous troop leader of the unit so that all the troops are in formation with the Character."
          },
          {
            id: "damage-stress-states",
            title: "Damage, stress, states and other tokens",
            content: "If your Character has tokens on their profile, do the following for each type of token:\n\n• Damage tokens. The Character keeps their damage tokens on their own profile. While joined to a unit they will be ignored. Damage tokens are only be taken into account again if the unit is destroyed or the Character abandons it.\n• Stress tokens. Compare the stress level between the Character and the unit and leave the higher of the two on the unit.\n• State tokens. Place the Character's state tokens on the unit. Since you can only have one token of each state, remove any repeated states. (See \"States\").\n• Effects tokens. If the Character has any number of effects tokens assigned to them (for example, spells), they are transferred to the unit's profile.\n• Activation token. Remove the activation token from the Character."
          },
          {
            id: "character-game-profile",
            title: "Character game profile in units",
            content: "When a Character has joined a unit, you must use their \"Character in Unit\" game profile. The unit will make use of the values that the Character shares (for example, in the case of Officers, their WP).\n\nTo manage this union more comfortably, we have designed the cards with the game profiles so that you can place the Character card under the unit card, and therefore have both profiles grouped together.\n\nWhen these values are absolute, they will replace those of the unit, while if they are modifiers (they are preceded by \"+\") they are added to those of the unit (even if it has no value). Remember that when modifying a roll you cannot roll more than 3 dice of the same color, so ignore all dice of a color that exceed that amount."
          },
          {
            id: "combat",
            title: "Combat",
            content: "Characters participate with their unit in combat, providing their corresponding modifiers and switches if they have them."
          },
          {
            id: "characters-as-members",
            title: "Characters as members of a unit",
            content: "Officer type Characters count as another member of the unit when determining the number of troops participating in a combat (attacking and defending), as well as to quantify the unit's conquest value (although the Officer Character can modify it).\n\nSupports do not count towards the Number of troops in the unit\n\nCharacters inherit all keywords of the unit they join since, for all intents and purposes, you play with the unit's profile while the Character is included In it."
          },
          {
            id: "skills-and-spells",
            title: "Skills, Passive Skills, and Spells",
            content: "The unit can use the skills, command skills, passive skills and spells present in the \"Character in unit\" profile as if they were its own, since it is the unit that activates and performs the actions"
          },
          {
            id: "characters-leaving-unit",
            title: "Characters leaving their unit",
            content: "To have your Character leave their unit, follow these steps:\n\n• Declare to your opponent that your Character is leaving the unit.\n• Your Character can perform the move action up to two times (this movement does not generate opportunity attacks)\n• Your Character has been activated, so place an Activation token on their profile.\n• If the Character is an Officer, you can place the unit's troop leader in the position the Character was in so that all other troops are in formation.\n\nWhen a Character leaves a unit, the unit regains the original values of its attributes. If its stress level exceeds its original MOR, take a WP test. If you do not pass it, the unit is demoralized and must flee immediately. (See \"Stress and morale. Flee\").\n\nRemember, every time a Character leaves their unit (or is removed from the game because they are eliminated), you must designate a new leader troop for the unit."
          },
          {
            id: "damage-stress-tokens-leaving",
            title: "Damage, Stress, states and other tokens",
            content: "If the unit has tokens on its profile, do the following for each type of token:\n\n• Damage tokens. The unit keeps all damage tokens. The Character only keeps the damage tokens they had before joining the unit.\n• Stress tokens. The Character receives the same level of stress as the unit.\n• State tokens. Place the same state tokens on your Character as the unit has.\n• Effects tokens. The unit keeps all effect tokens.\n\nCharacters cannot leave and join a unit (and vice versa) during the same activation."
          },
          {
            id: "assign-damage-characters",
            title: "Assign damage to units with Characters",
            content: "Officer Characters that are part of a unit are the last to suffer damage, since they are the troop leader.\n\nSupport Characters that are part of a unit can be eliminated like any other troop. When the damage suffered equals the unit's W (Wounds) value, you can remove the Support Character instead of a trooper."
          },
          {
            id: "characters-destroyed-units",
            title: "Characters and destroyed units",
            content: "When all the troops of a unit are taken out of combat, deal the remaining damage to the Character. Since the unit has been destroyed, the Character is no longer part of it. Before removing the unit from the battlefield perform the following actions:\n\n• Separate the character and unit profile cards.\n• Transfer the corresponding tokens from the unit to the Character as indicated in the \"Damage, Stress, Status, and Other Tokens\" section.\n\nOnce these steps are completed, you can remove all of the unit's gaming elements from the game."
          }
        ]
      } : charactersChapterES;

      const typedChapters: Chapter[] = chaptersData.map(chapter => ({
        id: chapter.id,
        title: chapter.title,
        sections: sectionsData
          .filter((section) => section.chapter_id === chapter.id)
          .map((section) => ({
            id: section.id,
            title: section.title,
            content: section.content,
          })),
      }));

      const stressAndMoraleIndex = typedChapters.findIndex(chapter => 
        chapter.title.toLowerCase().includes("stress and morale")
      );

      if (stressAndMoraleIndex !== -1) {
        typedChapters.splice(stressAndMoraleIndex + 1, 0, charactersChapter);
      } else {
        typedChapters.push(charactersChapter);
      }

      return typedChapters;
    },
  });
};

export type { Section, Chapter };
