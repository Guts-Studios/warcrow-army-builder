
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from '@/utils/translationUtils';
import { generatePortraitUrl } from '@/utils/imageUtils';
import { useProfileSession } from '@/hooks/useProfileSession';

interface AvatarPortraitProps {
  portraitUrl: string | undefined;
  name: string; // Always the original English name
  fallback?: string; // Fallback text for avatar (can be translated)
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
  
  // Display properly translated name when available for alt text
  const displayName = language === 'en' ? name : translateUnitName(name, language);
  
  console.log(`[AvatarPortrait] Component render:`);
  console.log(`  - English unit name (for portrait): ${name}`);
  console.log(`  - Display name (for alt text): ${displayName}`);
  console.log(`  - Current language: ${language}`);
  console.log(`  - Provided portraitUrl: ${portraitUrl || 'undefined'}`);
  console.log(`  - Current URL state: ${currentUrl}`);
  console.log(`  - Image error state: ${imageError}`);
  
  // Generate and set portrait URL when component mounts or name changes
  useEffect(() => {
    console.log(`[AvatarPortrait] useEffect triggered:`);
    console.log(`  - portraitUrl prop: ${portraitUrl || 'undefined'}`);
    console.log(`  - English name prop: ${name}`);
    console.log(`  - Previous currentUrl: ${currentUrl}`);
    
    setImageError(false);
    // IMPORTANT: Always use the original English name for portrait generation
    // Portraits are the same for all languages and should use English names
    const imageUrl = portraitUrl || generatePortraitUrl(name);
    console.log(`[AvatarPortrait] Setting new URL: ${imageUrl}`);
    console.log(`[AvatarPortrait] Using English name "${name}" for portrait lookup`);
    setCurrentUrl(imageUrl);
  }, [name, portraitUrl]); // Note: language is NOT in dependencies since portraits are language-independent

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`[AvatarPortrait] Portrait image failed to load:`, currentUrl);
    console.log(`[AvatarPortrait] Setting imageError to true for ${name}`);
    setImageError(true);
  };

  console.log(`[AvatarPortrait] Rendering avatar:`);
  console.log(`  - Will show image: ${!imageError && currentUrl ? 'YES' : 'NO'}`);
  console.log(`  - Image URL: ${currentUrl}`);
  console.log(`  - Fallback text: ${fallback || displayName.split(' ').map(word => word[0]).join('')}`);

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
