
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  
  // If no portrait URL is provided, render fallback immediately
  if (!portraitUrl) {
    return (
      <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
        <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
          {fallback || name.split(' ').map(word => word[0]).join('')}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Convert card URL to portrait URL
  let portraitImageUrl = portraitUrl;
  
  if (!imageError) {
    if (portraitUrl.includes('/art/card/')) {
      // Replace the directory path
      portraitImageUrl = portraitUrl.replace('/art/card/', '/art/portrait/');
      
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
    }
    
    console.log('Original card URL:', portraitUrl);
    console.log('Generated portrait URL:', portraitImageUrl);
  }

  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      <AvatarImage 
        src={imageError ? undefined : portraitImageUrl} 
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
