
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
    <div className="bg-warcrow-accent rounded-lg p-4">
      <h3 className="text-lg font-semibold text-warcrow-gold mb-2">{title}</h3>
      
      {profile.range && (
        <div className="mb-4">
          <span className="font-semibold text-warcrow-text">Range:</span>{" "}
          <span>{profile.range} strides</span>
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Attack Type</TableHead>
            <TableHead>Modifier</TableHead>
            <TableHead>Dice Colors</TableHead>
            <TableHead>Switches</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profile.ranged && (
            <TableRow>
              <TableCell>Ranged</TableCell>
              <TableCell>{profile.ranged.modifier || "-"}</TableCell>
              <TableCell>
                <span className="text-lg">{profile.ranged.diceColors}</span>
              </TableCell>
              <TableCell>
                {profile.ranged.switchValue && (
                  <div className="mb-1">
                    <span className="font-semibold">{profile.ranged.switchValue}:</span> {profile.ranged.switch1}
                  </div>
                )}
                {profile.ranged.switchValue2 && (
                  <div className="mb-1">
                    <span className="font-semibold">{profile.ranged.switchValue2}:</span> {profile.ranged.switch2}
                  </div>
                )}
                {profile.ranged.switchValue3 && (
                  <div>
                    <span className="font-semibold">{profile.ranged.switchValue3}:</span> {profile.ranged.switch3}
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
          <TableRow>
            <TableCell>Attack</TableCell>
            <TableCell>{profile.attack.modifier || "-"}</TableCell>
            <TableCell>
              <span className="text-lg">{profile.attack.diceColors}</span>
            </TableCell>
            <TableCell>
              {profile.attack.switchValue && (
                <div className="mb-1">
                  <span className="font-semibold">{profile.attack.switchValue}:</span> {profile.attack.switch1}
                </div>
              )}
              {profile.attack.switchValue2 && (
                <div className="mb-1">
                  <span className="font-semibold">{profile.attack.switchValue2}:</span> {profile.attack.switch2}
                </div>
              )}
              {profile.attack.switchValue3 && (
                <div>
                  <span className="font-semibold">{profile.attack.switchValue3}:</span> {profile.attack.switch3}
                </div>
              )}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Defense</TableCell>
            <TableCell>{profile.defense.modifier || "-"}</TableCell>
            <TableCell>
              <span className="text-lg">{profile.defense.diceColors}</span>
            </TableCell>
            <TableCell>
              {profile.defense.switchValue && (
                <div className="mb-1">
                  <span className="font-semibold">{profile.defense.switchValue}:</span> {profile.defense.switch1}
                </div>
              )}
              {profile.defense.switchValue2 && (
                <div className="mb-1">
                  <span className="font-semibold">{profile.defense.switchValue2}:</span> {profile.defense.switch2}
                </div>
              )}
              {profile.defense.switchValue3 && (
                <div>
                  <span className="font-semibold">{profile.defense.switchValue3}:</span> {profile.defense.switch3}
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
