
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';

interface AvatarPortraitProps {
  portraitUrl: string | undefined;
  name: string;
  fallback?: string;
}

const AvatarPortrait: React.FC<AvatarPortraitProps> = ({
  portraitUrl,
  name,
  fallback
}) => {
  const [imageError, setImageError] = useState(false);
  const { language } = useLanguage();
  
  // Generate portrait URL based on unit name
  const generatePortraitUrl = () => {
    if (!portraitUrl) {
      // Generate from name if no URL provided
      const nameForUrl = name.toLowerCase().replace(/\s+/g, '_');
      return `/art/portrait/${nameForUrl}_portrait.jpg`;
    }
    
    // If URL provided but not in portrait format, convert card URL to portrait URL
    if (portraitUrl.includes('/art/card/')) {
      // Replace the directory path
      let portraitImageUrl = portraitUrl.replace('/art/card/', '/art/portrait/');
      
      // Handle different filename extensions and patterns
      if (portraitUrl.endsWith('_card.jpg')) {
        portraitImageUrl = portraitImageUrl.replace('_card.jpg', '_portrait.jpg');
      } else if (portraitUrl.endsWith('_card.png')) {
        portraitImageUrl = portraitImageUrl.replace('_card.png', '_portrait.jpg'); 
      } else if (portraitUrl.endsWith('_card_sp.jpg') || portraitUrl.endsWith('_card_fr.jpg')) {
        portraitImageUrl = portraitImageUrl
          .replace('_card_sp.jpg', '_portrait.jpg')
          .replace('_card_fr.jpg', '_portrait.jpg');
      }
      
      return portraitImageUrl;
    }
    
    // If it's already a portrait URL or doesn't match our patterns, return as is
    return portraitUrl;
  };

  // Get the appropriate URL
  const portraitImageUrl = !imageError ? generatePortraitUrl() : undefined;

  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      <AvatarImage 
        src={portraitImageUrl} 
        alt={name} 
        className="object-cover"
        onError={() => {
          console.error('Portrait image failed to load:', portraitImageUrl);
          setImageError(true);
        }}
      />
      <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
        {fallback || name.split(' ').map(word => word[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarPortrait;
