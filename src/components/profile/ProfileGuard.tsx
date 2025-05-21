
import { Navigate } from "react-router-dom";
import { useProfileSession } from "@/hooks/useProfileSession";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProfileGuardProps {
  children: React.ReactNode;
}

export const ProfileGuard = ({ children }: ProfileGuardProps) => {
  const { isAuthenticated, isGuest, sessionChecked } = useProfileSession();
  
  useEffect(() => {
    if (sessionChecked && isGuest) {
      toast.error("You must login with an account to access your profile", {
        description: "Guest users cannot access profiles",
        duration: 5000
      });
    }
  }, [sessionChecked, isGuest]);
  
  // Still loading auth state
  if (!sessionChecked) {
    return <div className="min-h-screen flex items-center justify-center bg-warcrow-background text-warcrow-gold">
      Loading authentication...
    </div>;
  }
  
  // If user is a guest or not authenticated, redirect to home
  if (isGuest || !isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and not a guest, render children
  return <>{children}</>;
};
