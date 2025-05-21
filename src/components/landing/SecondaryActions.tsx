
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { HelpCircle, Coffee, User } from "lucide-react";
import { useProfileSession } from "@/hooks/useProfileSession";
import { toast } from "sonner";
import { useProfileAccess } from "@/utils/profileAccess";

interface SecondaryActionsProps {
  isGuest: boolean;
}

export const SecondaryActions = ({ isGuest }: SecondaryActionsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signOut } = useProfileSession();
  const handleProfileAccess = useProfileAccess();
  
  const handleSignOut = async () => {
    try {
      toast.loading("Signing out...");
      await signOut();
      // The redirect is handled inside the signOut function
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out. Please try again.");
    }
  };
  
  const handleBuyCoffeeClick = () => {
    navigate('/about');
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center md:mt-2">
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
      >
        {isGuest ? t('signedAsGuest') : t('signOut')}
      </Button>
      <Button
        onClick={handleProfileAccess}
        variant="outline"
        className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        {t('profile')}
      </Button>
      <Button
        onClick={handleBuyCoffeeClick}
        variant="outline"
        className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black flex items-center gap-2"
      >
        <Coffee className="h-4 w-4" />
        {t('buyCoffee')}
      </Button>
      <Button
        onClick={() => navigate('/faq')}
        variant="outline"
        className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black flex items-center gap-2"
      >
        <HelpCircle className="h-4 w-4" />
        {t('faqTitle')}
      </Button>
    </div>
  );
};
