
import { toast as sonnerToast, ToastT, ToastToDismiss } from "sonner";
import type { ReactNode } from "react";

// Define toast options type
export type ToastOptions = {
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  [key: string]: any;
};

// Create a callable toast function that accepts options object
const createToast = (options: ToastOptions | string) => {
  // Handle string case
  if (typeof options === 'string') {
    return sonnerToast(options);
  }
  
  // Handle object case
  const { title, description, variant, ...rest } = options;
  return sonnerToast(title as string, {
    description,
    ...rest
  });
};

// Define toast object with methods
export const toast = Object.assign(
  // Make base function callable
  createToast,
  {
    // Add custom success method
    success: (message: string) => sonnerToast({
      title: "Success",
      description: message,
      variant: "success"
    }),
    // Add custom error method
    error: (message: string) => sonnerToast({
      title: "Error",
      description: message,
      variant: "destructive"
    }),
    // Warning method
    warning: (message: string) => sonnerToast({
      title: "Warning",
      description: message,
      variant: "warning"
    }),
    // Info method
    info: (message: string) => sonnerToast({
      title: "Info",
      description: message,
    }),
    // Pass through other methods from sonner
    dismiss: sonnerToast.dismiss,
    error: sonnerToast.error,
    info: sonnerToast.info,
    promise: sonnerToast.promise,
    success: sonnerToast.success,
    warning: sonnerToast.warning,
    custom: sonnerToast.custom,
    message: sonnerToast.message,
    loading: sonnerToast.loading,
    getToasts: sonnerToast.getToasts,
  }
);

// Default export as the callable toast function with methods
export default toast;
