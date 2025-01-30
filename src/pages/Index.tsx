import * as React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      {/* Navigation Header */}
      <div className="bg-black/50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <img 
              src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
              alt="Warcrow Logo" 
              className="h-16"
            />
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
                onClick={() => navigate('/builder')}
              >
                Army Builder
              </Button>
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
                onClick={() => navigate('/rules')}
              >
                Rules
              </Button>
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
                onClick={() => navigate('/missions')}
              >
                Missions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto py-16 px-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-warcrow-gold">
            Welcome to Warcrow
          </h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Build your army, master the rules, and conquer the battlefield
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 pt-8">
            <Button
              size="lg"
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
              onClick={() => navigate('/builder')}
            >
              Start Building Your Army
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
              onClick={() => navigate('/rules')}
            >
              Learn the Rules
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;