
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from '@/utils/translationUtils';
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
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const { language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  const { isPreview } = useProfileSession();
  
  // Display properly translated name when available
  const displayName = language === 'en' ? name : translateUnitName(name, language);
  
  // Special handling for Lady Télia
  if (name.includes("Lady Télia") || name.includes("Lady Telia")) {
    return (
      <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
        <AvatarImage 
          src="/art/portrait/lady_telia_portrait.jpg" 
          alt={displayName} 
          className="object-cover"
          onError={(e) => {
            console.error('Portrait image failed to load for Lady Télia');
            setImageError(true);
          }}
        />
        <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
          LT
        </AvatarFallback>
      </Avatar>
    );
  }
  
  // Generate portrait URL based on unit name - always using English names for consistency
  const generatePortraitUrl = () => {
    if (!portraitUrl) {
      // Clean up the name for URL generation - handle special characters and accents
      const cleanName = name
        .toLowerCase()
        .replace(/\s+/g, '_')         // Replace spaces with underscores
        .replace(/[^\w-]/g, '')       // Remove special characters (except underscores and hyphens)
        .replace(/ć/g, 'c')           // Replace ć with c
        .replace(/í/g, 'i')           // Replace í with i
        .replace(/á/g, 'a')           // Replace á with a
        .replace(/é/g, 'e');          // Replace é with e
      
      return `/art/portrait/${cleanName}_portrait.jpg`;
    }
    
    // Special case for Lady Télia
    if (portraitUrl.includes('lady_telia')) {
      return '/art/portrait/lady_telia_portrait.jpg';
    }
    
    // Check if URL is a UUID-based URL
    if (portraitUrl && (portraitUrl.length > 60 || portraitUrl.includes('uuid'))) {
      // Try to use the name instead
      const cleanName = name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]/g, '')
        .replace(/é|è|ê|ë/g, 'e')
        .replace(/á|à|â|ä/g, 'a')
        .replace(/í|ì|î|ï/g, 'i')
        .replace(/ó|ò|ô|ö/g, 'o')
        .replace(/ú|ù|û|ü/g, 'u');
      
      return `/art/portrait/${cleanName}_portrait.jpg`;
    }
    
    // If URL provided but not in portrait format, convert card URL to portrait URL
    if (portraitUrl.includes('/art/card/')) {
      // Replace the directory path
      let portraitImageUrl = portraitUrl.replace('/art/card/', '/art/portrait/');
      
      // Handle different filename extensions and patterns
      // Always use the English base name (without language suffix)
      if (portraitUrl.endsWith('_card.jpg') || portraitUrl.endsWith('_card_en.jpg')) {
        portraitImageUrl = portraitImageUrl.replace('_card.jpg', '_portrait.jpg').replace('_card_en.jpg', '_portrait.jpg');
      } else if (portraitUrl.endsWith('_card.png')) {
        portraitImageUrl = portraitImageUrl.replace('_card.png', '_portrait.jpg'); 
      } else if (portraitUrl.endsWith('_card_sp.jpg') || portraitUrl.endsWith('_card_fr.jpg')) {
        // Remove language suffixes for portrait URLs to always use English version
        portraitImageUrl = portraitImageUrl
          .replace('_card_sp.jpg', '_portrait.jpg')
          .replace('_card_fr.jpg', '_portrait.jpg');
      } else if (portraitUrl.endsWith('.jpg')) {
        // For files without _card suffix, just replace with _portrait
        portraitImageUrl = portraitImageUrl.replace('.jpg', '_portrait.jpg');
      }
      
      return portraitImageUrl;
    }
    
    // If it's already a portrait URL or doesn't match our patterns, return as is
    return portraitUrl;
  };

  // For debugging
  const portraitImageUrl = !imageError ? generatePortraitUrl() : undefined;
  
  console.log(`Generating portrait for "${name}": ${portraitImageUrl} (isPreview: ${isPreview})`);

  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      <AvatarImage 
        src={portraitImageUrl} 
        alt={displayName} 
        className="object-cover"
        onError={(e) => {
          console.error(`Portrait image failed to load for ${name}:`, portraitImageUrl);
          
          // If first attempt failed but we haven't tried a fallback yet, try a different naming pattern
          if (!fallbackAttempted && portraitImageUrl) {
            setFallbackAttempted(true);
            
            // Try a simpler filename structure
            const simpleNameId = name.split(' ')[0].toLowerCase();
            const fallbackUrl = `/art/portrait/${simpleNameId}_portrait.jpg`;
            
            if (fallbackUrl !== portraitImageUrl) {
              console.log(`Trying alternative portrait URL: ${fallbackUrl}`);
              (e.target as HTMLImageElement).src = fallbackUrl;
              return; // Don't set error state yet
            }
          }
          
          setImageError(true);
        }}
      />
      <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
        {fallback || displayName.split(' ').map(word => word[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarPortrait;
