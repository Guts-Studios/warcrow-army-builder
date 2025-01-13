import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Schema for password reset request (email only)
const requestResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// Schema for setting new password
const updatePasswordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must not exceed 72 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RequestResetFormData = z.infer<typeof requestResetSchema>;
type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Check if we have a reset token in the URL
  const hasResetToken = location.hash.includes('type=recovery');

  const requestResetForm = useForm<RequestResetFormData>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const updatePasswordForm = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onRequestReset = async (data: RequestResetFormData) => {
    try {
      setLoading(true);
      setError(null);

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) throw resetError;

      toast.success(
        "Password reset instructions have been sent to your email address",
        { duration: 5000 }
      );
      
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "An error occurred while resetting your password");
    } finally {
      setLoading(false);
    }
  };

  const onUpdatePassword = async (data: UpdatePasswordFormData) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password
      });

      if (updateError) throw updateError;

      toast.success("Password has been successfully updated", {
        duration: 5000,
      });

      // Redirect to login after successful password update
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: any) {
      console.error("Password update error:", err);
      setError(err.message || "An error occurred while updating your password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 bg-warcrow-accent rounded-lg shadow-lg">
        <img 
          src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
          alt="Warcrow Logo" 
          className="h-24 mx-auto mb-8"
        />
        <h2 className="text-2xl font-bold text-center mb-6 text-warcrow-gold">
          {hasResetToken ? "Set New Password" : "Reset Password"}
        </h2>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!hasResetToken ? (
          <Form {...requestResetForm}>
            <form onSubmit={requestResetForm.handleSubmit(onRequestReset)} className="space-y-6">
              <FormField
                control={requestResetForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-warcrow-gold">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        className="bg-warcrow-background border-warcrow-gold text-warcrow-text placeholder:text-warcrow-muted"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
                  disabled={loading}
                >
                  {loading ? "Sending Reset Instructions..." : "Send Reset Instructions"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...updatePasswordForm}>
            <form onSubmit={updatePasswordForm.handleSubmit(onUpdatePassword)} className="space-y-6">
              <FormField
                control={updatePasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-warcrow-gold">New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        className="bg-warcrow-background border-warcrow-gold text-warcrow-text placeholder:text-warcrow-muted"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={updatePasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-warcrow-gold">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        className="bg-warcrow-background border-warcrow-gold text-warcrow-text placeholder:text-warcrow-muted"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
                  disabled={loading}
                >
                  {loading ? "Updating Password..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Form>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full mt-4 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
          onClick={() => navigate('/login')}
        >
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default ResetPassword;