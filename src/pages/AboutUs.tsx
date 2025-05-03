
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const AboutUs = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <div className="bg-black/50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <img 
                src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
                alt="Warcrow Logo" 
                className="h-16"
              />
              <h1 className="text-3xl font-bold text-warcrow-gold text-center md:text-left">{t('aboutUs')}</h1>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
                onClick={() => navigate('/landing')}
              >
                <Home className="mr-2 h-4 w-4" />
                {t('home')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-black/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-warcrow-gold mb-4">{t('supportProject')}</h2>
            <p className="text-warcrow-text mb-6">
              {language === 'en' ? 
                "The Warcrow Army Builder is a passion project created by fans, for fans. If you enjoy using our application and want to support its continued development, consider becoming a patron!" :
                "El Constructor de Ejércitos de Warcrow es un proyecto apasionado creado por fans, para fans. Si disfrutas usando nuestra aplicación y quieres apoyar su desarrollo continuo, ¡considera convertirte en patrocinador!"
              }
            </p>
            <Button
              onClick={() => window.open('https://www.patreon.com/c/GutzStudio', '_blank')}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
            >
              {language === 'en' ? 
                "Support us on Patreon" : 
                "Apóyanos en Patreon"
              }
            </Button>
          </div>

          <div className="bg-black/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-warcrow-gold mb-4">{t('ourMission')}</h2>
            <p className="text-warcrow-text">
              {language === 'en' ? 
                "We aim to provide the Warcrow community with high-quality, user-friendly tools that enhance their gaming experience. This army builder is designed to make list building easier and more enjoyable for players of all experience levels." :
                "Nuestro objetivo es proporcionar a la comunidad de Warcrow herramientas de alta calidad y fáciles de usar que mejoren su experiencia de juego. Este constructor de ejércitos está diseñado para hacer que la creación de listas sea más fácil y agradable para jugadores de todos los niveles de experiencia."
              }
            </p>
          </div>

          <div className="bg-black/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-warcrow-gold mb-4">{t('contactUs')}</h2>
            <p className="text-warcrow-text mb-2">
              {language === 'en' ? 
                "Have questions, suggestions, or want to report a bug? We'd love to hear from you!" :
                "¿Tienes preguntas, sugerencias o quieres reportar un error? ¡Nos encantaría saber de ti!"
              }
            </p>
            <a 
              href="mailto:warcrowarmy@gmail.com"
              className="text-warcrow-gold hover:text-warcrow-gold/80 underline"
            >
              {language === 'en' ? 
                "Contact us at warcrowarmy@gmail.com" :
                "Contáctanos en warcrowarmy@gmail.com"
              }
            </a>
          </div>

          <div className="bg-black/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-warcrow-gold mb-4">{t('ourSupporters')}</h2>
            <p className="text-warcrow-text mb-4">
              {language === 'en' ? 
                "We extend our heartfelt gratitude to these amazing supporters who help make this project possible:" :
                "Extendemos nuestra más sincera gratitud a estos increíbles patrocinadores que ayudan a hacer posible este proyecto:"
              }
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-warcrow-gold">★</span>
                <span className="text-warcrow-text">Knight of Squires</span>
                <span className="text-xs text-warcrow-gold italic ml-2">
                  {language === 'en' ? "First Ever Supporter" : "Primer Patrocinador"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
