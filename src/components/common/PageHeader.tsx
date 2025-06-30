
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
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex items-center gap-8 md:gap-12">
              <SupportButton className="md:static absolute top-2 left-2 z-10" />
              <div className="flex-shrink-0">
                <img 
                  src={logoUrl}
                  alt="Warcrow Logo" 
                  className="h-16 md:h-20 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-warcrow-gold text-center md:text-left">{title}</h1>
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
