
import { toast as sonnerToast } from "sonner";

// Create a wrapper for the toast so we can add success and error methods
export const toast = {
  ...sonnerToast,
  success: (message: string) => sonnerToast({ title: "Success", description: message }),
  error: (message: string) => sonnerToast({ 
    title: "Error", 
    description: message,
    variant: "destructive" 
  }),
  warning: (message: string) => sonnerToast({ 
    title: "Warning", 
    description: message,
    variant: "warning" 
  }),
  info: (message: string) => sonnerToast({ title: "Info", description: message })
};
