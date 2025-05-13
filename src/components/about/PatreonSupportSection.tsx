
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getPatreonCampaignInfo, formatPatreonAmount, PatreonTier } from "@/utils/patreonUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Coffee, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function PatreonSupportSection() {
  const [tiers, setTiers] = useState<PatreonTier[]>([]);
  const [campaignUrl, setCampaignUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchPatreonInfo = async () => {
      try {
        setIsLoading(true);
        const campaignInfo = await getPatreonCampaignInfo();
        
        if (campaignInfo) {
          setTiers(campaignInfo.tiers.filter(tier => tier.published));
          setCampaignUrl(campaignInfo.url);
        } else {
          setError("Unable to load support options");
        }
      } catch (err) {
        console.error("Error fetching Patreon data:", err);
        setError("An error occurred while loading support options");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatreonInfo();
  }, []);

  const getTierIcon = (index: number) => {
    switch (index) {
      case 0: return <Coffee className="h-6 w-6 text-amber-500" />;
      case 1: return <Heart className="h-6 w-6 text-rose-500" />;
      case 2: return <Shield className="h-6 w-6 text-blue-500" />;
      default: return <Coffee className="h-6 w-6 text-amber-500" />;
    }
  };

  const handlePatreonRedirect = () => {
    if (campaignUrl) {
      window.open(`https://www.patreon.com/${campaignUrl}`, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-warcrow-gold">
          {language === 'en' ? 'Support Warcrow Army Builder' : 
           language === 'es' ? 'Apoya al Constructor de Ejércitos de Warcrow' : 
           'Soutenez le Constructeur d\'Armée Warcrow'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border border-warcrow-gold/30 bg-black/60">
              <CardHeader>
                <Skeleton className="h-7 w-3/4 bg-gray-700" />
                <Skeleton className="h-5 w-1/2 bg-gray-700" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full bg-gray-700" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full bg-gray-700" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || tiers.length === 0) {
    return (
      <div className="mt-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-warcrow-gold">
          {language === 'en' ? 'Support Warcrow Army Builder' : 
           language === 'es' ? 'Apoya al Constructor de Ejércitos de Warcrow' : 
           'Soutenez le Constructeur d\'Armée Warcrow'}
        </h2>
        <div className="bg-black/60 border border-warcrow-gold/30 rounded-lg p-6 text-center">
          <Coffee className="h-8 w-8 mx-auto mb-4 text-warcrow-gold/80" />
          <p className="mb-4">
            {language === 'en' ? 'You can support the development of this app by buying us a coffee!' : 
             language === 'es' ? '¡Puedes apoyar el desarrollo de esta aplicación invitándonos a un café!' : 
             'Vous pouvez soutenir le développement de cette application en nous offrant un café !'}
          </p>
          <Button 
            variant="outline" 
            className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:text-warcrow-gold"
            onClick={() => window.open('https://www.buymeacoffee.com/warcrowarmy', '_blank')}
          >
            <Coffee className="mr-2 h-4 w-4" />
            {language === 'en' ? 'Buy us a coffee' : 
             language === 'es' ? 'Invítanos a un café' : 
             'Offrez-nous un café'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-warcrow-gold">
        {language === 'en' ? 'Support Warcrow Army Builder' : 
         language === 'es' ? 'Apoya al Constructor de Ejércitos de Warcrow' : 
         'Soutenez le Constructeur d\'Armée Warcrow'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiers.map((tier, index) => (
          <Card key={tier.id} className="border border-warcrow-gold/30 bg-black/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                {getTierIcon(index)}
                <CardTitle className="text-warcrow-gold">{tier.title}</CardTitle>
              </div>
              <CardDescription className="text-warcrow-text/80">
                {formatPatreonAmount(tier.amount_cents)} {language === 'en' ? 'per month' : language === 'es' ? 'al mes' : 'par mois'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-warcrow-text">{tier.description}</p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full border-warcrow-gold text-warcrow-gold hover:bg-black hover:text-warcrow-gold"
                onClick={handlePatreonRedirect}
              >
                {language === 'en' ? 'Become a Patron' : 
                 language === 'es' ? 'Conviértete en Patrón' : 
                 'Devenir un Mécène'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-4">
        <Button 
          variant="outline"
          className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:text-warcrow-gold"
          onClick={handlePatreonRedirect}
        >
          {language === 'en' ? 'View all support options' : 
           language === 'es' ? 'Ver todas las opciones de apoyo' : 
           'Voir toutes les options de soutien'}
        </Button>
      </div>
    </div>
  );
}
