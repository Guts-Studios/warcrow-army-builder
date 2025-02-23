
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const MainActions = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center">
        <Button
          onClick={() => navigate('/builder')}
          className="w-full md:w-auto bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors px-8 py-2 text-lg"
        >
          Start Building
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center">
        <Button
          onClick={() => navigate('/rules')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          Rules Reference
        </Button>
        <Button
          onClick={() => navigate('/missions')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          Missions
        </Button>
        <Button
          onClick={() => navigate('/profile')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          Profile
        </Button>
      </div>
    </>
  );
};
