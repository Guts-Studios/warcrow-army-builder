
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a user has wab-admin privileges
 * @param userId The user ID to check
 * @returns Promise<boolean> True if the user is a wab-admin, false otherwise
 */
export const checkWabAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Call the database function directly
    const { data, error } = await supabase.rpc('is_wab_admin', {
      user_id: userId
    });
    
    if (error) {
      console.error('Error checking wab-admin status:', error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error('Unexpected error checking wab-admin status:', err);
    return false;
  }
};

/**
 * Grants wab-admin privileges to a user
 * @param adminUserId The ID of the admin making the change
 * @param targetUserId The ID of the user to grant admin privileges to
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const grantWabAdmin = async (adminUserId: string, targetUserId: string): Promise<boolean> => {
  if (!adminUserId || !targetUserId) return false;
  
  try {
    // First verify the requesting user is an admin
    const isAdmin = await checkWabAdmin(adminUserId);
    if (!isAdmin) {
      console.error('User is not authorized to grant admin privileges');
      return false;
    }
    
    // Update the target user's profile
    const { error } = await supabase
      .from('profiles')
      .update({ wab_admin: true })
      .eq('id', targetUserId);
    
    if (error) {
      console.error('Error granting wab-admin status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error granting wab-admin status:', err);
    return false;
  }
};

/**
 * Revokes wab-admin privileges from a user
 * @param adminUserId The ID of the admin making the change
 * @param targetUserId The ID of the user to revoke admin privileges from
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const revokeWabAdmin = async (adminUserId: string, targetUserId: string): Promise<boolean> => {
  if (!adminUserId || !targetUserId) return false;
  
  try {
    // First verify the requesting user is an admin
    const isAdmin = await checkWabAdmin(adminUserId);
    if (!isAdmin) {
      console.error('User is not authorized to revoke admin privileges');
      return false;
    }
    
    // Update the target user's profile
    const { error } = await supabase
      .from('profiles')
      .update({ wab_admin: false })
      .eq('id', targetUserId);
    
    if (error) {
      console.error('Error revoking wab-admin status:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error revoking wab-admin status:', err);
    return false;
  }
};

/**
 * Hook to check if the current component should render admin-only content
 * @param isWabAdmin Boolean from useAuth() context
 * @param showMessage Whether to show a toast message when access is denied
 * @returns React component for conditional rendering
 */
export const AdminOnly = ({ 
  children, 
  isWabAdmin, 
  fallback = null 
}: { 
  children: React.ReactNode, 
  isWabAdmin: boolean, 
  fallback?: React.ReactNode 
}) => {
  if (!isWabAdmin) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};
