
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();
  
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
              <h1 className="text-3xl font-bold text-warcrow-gold text-center md:text-left">About Us</h1>
            </div>
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
              onClick={() => navigate('/landing')}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-black/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Support Our Project</h2>
            <p className="text-warcrow-text mb-6">
              The Warcrow Army Builder is a passion project created by fans, for fans. If you enjoy using our application and want to support its continued development, consider becoming a patron!
            </p>
            <Button
              onClick={() => window.open('https://www.patreon.com/c/GutzStudio', '_blank')}
              className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80"
            >
              Support us on Patreon
            </Button>
          </div>

          <div className="bg-black/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Our Mission</h2>
            <p className="text-warcrow-text">
              We aim to provide the Warcrow community with high-quality, user-friendly tools that enhance their gaming experience. This army builder is designed to make list building easier and more enjoyable for players of all experience levels.
            </p>
          </div>

          <div className="bg-black/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Contact Us</h2>
            <p className="text-warcrow-text mb-2">
              Have questions, suggestions, or want to report a bug? We'd love to hear from you!
            </p>
            <a 
              href="mailto:warcrowarmy@gmail.com"
              className="text-warcrow-gold hover:text-warcrow-gold/80 underline"
            >
              Contact us at warcrowarmy@gmail.com
            </a>
          </div>

          <div className="bg-black/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Our Supporters</h2>
            <p className="text-warcrow-text mb-4">
              We extend our heartfelt gratitude to these amazing supporters who help make this project possible:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-warcrow-gold">★</span>
                <span className="text-warcrow-text">Knight of Squires</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
