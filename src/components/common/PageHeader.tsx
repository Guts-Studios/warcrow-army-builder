
import React from 'react';
import { NavDropdown } from "@/components/ui/NavDropdown";

interface PageHeaderProps {
  title: string;
  logoUrl?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ 
  title, 
  logoUrl = "https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z", 
  children 
}: PageHeaderProps) => {
  return (
    <div className="bg-black/50 p-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-4 mx-auto md:mx-0">
            <img 
              src={logoUrl}
              alt="Warcrow Logo" 
              className="h-16"
            />
            <h1 className="text-3xl font-bold text-warcrow-gold text-center md:text-left">{title}</h1>
          </div>
          <div className="flex items-center gap-4">
            {children}
            <NavDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};
