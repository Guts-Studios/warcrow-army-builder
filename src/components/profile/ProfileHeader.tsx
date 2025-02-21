
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProfileHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-black/50 p-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img 
              src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
              alt="Warcrow Logo" 
              className="h-16"
            />
            <h1 className="text-3xl font-bold text-warcrow-gold text-center md:text-left">Profile</h1>
          </div>
          <Button
            variant="outline"
            className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
            onClick={() => navigate('/landing')}
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};
