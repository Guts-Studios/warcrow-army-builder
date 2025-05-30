
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from '@/utils/translationUtils';
import { generatePortraitUrl } from '@/utils/imageUtils';
import { useProfileSession } from '@/hooks/useProfileSession';

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
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const { language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  
  // Display properly translated name when available
  const displayName = language === 'en' ? name : translateUnitName(name, language);
  
  // Generate and set portrait URL when component mounts or dependencies change
  useEffect(() => {
    setImageError(false);
    const imageUrl = generatePortraitUrl(name);
    console.log(`[AvatarPortrait] Using portrait URL for ${name}: ${imageUrl}`);
    setCurrentUrl(imageUrl);
  }, [name, portraitUrl, language]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Portrait image failed to load for ${name}:`, currentUrl);
    setImageError(true);
  };

  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      {!imageError && currentUrl && (
        <AvatarImage 
          src={currentUrl} 
          alt={displayName} 
          className="object-cover"
          onError={handleImageError}
          width="64" 
          height="64" 
          loading="lazy" 
        />
      )}
      <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
        {fallback || displayName.split(' ').map(word => word[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarPortrait;
