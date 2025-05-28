
import { Navigate } from "react-router-dom";
import { useProfileSession } from "@/hooks/useProfileSession";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProfileGuardProps {
  children: React.ReactNode;
}

export const ProfileGuard = ({ children }: ProfileGuardProps) => {
  const { isAuthenticated, isGuest, sessionChecked, usePreviewData } = useProfileSession();
  
  useEffect(() => {
    if (sessionChecked && !isAuthenticated && !usePreviewData) {
      toast.error("Please log in to access your profile", {
        description: "You need to be authenticated to view your profile",
        duration: 5000
      });
    }
  }, [sessionChecked, isAuthenticated, usePreviewData]);
  
  // Still loading auth state
  if (!sessionChecked) {
    return <div className="min-h-screen flex items-center justify-center bg-warcrow-background text-warcrow-gold">
      Loading authentication...
    </div>;
  }
  
  // If user is not authenticated and not in preview mode, redirect to login
  if (!isAuthenticated && !usePreviewData) {
    return <Navigate to="/login" replace />;
  }
  
  // User is authenticated or in preview mode, render children
  return <>{children}</>;
};
