
import toast from "@/components/ui/toast-core";

// Re-export our toast as a callable function with methods
export { toast };

// For backward compatibility
export const useToast = () => ({ toast });
