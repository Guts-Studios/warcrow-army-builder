
import { UnitAbility } from "@/types/extended-unit";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UnitAbilitiesBlockProps {
  title: string;
  abilities: UnitAbility[];
  className?: string;
}

const UnitAbilitiesBlock = ({ title, abilities, className }: UnitAbilitiesBlockProps) => {
  if (abilities.length === 0) {
    return null;
  }

  return (
    <div className={`bg-warcrow-accent rounded-lg p-4 shadow-md ${className}`}>
      <h3 className="text-lg font-semibold text-warcrow-gold mb-3">{title}</h3>
      
      <Accordion type="single" collapsible className="w-full">
        {abilities.map((ability, index) => (
          <AccordionItem 
            key={index} 
            value={`${index}`}
            className="border-b border-warcrow-gold/30 last:border-0"
          >
            <AccordionTrigger className="text-warcrow-gold hover:text-warcrow-gold/80 font-medium py-3">
              {ability.name}
            </AccordionTrigger>
            <AccordionContent className="text-warcrow-text leading-relaxed pt-2 pb-4 whitespace-pre-line text-base">
              {ability.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default UnitAbilitiesBlock;
