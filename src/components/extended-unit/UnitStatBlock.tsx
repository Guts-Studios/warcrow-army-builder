
import { ExtendedUnitStats } from "@/types/extended-unit";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface UnitStatBlockProps {
  stats: ExtendedUnitStats;
}

const UnitStatBlock = ({ stats }: UnitStatBlockProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold text-warcrow-gold mb-3">Base Statistics</h3>
      
      <div className="overflow-x-auto -mx-4 px-4">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-warcrow-gold/30">
              <TableHead className="text-warcrow-gold font-medium text-center">MOV</TableHead>
              <TableHead className="text-warcrow-gold font-medium text-center">W</TableHead>
              <TableHead className="text-warcrow-gold font-medium text-center">WP</TableHead>
              <TableHead className="text-warcrow-gold font-medium text-center">MOR</TableHead>
              <TableHead className="text-warcrow-gold font-medium text-center">AVB</TableHead>
              <TableHead className="text-warcrow-gold font-medium text-center">Members</TableHead>
              <TableHead className="text-warcrow-gold font-medium text-center">Conquest</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-b border-warcrow-background/20">
              <TableCell className="text-warcrow-text font-medium text-center">{stats.mov}</TableCell>
              <TableCell className="text-warcrow-text font-medium text-center">{stats.w}</TableCell>
              <TableCell className="text-warcrow-text font-medium text-center">{stats.wp}</TableCell>
              <TableCell className="text-warcrow-text font-medium text-center">{stats.mor}</TableCell>
              <TableCell className="text-warcrow-text font-medium text-center">{stats.avb}</TableCell>
              <TableCell className="text-warcrow-text font-medium text-center">{stats.members}</TableCell>
              <TableCell className="text-warcrow-text font-medium text-center">{stats.conquest}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4">
        <h4 className="font-semibold text-warcrow-gold mb-2">Characteristics</h4>
        <div className="flex flex-wrap gap-2 mt-1">
          {stats.characteristics.map((characteristic, index) => (
            <span key={index} className="px-2 py-1 bg-warcrow-background text-warcrow-text text-sm rounded border border-warcrow-gold/30">
              {characteristic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UnitStatBlock;
