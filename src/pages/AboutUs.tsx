
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common/PageHeader';
import PatreonSupportSection from '@/components/about/PatreonSupportSection';
import { Footer } from '@/components/landing/Footer';

const AboutUs = () => {
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <PageHeader title={language === 'en' ? 'About Us' : language === 'es' ? 'Sobre Nosotros' : 'À Propos'} />
      
      <div className="container mx-auto px-4 py-8 pb-24">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-warcrow-gold mb-6">
            {language === 'en' ? 'About Warcrow Army Builder' : 
             language === 'es' ? 'Sobre el Constructor de Ejércitos de Warcrow' : 
             'À Propos du Constructeur d\'Armée Warcrow'}
          </h1>
          
          <div className="prose prose-invert max-w-none mb-8">
            <p>
              {language === 'en' 
                ? 'Warcrow Army Builder is an unofficial application developed by fans of Warcrow to help the community build and share army lists for the game.' 
                : language === 'es' 
                ? 'El Constructor de Ejércitos de Warcrow es una aplicación no oficial desarrollada por fans de Warcrow para ayudar a la comunidad a crear y compartir listas de ejércitos para el juego.'
                : 'Le Constructeur d\'Armée Warcrow est une application non officielle développée par des fans de Warcrow pour aider la communauté à construire et partager des listes d\'armée pour le jeu.'}
            </p>
            <p>
              {language === 'en'
                ? 'Our goal is to provide a useful tool that enhances the gaming experience while respecting the intellectual property of Corvus Belli.'
                : language === 'es'
                ? 'Nuestro objetivo es proporcionar una herramienta útil que mejore la experiencia de juego, respetando la propiedad intelectual de Corvus Belli.'
                : 'Notre objectif est de fournir un outil utile qui améliore l\'expérience de jeu tout en respectant la propriété intellectuelle de Corvus Belli.'}
            </p>
            <p>
              {language === 'en'
                ? 'This application is maintained by a small team of volunteers who are passionate about the game. We are always looking for ways to improve the app and welcome feedback from the community.'
                : language === 'es'
                ? 'Esta aplicación es mantenida por un pequeño equipo de voluntarios apasionados por el juego. Siempre estamos buscando formas de mejorar la aplicación y agradecemos los comentarios de la comunidad.'
                : 'Cette application est maintenue par une petite équipe de bénévoles passionnés par le jeu. Nous cherchons toujours des moyens d\'améliorer l\'application et accueillons les commentaires de la communauté.'}
            </p>
          </div>
          
          <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
            {language === 'en' ? 'Our Team' : 
             language === 'es' ? 'Nuestro Equipo' : 
             'Notre Équipe'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-black/60 border border-warcrow-gold/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-warcrow-gold mb-2">Jonathan Caldwell</h3>
              <p className="text-sm text-warcrow-text/80">
                {language === 'en' ? 'Lead Developer & Designer' : 
                 language === 'es' ? 'Desarrollador Principal y Diseñador' : 
                 'Développeur Principal et Designer'}
              </p>
              <p className="mt-2">
                {language === 'en' 
                  ? 'Creator and maintainer of the Warcrow Army Builder application. Passionate about game design and web development.' 
                  : language === 'es' 
                  ? 'Creador y mantenedor de la aplicación Constructor de Ejércitos de Warcrow. Apasionado por el diseño de juegos y el desarrollo web.'
                  : 'Créateur et mainteneur de l\'application Constructeur d\'Armée Warcrow. Passionné par le design de jeux et le développement web.'}
              </p>
            </div>
            
            <div className="bg-black/60 border border-warcrow-gold/30 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-warcrow-gold mb-2">Warcrow Community</h3>
              <p className="text-sm text-warcrow-text/80">
                {language === 'en' ? 'Testing & Feedback' : 
                 language === 'es' ? 'Pruebas y Comentarios' : 
                 'Tests et Commentaires'}
              </p>
              <p className="mt-2">
                {language === 'en' 
                  ? 'Special thanks to all the community members who have tested the app and provided valuable feedback to help improve it.' 
                  : language === 'es' 
                  ? 'Un agradecimiento especial a todos los miembros de la comunidad que han probado la aplicación y proporcionado valiosos comentarios para ayudar a mejorarla.'
                  : 'Un remerciement spécial à tous les membres de la communauté qui ont testé l\'application et fourni des commentaires précieux pour aider à l\'améliorer.'}
              </p>
            </div>
          </div>
          
          {/* Add our new Patreon support section */}
          <PatreonSupportSection />
          
          <div className="mt-8 text-center">
            <p className="text-warcrow-text/60 text-sm">
              {language === 'en' 
                ? 'Warcrow is a trademark of Corvus Belli S.L. This app is unofficial and not affiliated with Corvus Belli.' 
                : language === 'es' 
                ? 'Warcrow es una marca registrada de Corvus Belli S.L. Esta aplicación es no oficial y no está afiliada con Corvus Belli.'
                : 'Warcrow est une marque déposée de Corvus Belli S.L. Cette application est non officielle et n\'est pas affiliée à Corvus Belli.'}
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
