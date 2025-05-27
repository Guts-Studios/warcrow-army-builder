
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProvidersWrapper } from '@/components/providers/ProvidersWrapper';

// Import all pages
import Landing from '@/pages/Landing';
import Play from '@/pages/Play';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ArmyBuilder from '@/pages/ArmyBuilder';
import AboutUs from '@/pages/AboutUs';
import Rules from '@/pages/Rules';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Admin from '@/pages/Admin';

function App() {
  return (
    <ProvidersWrapper>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/play" element={<Play />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/builder" element={<ArmyBuilder />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </ProvidersWrapper>
  );
}

export default App;
