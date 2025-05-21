
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Play, User, Shield, Bug } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEnvironment } from "@/hooks/useEnvironment";

export const MainActions = () => {
  const navigate = useNavigate();
  const [isTester, setIsTester] = useState(false);
  const { isWabAdmin } = useAuth();
  const { t } = useLanguage();
  const { isPreview, isProduction, hostname } = useEnvironment();
  
  useEffect(() => {
    // Debug logging
    console.log('MainActions: isWabAdmin =', isWabAdmin);
    console.log('MainActions: Current hostname =', hostname);
    console.log('MainActions: isPreview =', isPreview);
    console.log('MainActions: isProduction =', isProduction);
    
    const checkUserRole = async () => {
      // If in preview mode, set as tester
      if (isPreview) {
        console.log('Setting tester mode due to preview environment');
        setIsTester(true);
        return;
      }

      // Otherwise check if user has tester role
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('MainActions: Active session found, user ID =', session.user.id);
        
        // Fetch user's roles from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data && data.tester) {
          console.log('User has tester role in database');
          setIsTester(true);
        } else {
          console.log('User does not have tester role:', error || 'No data or tester role');
          console.log('Profile data:', data);
        }
      } else {
        console.log('No session found for role check');
      }
    };

    checkUserRole();
  }, [isWabAdmin, isPreview, isProduction, hostname]);

  return (
    <>
      <div className="flex justify-center">
        <Button
          onClick={() => navigate('/builder')}
          className="w-full md:w-auto bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors px-8 py-2 text-lg"
        >
          {t('startBuilding')}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center">
        <Button
          onClick={() => navigate('/rules')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          {t('rulesReference')}
        </Button>
        <Button
          onClick={() => navigate('/missions')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          {t('missions')}
        </Button>
        <Button
          onClick={() => navigate('/profile')}
          variant="outline"
          className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          <User className="mr-2 h-4 w-4" />
          {t('profile')}
        </Button>
        
        {/* Show these features in preview mode or for testers/admins */}
        {(!!isTester || !!isWabAdmin || isPreview) && (
          <>
            <Button
              onClick={() => navigate('/unit-stats')}
              variant="outline"
              className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
            >
              {t('unitStats')}
            </Button>
            <Button
              onClick={() => navigate('/play')}
              variant="outline"
              className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
            >
              <Play className="mr-2 h-4 w-4" />
              {t('playMode')}
            </Button>
          </>
        )}
        
        {/* Show admin button in preview environment or for actual admin users */}
        {(isPreview || (typeof isWabAdmin === 'boolean' && isWabAdmin === true)) && (
          <>
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
            >
              <Shield className="mr-2 h-4 w-4" />
              {t('admin')}
            </Button>
            {/* Debug button to show environment info - only visible for admins */}
            <Button
              onClick={() => {
                alert(`Environment Info:
                  Hostname: ${hostname}
                  isPreview: ${isPreview}
                  isProduction: ${isProduction}
                  isWabAdmin: ${isWabAdmin}
                  isTester: ${isTester}
                `);
                
                // Check current session
                supabase.auth.getSession().then(({ data }) => {
                  console.log('Current session:', data.session);
                  if (data.session) {
                    alert(`User ID: ${data.session.user.id?.slice(0,8)}...
                    Email: ${data.session.user.email}
                    `);
                  } else {
                    alert('No active session found');
                  }
                });
              }}
              variant="outline"
              className="w-full md:w-auto border-red-500 text-red-500 hover:bg-black hover:border-black hover:text-red-500 transition-colors bg-black"
            >
              <Bug className="mr-2 h-4 w-4" />
              Debug
            </Button>
          </>
        )}
      </div>
    </>
  );
};
