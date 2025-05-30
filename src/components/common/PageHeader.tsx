
import React from 'react';
import { SupportButton } from "@/components/landing/SupportButton";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { useAuth } from "@/hooks/useAuth";
import { useEnvironment } from "@/hooks/useEnvironment";

interface PageHeaderProps {
  title: string;
  logoUrl?: string;
  children?: React.ReactNode;
  showNavigation?: boolean;
}

export const PageHeader = ({ 
  title, 
  logoUrl = "https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z", 
  children,
  showNavigation = false
}: PageHeaderProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { isPreview } = useEnvironment();
  
  // Always show navigation in preview mode or if authenticated
  const shouldShowNavigation = showNavigation && (isAuthenticated || isPreview);

  return (
    <div className="bg-black/95 border-b border-warcrow-gold/50 shadow-md p-2 md:p-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 md:gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mx-auto md:mx-0">
            <div className="flex items-center gap-2 md:gap-4">
              <SupportButton className="md:static absolute top-2 left-2 z-10" />
              <img 
                src={logoUrl}
                alt="Warcrow Logo" 
                className="h-12 md:h-16"
                width="120"
                height="64"
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-warcrow-gold text-center md:text-left">{title}</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4 mt-2 md:mt-0">
            {shouldShowNavigation && <NavDropdown />}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
