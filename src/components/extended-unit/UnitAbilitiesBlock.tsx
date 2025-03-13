
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
    <div className={`bg-warcrow-accent rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-warcrow-gold mb-2">{title}</h3>
      
      <Accordion type="single" collapsible className="w-full">
        {abilities.map((ability, index) => (
          <AccordionItem key={index} value={`${index}`}>
            <AccordionTrigger className="text-warcrow-text font-medium">
              {ability.name}
            </AccordionTrigger>
            <AccordionContent className="text-warcrow-text">
              {ability.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default UnitAbilitiesBlock;
