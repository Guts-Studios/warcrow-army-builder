
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { PageHeader } from '@/components/common/PageHeader';
import { Footer } from '@/components/landing/Footer';
import { Container } from '@/components/ui/custom';

const Register = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title="Register" />
      
      <Container className="py-8 pb-24 px-4 md:px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-warcrow-gold mb-6 text-center">
            Create Account
          </h1>
          
          <div className="bg-black/40 border border-warcrow-gold/30 rounded-lg p-6">
            <p className="text-center text-warcrow-text/80 mb-4">
              Registration functionality coming soon!
            </p>
            
            <div className="text-center">
              <Link 
                to="/login" 
                className="text-warcrow-gold hover:text-warcrow-gold/80 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default Register;
