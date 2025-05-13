
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { PatreonPatron, getPatreonPatrons } from '@/utils/patreonUtils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { aboutTranslations } from '@/i18n/about';
import { toast } from '@/components/ui/use-toast';

export default function SupportersList() {
  const [supporters, setSupporters] = useState<PatreonPatron[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching supporters from Patreon API...');
        const patrons = await getPatreonPatrons();
        console.log('Patrons received:', patrons);
        setSupporters(patrons);
        
        if (patrons.length === 0) {
          console.log('No patrons returned from API');
        } else {
          console.log(`${patrons.length} patrons successfully loaded`);
        }
      } catch (err) {
        console.error('Error fetching supporters:', err);
        setError(aboutTranslations.errorLoadingSupporters[language]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupporters();
  }, [language]);

  // Get initials from a name
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Return random color for supporter avatars
  const getAvatarColor = (id: string): string => {
    const colors = [
      'bg-blue-600 text-white',
      'bg-green-600 text-white',
      'bg-purple-600 text-white',
      'bg-amber-600 text-white',
      'bg-warcrow-gold text-black',
      'bg-rose-600 text-white',
    ];
    
    // Simple hash function for consistent colors
    const hash = id.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center text-warcrow-gold mb-6">
          {aboutTranslations.supportersTitle[language]}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-12 w-12 rounded-full bg-warcrow-gold/30" />
              <Skeleton className="h-4 w-24 mt-2 bg-warcrow-gold/30" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || supporters.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center text-warcrow-gold mb-3">
          {aboutTranslations.supportersTitle[language]}
        </h2>
        <p className="text-center text-warcrow-text/80 mb-6">
          {error || aboutTranslations.noSupportersYet[language]}
        </p>
        
        <div className="bg-black/60 border border-warcrow-gold/30 rounded-lg p-6 max-w-2xl mx-auto text-center">
          <p className="text-warcrow-text mb-4">
            {aboutTranslations.beFirstSupporter[language]}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-center text-warcrow-gold mb-6">
        {aboutTranslations.supportersTitle[language]}
      </h2>
      
      <div className="flex flex-wrap justify-center gap-5 max-w-3xl mx-auto">
        {supporters.map((supporter) => (
          <div 
            key={supporter.id} 
            className="flex flex-col items-center w-24"
          >
            <Avatar className={`h-12 w-12 ${getAvatarColor(supporter.id)}`}>
              <AvatarFallback className="text-sm font-semibold">
                {getInitials(supporter.full_name)}
              </AvatarFallback>
            </Avatar>
            <span className="mt-2 text-sm text-center line-clamp-2 text-warcrow-text break-words">
              {supporter.full_name}
            </span>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-6">
        <p className="text-warcrow-text/80 text-sm">
          {aboutTranslations.thankYouSupporters[language]}
        </p>
      </div>
    </div>
  );
}
