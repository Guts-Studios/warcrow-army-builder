import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  profile?: Profile | null;
  isGuest: boolean;
  isAdmin: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Profile) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  isGuest: false,
  isAdmin: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  updateProfile: async () => ({ success: false }),
  sendPasswordReset: async () => ({ success: false }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = password
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });

      if (error) {
        console.error("Login error:", error);
        toast.error(`Login failed: ${error.message}`);
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        
        // Fetch user profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
          setIsAdmin(!!profileData.wab_admin);
          console.log(`User ${profileData.username || data.user.email} admin status:`, profileData.wab_admin);
        }
        
        toast.success(`Logged in as ${email}`);
        return { success: true };
      } else {
        toast.info(`Check your email (${email}) for the login link.`);
        return { success: true }; // Consider this a "success" as the email was sent
      }
    } catch (err: any) {
      console.error("Unexpected login error:", err);
      toast.error(`Login failed: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast.error(`Logout failed: ${error.message}`);
      } else {
        setUser(null);
        setProfile(null);
        setIsGuest(false);
        setIsAdmin(false);
        navigate('/login');
        toast.success("Logged out successfully");
      }
    } catch (err: any) {
      console.error("Unexpected logout error:", err);
      toast.error(`Logout failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Profile) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error("No user logged in");

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        console.error("Profile update error:", error);
        toast.error(`Profile update failed: ${error.message}`);
        return { success: false, error: error.message };
      }

      // Optimistically update the local state
      setProfile(prev => ({ ...prev, ...updates }));
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (err: any) {
      console.error("Unexpected profile update error:", err);
      toast.error(`Profile update failed: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        console.error("Password reset error:", error);
        toast.error(`Password reset failed: ${error.message}`);
        return { success: false, error: error.message };
      }

      toast.info(`Password reset email sent to ${email}`);
      return { success: true };
    } catch (err: any) {
      console.error("Unexpected password reset error:", err);
      toast.error(`Password reset failed: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching auth user:", error);
          setIsLoading(false);
          return;
        }

        if (user) {
          setUser(user);
          
          // Fetch user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileData) {
            setProfile(profileData);
            // Check if user is admin
            setIsAdmin(!!profileData.wab_admin);
            console.log(`User ${profileData.username || user.email} admin status:`, profileData.wab_admin);
          }
        }
      } catch (error) {
        console.error("Unexpected error in auth fetch:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      if (event === 'INITIAL_SESSION') {
        await fetchUser();
      } else if (event === 'SIGNED_IN') {
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData) {
            setProfile(profileData);
            setIsAdmin(!!profileData.wab_admin);
            console.log(`User ${profileData.username || session.user.email} admin status:`, profileData.wab_admin);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        setIsGuest(false);
        setIsAdmin(false);
      }
    });

  }, []);

  const value = {
    isAuthenticated: !!user,
    isLoading,
    user,
    profile,
    isGuest,
    isAdmin,
    login,
    logout,
    updateProfile,
    sendPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
