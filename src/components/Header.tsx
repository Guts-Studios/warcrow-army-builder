
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Bell, Settings, User, Home, Sword, BarChart3, BookOpen, HelpCircle, Users, LogOut, LogIn } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface NewsItem {
  id: string;
  date: string;
  key: string;
}

interface HeaderProps {
  latestNewsItem?: NewsItem | null;
  onNewsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ latestNewsItem, onNewsClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();
  const location = useLocation();
  const { isAuthenticated, isWabAdmin, isLoading: authLoading, forceSignOut } = useAuth();
  
  // Wait for auth to be resolved before showing auth-dependent content
  const isAuthResolved = !authLoading && isAuthenticated !== null;

  useEffect(() => {
    if (latestNewsItem && isAuthResolved) {
      console.log("Header: Set latest news item:", latestNewsItem);
    }
  }, [latestNewsItem, isAuthResolved]);

  const handleSignOut = async () => {
    try {
      console.log("Header: Signing out user");
      await forceSignOut();
      toast.success(t('signedOutSuccessfully'));
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error(t('errorSigningOut'));
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/army-builder', icon: Sword, label: t('armyBuilder') },
    { path: '/stats', icon: BarChart3, label: t('stats') },
    { path: '/rules', icon: BookOpen, label: t('rules') },
    { path: '/faq', icon: HelpCircle, label: t('faq') },
    { path: '/community', icon: Users, label: t('community') }
  ];

  return (
    <header className="bg-warcrow-background/95 backdrop-blur-sm border-b border-warcrow-gold/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-warcrow-gold rounded-full flex items-center justify-center">
              <Sword className="h-5 w-5 text-black" />
            </div>
            <span className="text-xl font-bold text-warcrow-gold">WAB</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                    isActiveRoute(item.path)
                      ? 'bg-warcrow-gold/20 text-warcrow-gold'
                      : 'text-warcrow-text hover:bg-warcrow-gold/10 hover:text-warcrow-gold'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side - News, Language Switcher, Auth */}
          <div className="flex items-center space-x-3">
            {/* Latest News Button - only show when auth is resolved and news is available */}
            {isAuthResolved && latestNewsItem && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNewsClick}
                className="hidden md:flex items-center space-x-2 text-warcrow-gold hover:bg-warcrow-gold/10"
              >
                <Bell className="h-4 w-4" />
                <span className="text-sm">{t('latestNews')}</span>
                <Badge variant="outline" className="border-warcrow-gold/30 text-xs">
                  {new Date(latestNewsItem.date).toLocaleDateString()}
                </Badge>
              </Button>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Auth Section - only show when auth is resolved */}
            {isAuthResolved && (
              <div className="flex items-center space-x-2">
                {isAuthenticated ? (
                  <>
                    {/* Profile Link */}
                    <Link to="/profile">
                      <Button variant="ghost" size="sm" className="text-warcrow-gold hover:bg-warcrow-gold/10">
                        <User className="h-4 w-4" />
                        <span className="hidden sm:ml-2 sm:inline">{t('profile')}</span>
                      </Button>
                    </Link>

                    {/* Admin Panel Link - only show for admins */}
                    {isWabAdmin && (
                      <Link to="/admin">
                        <Button variant="ghost" size="sm" className="text-warcrow-gold hover:bg-warcrow-gold/10">
                          <Settings className="h-4 w-4" />
                          <span className="hidden sm:ml-2 sm:inline">{t('admin')}</span>
                        </Button>
                      </Link>
                    )}

                    {/* Sign Out */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-warcrow-gold hover:bg-warcrow-gold/10"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden sm:ml-2 sm:inline">{t('signOut')}</span>
                    </Button>
                  </>
                ) : (
                  <Link to="/login">
                    <Button variant="ghost" size="sm" className="text-warcrow-gold hover:bg-warcrow-gold/10">
                      <LogIn className="h-4 w-4" />
                      <span className="hidden sm:ml-2 sm:inline">{t('signIn')}</span>
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="lg:hidden text-warcrow-gold"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-warcrow-gold/20 py-4">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMenu}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-colors ${
                      isActiveRoute(item.path)
                        ? 'bg-warcrow-gold/20 text-warcrow-gold'
                        : 'text-warcrow-text hover:bg-warcrow-gold/10 hover:text-warcrow-gold'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {/* Mobile News Button - only show when auth is resolved and news is available */}
              {isAuthResolved && latestNewsItem && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    onNewsClick?.();
                    closeMenu();
                  }}
                  className="flex items-center justify-start space-x-2 px-3 py-2 text-warcrow-gold hover:bg-warcrow-gold/10"
                >
                  <Bell className="h-4 w-4" />
                  <span>{t('latestNews')}</span>
                  <Badge variant="outline" className="border-warcrow-gold/30 text-xs ml-auto">
                    {new Date(latestNewsItem.date).toLocaleDateString()}
                  </Badge>
                </Button>
              )}

              {/* Mobile Auth Section - only show when auth is resolved */}
              {isAuthResolved && (
                <div className="border-t border-warcrow-gold/20 pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="flex items-center space-x-2 px-3 py-2 text-warcrow-gold hover:bg-warcrow-gold/10 rounded-md"
                      >
                        <User className="h-4 w-4" />
                        <span>{t('profile')}</span>
                      </Link>

                      {isWabAdmin && (
                        <Link
                          to="/admin"
                          onClick={closeMenu}
                          className="flex items-center space-x-2 px-3 py-2 text-warcrow-gold hover:bg-warcrow-gold/10 rounded-md"
                        >
                          <Settings className="h-4 w-4" />
                          <span>{t('admin')}</span>
                        </Link>
                      )}

                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleSignOut();
                          closeMenu();
                        }}
                        className="flex items-center justify-start space-x-2 px-3 py-2 text-warcrow-gold hover:bg-warcrow-gold/10 w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t('signOut')}</span>
                      </Button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="flex items-center space-x-2 px-3 py-2 text-warcrow-gold hover:bg-warcrow-gold/10 rounded-md"
                    >
                      <LogIn className="h-4 w-4" />
                      <span>{t('signIn')}</span>
                    </Link>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
