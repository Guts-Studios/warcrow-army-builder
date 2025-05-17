
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserPlus, UserCog } from 'lucide-react';

interface MainActionsProps {
  onContinueAsGuest: () => void;
}

export const MainActions = ({ onContinueAsGuest }: MainActionsProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="default"
          className="h-14 bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
          onClick={() => navigate('/login')}
        >
          <UserPlus className="h-5 w-5 mr-3" />
          {t('signUp')}
        </Button>
        
        <Button
          variant="outline"
          className="h-14 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/10"
          onClick={() => navigate('/login?mode=sign-in')}
        >
          <UserCog className="h-5 w-5 mr-3" />
          {t('signIn')}
        </Button>
      </div>
      
      <div className="pt-2">
        <Button
          variant="ghost"
          className="text-warcrow-gold hover:bg-warcrow-gold/10"
          onClick={onContinueAsGuest}
        >
          {t('continueAsGuest')}
        </Button>
      </div>
    </div>
  );
};

export default MainActions;
