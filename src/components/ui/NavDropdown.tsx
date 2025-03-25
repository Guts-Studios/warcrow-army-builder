
import React, { useState, useEffect } from 'react';
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const NavDropdown = () => {
  const navigate = useNavigate();
  const [isTester, setIsTester] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  
  useEffect(() => {
    const checkUserRole = async () => {
      // Check for preview mode
      const isPreviewMode = window.location.hostname === 'lovableproject.com' || 
                      window.location.hostname.endsWith('.lovableproject.com');
      
      setIsPreview(isPreviewMode);
      
      if (isPreviewMode) {
        setIsTester(true);
        setIsAuthenticated(true);
        return;
      }
      
      // Check auth status and tester role
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('tester')
            .eq('id', session.user.id)
            .single();
          
          setIsTester(!!data?.tester);
        } catch (error) {
          console.error('Error checking tester status:', error);
          setIsTester(false);
        }
      }
    };
    
    checkUserRole();
  }, []);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
        >
          <Menu className="h-5 w-5" />
          <span className="ml-2">Navigation</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 bg-black border border-warcrow-gold/20 text-warcrow-gold"
      >
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-warcrow-gold/10"
          onClick={() => navigate('/builder')}
        >
          Army Builder
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-warcrow-gold/10"
          onClick={() => navigate('/missions')}
        >
          Missions
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-warcrow-gold/10"
          onClick={() => navigate('/rules')}
        >
          Rules
        </DropdownMenuItem>
        {(isTester || isPreview) && (
          <DropdownMenuItem 
            className="cursor-pointer hover:bg-warcrow-gold/10"
            onClick={() => navigate('/profile')}
          >
            Profile
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          className="cursor-pointer hover:bg-warcrow-gold/10"
          onClick={() => navigate('/landing')}
        >
          Home
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
