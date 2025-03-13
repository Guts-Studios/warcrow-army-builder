
import { ExtendedUnitStats } from "@/types/extended-unit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UnitStatBlockProps {
  stats: ExtendedUnitStats;
}

const UnitStatBlock = ({ stats }: UnitStatBlockProps) => {
  return (
    <div className="bg-warcrow-accent rounded-lg p-4">
      <h3 className="text-lg font-semibold text-warcrow-gold mb-2">Base Statistics</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>MOV</TableHead>
            <TableHead>W</TableHead>
            <TableHead>WP</TableHead>
            <TableHead>MOR</TableHead>
            <TableHead>AVB</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Conquest</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{stats.mov}</TableCell>
            <TableCell>{stats.w}</TableCell>
            <TableCell>{stats.wp}</TableCell>
            <TableCell>{stats.mor}</TableCell>
            <TableCell>{stats.avb}</TableCell>
            <TableCell>{stats.members}</TableCell>
            <TableCell>{stats.conquest}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      
      <div className="mt-4">
        <h4 className="font-semibold text-warcrow-text">Characteristics</h4>
        <div className="flex flex-wrap gap-2 mt-1">
          {stats.characteristics.map((characteristic, index) => (
            <span key={index} className="px-2 py-1 bg-warcrow-background text-sm rounded">
              {characteristic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitStatBlock;
