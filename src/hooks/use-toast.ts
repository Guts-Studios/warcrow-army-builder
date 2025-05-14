
import { useToast as useToastCore, toast } from "@/components/ui/toast-core";

// Re-export our toast hook from the toast-core implementation
export const useToast = useToastCore;
export { toast };
