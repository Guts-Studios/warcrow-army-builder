
import { UnitProfile } from "@/types/extended-unit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnitProfileBlockProps {
  profile: UnitProfile;
  title: string;
}

const UnitProfileBlock = ({ profile, title }: UnitProfileBlockProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold text-warcrow-gold mb-3">{title}</h3>
      
      {profile.range && (
        <div className="mb-4 bg-warcrow-background/30 p-2 rounded">
          <span className="font-semibold text-warcrow-gold">Range:</span>{" "}
          <span className="text-warcrow-text">{profile.range} strides</span>
        </div>
      )}
      
      <div className="overflow-x-auto -mx-4 px-4">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-warcrow-gold/30">
              <TableHead className="text-warcrow-gold font-medium">Type</TableHead>
              <TableHead className="text-warcrow-gold font-medium">Modifier</TableHead>
              <TableHead className="text-warcrow-gold font-medium">Dice Colors</TableHead>
              <TableHead className="text-warcrow-gold font-medium">Switches</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.ranged && (
              <TableRow className="border-b border-warcrow-background/20 hover:bg-warcrow-background/10">
                <TableCell className="text-warcrow-text font-medium whitespace-nowrap">Ranged</TableCell>
                <TableCell className="text-warcrow-text">{profile.ranged.modifier || "-"}</TableCell>
                <TableCell>
                  <span className="text-lg font-bold text-warcrow-text">{profile.ranged.diceColors}</span>
                </TableCell>
                <TableCell className="text-warcrow-text">
                  <div className="flex flex-col gap-1.5">
                    {profile.ranged.switchValue && (
                      <div className="bg-warcrow-background/20 p-1.5 rounded">
                        <span className="font-semibold text-warcrow-gold">{profile.ranged.switchValue}:</span> <span>{profile.ranged.switch1}</span>
                      </div>
                    )}
                    {profile.ranged.switchValue2 && (
                      <div className="bg-warcrow-background/20 p-1.5 rounded">
                        <span className="font-semibold text-warcrow-gold">{profile.ranged.switchValue2}:</span> <span>{profile.ranged.switch2}</span>
                      </div>
                    )}
                    {profile.ranged.switchValue3 && (
                      <div className="bg-warcrow-background/20 p-1.5 rounded">
                        <span className="font-semibold text-warcrow-gold">{profile.ranged.switchValue3}:</span> <span>{profile.ranged.switch3}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
            <TableRow className="border-b border-warcrow-background/20 hover:bg-warcrow-background/10">
              <TableCell className="text-warcrow-text font-medium whitespace-nowrap">Attack</TableCell>
              <TableCell className="text-warcrow-text">{profile.attack.modifier || "-"}</TableCell>
              <TableCell>
                <span className="text-lg font-bold text-warcrow-text">{profile.attack.diceColors}</span>
              </TableCell>
              <TableCell className="text-warcrow-text">
                <div className="flex flex-col gap-1.5">
                  {profile.attack.switchValue && (
                    <div className="bg-warcrow-background/20 p-1.5 rounded">
                      <span className="font-semibold text-warcrow-gold">{profile.attack.switchValue}:</span> <span>{profile.attack.switch1}</span>
                    </div>
                  )}
                  {profile.attack.switchValue2 && (
                    <div className="bg-warcrow-background/20 p-1.5 rounded">
                      <span className="font-semibold text-warcrow-gold">{profile.attack.switchValue2}:</span> <span>{profile.attack.switch2}</span>
                    </div>
                  )}
                  {profile.attack.switchValue3 && (
                    <div className="bg-warcrow-background/20 p-1.5 rounded">
                      <span className="font-semibold text-warcrow-gold">{profile.attack.switchValue3}:</span> <span>{profile.attack.switch3}</span>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="hover:bg-warcrow-background/10">
              <TableCell className="text-warcrow-text font-medium whitespace-nowrap">Defense</TableCell>
              <TableCell className="text-warcrow-text">{profile.defense.modifier || "-"}</TableCell>
              <TableCell>
                <span className="text-lg font-bold text-warcrow-text">{profile.defense.diceColors}</span>
              </TableCell>
              <TableCell className="text-warcrow-text">
                <div className="flex flex-col gap-1.5">
                  {profile.defense.switchValue && (
                    <div className="bg-warcrow-background/20 p-1.5 rounded">
                      <span className="font-semibold text-warcrow-gold">{profile.defense.switchValue}:</span> <span>{profile.defense.switch1}</span>
                    </div>
                  )}
                  {profile.defense.switchValue2 && (
                    <div className="bg-warcrow-background/20 p-1.5 rounded">
                      <span className="font-semibold text-warcrow-gold">{profile.defense.switchValue2}:</span> <span>{profile.defense.switch2}</span>
                    </div>
                  )}
                  {profile.defense.switchValue3 && (
                    <div className="bg-warcrow-background/20 p-1.5 rounded">
                      <span className="font-semibold text-warcrow-gold">{profile.defense.switchValue3}:</span> <span>{profile.defense.switch3}</span>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UnitProfileBlock;
