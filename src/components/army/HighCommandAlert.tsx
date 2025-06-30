
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface HighCommandAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HighCommandAlert = ({ open, onOpenChange }: HighCommandAlertProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[90vh] min-h-[400px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Multiple High Command Units</AlertDialogTitle>
          <AlertDialogDescription>
            You can only have 1 High Command unit in a tournament legal list. You currently have multiple High Command units selected.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default HighCommandAlert;
