
import { useProfileContext } from "./ProfileData";
import { NotificationsMenu } from "./NotificationsMenu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { NavDropdown } from "@/components/ui/NavDropdown";

export const ProfileHeader = () => {
  const { profile } = useProfileContext();
  const navigate = useNavigate();
  
  return (
    <div className="bg-black/50 py-4 border-b border-warcrow-gold/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4 mx-auto md:mx-0">
            <img 
              src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
              alt="Warcrow Logo" 
              className="h-16"
            />
            <h1 className="text-2xl font-semibold text-warcrow-gold">My Profile</h1>
          </div>
          <div className="flex items-center gap-4">
            <NavDropdown />
            {profile && profile.id && (
              <NotificationsMenu userId={profile.id} />
            )}
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black md:w-auto"
              onClick={() => navigate('/landing')}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
