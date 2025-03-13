
import { UnitProfile } from "@/types/extended-unit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UnitProfileBlockProps {
  profile: UnitProfile;
  title: string;
}

const UnitProfileBlock = ({ profile, title }: UnitProfileBlockProps) => {
  return (
    <div className="bg-warcrow-accent rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold text-warcrow-gold mb-3">{title}</h3>
      
      {profile.range && (
        <div className="mb-4 bg-warcrow-background/30 p-2 rounded">
          <span className="font-semibold text-warcrow-gold">Range:</span>{" "}
          <span className="text-warcrow-text">{profile.range} strides</span>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow className="border-b border-warcrow-gold/30">
            <TableHead className="text-warcrow-gold font-medium">Attack Type</TableHead>
            <TableHead className="text-warcrow-gold font-medium">Modifier</TableHead>
            <TableHead className="text-warcrow-gold font-medium">Dice Colors</TableHead>
            <TableHead className="text-warcrow-gold font-medium">Switches</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profile.ranged && (
            <TableRow className="border-b border-warcrow-background/20 hover:bg-warcrow-background/10">
              <TableCell className="text-warcrow-text font-medium">Ranged</TableCell>
              <TableCell className="text-warcrow-text">{profile.ranged.modifier || "-"}</TableCell>
              <TableCell>
                <span className="text-lg font-bold text-warcrow-text">{profile.ranged.diceColors}</span>
              </TableCell>
              <TableCell className="text-warcrow-text">
                {profile.ranged.switchValue && (
                  <div className="mb-1 bg-warcrow-background/20 p-1.5 rounded">
                    <span className="font-semibold text-warcrow-gold">{profile.ranged.switchValue}:</span> <span>{profile.ranged.switch1}</span>
                  </div>
                )}
                {profile.ranged.switchValue2 && (
                  <div className="mb-1 bg-warcrow-background/20 p-1.5 rounded">
                    <span className="font-semibold text-warcrow-gold">{profile.ranged.switchValue2}:</span> <span>{profile.ranged.switch2}</span>
                  </div>
                )}
                {profile.ranged.switchValue3 && (
                  <div className="bg-warcrow-background/20 p-1.5 rounded">
                    <span className="font-semibold text-warcrow-gold">{profile.ranged.switchValue3}:</span> <span>{profile.ranged.switch3}</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
          <TableRow className="border-b border-warcrow-background/20 hover:bg-warcrow-background/10">
            <TableCell className="text-warcrow-text font-medium">Attack</TableCell>
            <TableCell className="text-warcrow-text">{profile.attack.modifier || "-"}</TableCell>
            <TableCell>
              <span className="text-lg font-bold text-warcrow-text">{profile.attack.diceColors}</span>
            </TableCell>
            <TableCell className="text-warcrow-text">
              {profile.attack.switchValue && (
                <div className="mb-1 bg-warcrow-background/20 p-1.5 rounded">
                  <span className="font-semibold text-warcrow-gold">{profile.attack.switchValue}:</span> <span>{profile.attack.switch1}</span>
                </div>
              )}
              {profile.attack.switchValue2 && (
                <div className="mb-1 bg-warcrow-background/20 p-1.5 rounded">
                  <span className="font-semibold text-warcrow-gold">{profile.attack.switchValue2}:</span> <span>{profile.attack.switch2}</span>
                </div>
              )}
              {profile.attack.switchValue3 && (
                <div className="bg-warcrow-background/20 p-1.5 rounded">
                  <span className="font-semibold text-warcrow-gold">{profile.attack.switchValue3}:</span> <span>{profile.attack.switch3}</span>
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow className="hover:bg-warcrow-background/10">
            <TableCell className="text-warcrow-text font-medium">Defense</TableCell>
            <TableCell className="text-warcrow-text">{profile.defense.modifier || "-"}</TableCell>
            <TableCell>
              <span className="text-lg font-bold text-warcrow-text">{profile.defense.diceColors}</span>
            </TableCell>
            <TableCell className="text-warcrow-text">
              {profile.defense.switchValue && (
                <div className="mb-1 bg-warcrow-background/20 p-1.5 rounded">
                  <span className="font-semibold text-warcrow-gold">{profile.defense.switchValue}:</span> <span>{profile.defense.switch1}</span>
                </div>
              )}
              {profile.defense.switchValue2 && (
                <div className="mb-1 bg-warcrow-background/20 p-1.5 rounded">
                  <span className="font-semibold text-warcrow-gold">{profile.defense.switchValue2}:</span> <span>{profile.defense.switch2}</span>
                </div>
              )}
              {profile.defense.switchValue3 && (
                <div className="bg-warcrow-background/20 p-1.5 rounded">
                  <span className="font-semibold text-warcrow-gold">{profile.defense.switchValue3}:</span> <span>{profile.defense.switch3}</span>
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default UnitProfileBlock;
