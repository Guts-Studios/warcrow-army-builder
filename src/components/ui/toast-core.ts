
import { toast as sonnerToast, ToastT, ToastToDismiss } from "sonner";
import type { ReactNode } from "react";

// Create a wrapper for the toast so we can add success and error methods
const toastWithExtras = (props: {
  title?: ReactNode;
  description?: ReactNode;
  variant?: "default" | "destructive" | "success" | "warning" | "info";
  [key: string]: any;
}) => sonnerToast(props);

export const toast = {
  ...sonnerToast,
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
  // Add custom warning method
  warning: (message: string) => sonnerToast({
    title: "Warning",
    description: message,
    variant: "warning"
  }),
  // Add custom info method
  info: (message: string) => sonnerToast({
    title: "Info",
    description: message
  }),
  // Default toast method (callable directly)
  __call: toastWithExtras
};

// Make the toast object callable
export default new Proxy(toast, {
  apply(target, _, args) {
    return target.__call(...args);
  }
});

