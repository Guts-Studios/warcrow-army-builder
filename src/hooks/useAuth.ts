
// Import the useAuth hook from AuthProvider instead of from itself
import { useAuth } from "@/components/auth/AuthProvider";

// Re-export the hook
export { useAuth };

// Default export
export default useAuth;
