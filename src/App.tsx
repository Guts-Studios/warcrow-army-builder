
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
import Builder from '@/pages/Builder';
import AboutUs from '@/pages/AboutUs';
import Rules from '@/pages/Rules';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
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
            <Route path="/builder" element={<Builder />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </ProvidersWrapper>
  );
}

export default App;
