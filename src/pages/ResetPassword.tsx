import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must not exceed 72 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const validateAccess = async () => {
      try {
        // Log the full URL and hash for debugging
        console.log('Full URL:', window.location.href);
        console.log('URL Hash:', window.location.hash);

        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const type = hashParams.get('type');
        const refreshToken = hashParams.get('refresh_token');
        
        // Log all URL parameters
        console.log('Reset password parameters:', {
          accessToken: accessToken ? 'Present' : 'Not present',
          accessTokenLength: accessToken?.length,
          type,
          hasRefreshToken: !!refreshToken,
          refreshTokenLength: refreshToken?.length
        });

        if (!accessToken || type !== 'recovery') {
          console.error('Invalid reset flow:', { 
            hasAccessToken: !!accessToken, 
            type,
            currentPath: window.location.pathname
          });
          toast.error("Invalid reset link. Please request a new one.");
          navigate('/login');
          return;
        }

        // Log before setting session
        console.log('Attempting to set session with tokens');
        
        // Set the session with both tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          console.error('Session error details:', {
            error: sessionError,
            message: sessionError.message,
            status: sessionError.status
          });
          toast.error("Invalid or expired reset link. Please request a new one.");
          navigate('/login');
          return;
        }

        console.log('Session set successfully, fetching user details');

        // Get user details after setting the session
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        console.log('User details response:', {
          hasUser: !!user,
          userEmail: user?.email,
          error: userError
        });
        
        if (user?.email) {
          console.log('Setting email in form:', user.email);
          form.setValue('email', user.email);
          
          // Verify the form value was set
          const formValues = form.getValues();
          console.log('Form values after setting email:', formValues);
        } else {
          console.error('No user email found:', {
            error: userError,
            user
          });
          toast.error("Could not retrieve your email. Please try again.");
          navigate('/login');
          return;
        }
        
        setIsValidating(false);
      } catch (error) {
        console.error('Access validation error:', error);
        toast.error("An error occurred. Please try again.");
        navigate('/login');
      }
    };

    validateAccess();
  }, [navigate, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      console.log('Attempting to update password');
      
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) {
        console.error('Password update error:', error);
        toast.error(error.message);
        return;
      }

      console.log('Password updated successfully');
      toast.success("Password updated successfully!");
      navigate('/builder');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <div className="text-center">
          <p>Validating reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 bg-warcrow-accent rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Your email address"
                      {...field}
                      disabled={true}
                      className="bg-gray-100"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;