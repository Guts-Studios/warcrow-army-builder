
import React from 'react';
import { Menu, Bell, ActivityIcon, ShieldAlert, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NotificationsMenu } from "@/components/profile/NotificationsMenu";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEnvironment } from "@/hooks/useEnvironment";

interface NavDropdownProps {
  iconOnly?: boolean;
}

export const NavDropdown = ({ iconOnly = false }: NavDropdownProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, isWabAdmin, userId, isLoading, isGuest } = useAuth();
  const { isPreview } = useEnvironment();
  const { t } = useLanguage();
  
  // Calculate if the user should see admin content
  const showAdminContent = (isWabAdmin || isPreview) && !isGuest;
  
  return (
    <div className="flex items-center gap-2">
      {(isAuthenticated || isPreview) && (
        <NotificationsMenu userId={userId || "preview-user-id"} />
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="bg-black/90 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/10 hover:text-warcrow-gold transition-colors"
          >
            <Menu className="h-5 w-5" />
            {!iconOnly && <span className="ml-2">Navigation</span>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-56 bg-black/90 border border-warcrow-gold/30 text-warcrow-text"
        >
          {(isAuthenticated || isPreview) && (
            <>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
                onClick={() => navigate('/activity')}
              >
                <ActivityIcon className="h-4 w-4 mr-2" />
                Activity Feed
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-warcrow-gold/20" />
            </>
          )}
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/builder')}
          >
            Army Builder
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/missions')}
          >
            Missions
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/rules')}
          >
            Rules
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/faq')}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </DropdownMenuItem>

          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/profile')}
          >
            Profile
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/about')}
          >
            {t('supportUs')}
          </DropdownMenuItem>
          
          {showAdminContent && (
            <>
              <DropdownMenuSeparator className="bg-warcrow-gold/20" />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-warcrow-gold font-medium">
                  <ShieldAlert className="h-4 w-4 inline-block mr-2" />
                  Admin Functions
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
                  onClick={() => navigate('/mail')}
                >
                  Email Management
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
                  onClick={() => navigate('/admin')}
                >
                  Admin Dashboard
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
          
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10 text-warcrow-text"
            onClick={() => navigate('/landing')}
          >
            Home
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
