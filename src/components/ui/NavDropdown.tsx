
import React from 'react';
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const NavDropdown = () => {
  const navigate = useNavigate();
  
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
