import * as React from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextType {
  isAuthenticated: boolean | null;
  isGuest: boolean;
  isPasswordRecovery: boolean;
  isTester: boolean;
  setIsGuest: (value: boolean) => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: null,
  isGuest: false,
  isPasswordRecovery: false,
  isTester: false,
  setIsGuest: () => {},
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isGuest, setIsGuest] = React.useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = React.useState(false);
  const [isTester, setIsTester] = React.useState(false);
  
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');

  React.useEffect(() => {
    const setupAuth = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');
      
      if (type === 'recovery' && accessToken) {
        console.log('Password recovery flow detected');
        setIsPasswordRecovery(true);
        setIsAuthenticated(false);
        if (!window.location.pathname.includes('reset-password')) {
          window.location.href = '/reset-password' + window.location.hash;
        }
        return;
      }

      if (isPreview) {
        console.log('Preview mode detected, setting as authenticated and tester');
        setIsAuthenticated(true);
        setIsTester(true);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session check:', session ? 'Authenticated' : 'Not authenticated');
      setIsAuthenticated(!!session);
      
      if (session) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('tester')
            .eq('id', session.user.id)
            .single();
          
          setIsTester(!!data?.tester);
          console.log('Tester role check:', data?.tester ? 'Tester' : 'Not tester');
        } catch (error) {
          console.error('Error checking tester status:', error);
        }
      }
      
      if (!session && !isPreview) {
        toast({
          title: "Offline Mode",
          description: "You are in offline mode. Cloud features like saving lists will not be available.",
          duration: 5000,
        });
      }
    };

    setupAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event triggered:', {
        event,
        sessionExists: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });

      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery event detected');
        setIsPasswordRecovery(true);
        setIsAuthenticated(false);
        return;
      }

      if (!isPasswordRecovery) {
        setIsAuthenticated(!!session);
        
        if (session) {
          const checkTesterStatus = async () => {
            try {
              const { data } = await supabase
                .from('profiles')
                .select('tester')
                .eq('id', session.user.id)
                .single();
              
              setIsTester(!!data?.tester);
            } catch (error) {
              console.error('Error checking tester status:', error);
              setIsTester(false);
            }
          };
          
          checkTesterStatus();
        } else {
          setIsTester(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [isPreview, isPasswordRecovery]);

  const value = {
    isAuthenticated,
    isGuest,
    isPasswordRecovery,
    isTester,
    setIsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
