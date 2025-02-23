
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SecondaryActionsProps {
  isGuest: boolean;
  onSignOut: () => void;
}

export const SecondaryActions = ({ isGuest, onSignOut }: SecondaryActionsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center md:mt-2">
      <Button
        onClick={onSignOut}
        variant="outline"
        className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
      >
        {isGuest ? "Signed in as Guest" : "Sign Out"}
      </Button>
      <Button
        onClick={() => navigate('/about')}
        variant="outline"
        className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
      >
        Buy us Coffee!
      </Button>
    </div>
  );
};
