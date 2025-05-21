
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useProfileSession } from "@/hooks/useProfileSession";

/**
 * Hook to handle profile access based on authentication status
 * Returns a function that will either navigate to profile or show an error toast
 */
export const useProfileAccess = () => {
  const { isAuthenticated, isGuest } = useProfileSession();
  const navigate = useNavigate();
  
  const handleProfileAccess = () => {
    if (isAuthenticated && !isGuest) {
      // User is authenticated and not a guest, navigate to profile
      navigate('/profile');
    } else {
      // User is either not authenticated or a guest
      toast.error("You must login with an account to access your profile", {
        description: "Guest users cannot access profiles",
        duration: 5000
      });
    }
  };
  
  return handleProfileAccess;
};
