
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-warcrow-gold">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-warcrow-text/70 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
        >
          {t('home')}
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
