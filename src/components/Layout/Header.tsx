
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, LogOut, Crown, ChevronDown, Bell, Calculator } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from '@/hooks/useNotifications';


const Header = () => {
  const { language, setLanguage, t } = useApp();
  const { user, signOut, isAdmin, userRole, profile } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Utility for display name
  const displayName = profile?.full_name?.trim()
    ? profile?.full_name
    : user?.email ?? '';

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Ignore clicks on the toggle button itself
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !(target as HTMLElement).closest('#mobileMenuToggle')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-sm border-b-2 border-capybara-orange/20 sticky top-0 z-50 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover-bounce transition-all duration-300 flex-shrink-0">
              <img src="/aiyu_logo_small.png" alt="Capybara Logo" className="h-16 sm:h-16" />
              {isMobileMenuOpen && (
                <span className="font-paytone text-3xl text-[#3b434d] ">Aiyu Japan</span>)}
            </Link>

            {/* Centered Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center space-x-2">
                <Link
                  to="/"
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 story-link ${location.pathname === '/'
                    ? 'text-capybara-orange'
                    : 'text-gray-700 hover:text-capybara-orange'
                    }`}
                >
                  {t('home')}
                </Link>

                {/* Information Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="px-4 py-2 text-sm font-semibold transition-all duration-300 text-gray-700 hover:text-capybara-orange flex items-center space-x-1">
                    <span>{t('information')}</span>
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white border border-capybara-orange/20 shadow-lg rounded-lg">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/services"
                        className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${location.pathname === '/services'
                          ? 'text-capybara-orange'
                          : 'text-gray-700 hover:text-capybara-orange'
                          }`}
                      >
                        {t('services')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/store-guide"
                        className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${location.pathname === '/store-guide'
                          ? 'text-capybara-orange'
                          : 'text-gray-700 hover:text-capybara-orange'
                          }`}
                      >
                        {t('storeGuide')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/contact"
                        className={`px-4 py-2 text-sm font-semibold transition-all duration-300 ${location.pathname === '/contact'
                          ? 'text-capybara-orange'
                          : 'text-gray-700 hover:text-capybara-orange'
                          }`}
                      >
                        {t('contact')}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>


                <Link
                  to="/calculator"
                  className={` px-4 py-2 text-sm font-semibold transition-all duration-300 story-link ${location.pathname === '/calculator'
                    ? 'text-capybara-orange'
                    : 'text-gray-700 hover:text-capybara-orange'
                    }`}
                >
                  {t('calculator')}
                </Link>

                <Link
                  to="/dashboard"
                  className={`px-4 py-2 text-sm font-semibold transition-all duration-300 story-link ${location.pathname === '/dashboard'
                    ? 'text-capybara-orange'
                    : 'text-gray-700 hover:text-capybara-orange'
                    }`}
                >
                  {t('dashboard')}
                </Link>
              </div>
            </div>

            {/* Auth Actions - Desktop */}

            <div className="hidden md:flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {isAdmin && (
                      <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        <Crown className="w-3 h-3" />
                        <span>Admin</span>
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      {t('welcome')}, {displayName}

                    </span>
                  </div>
                  <div className="flex items-center space-x-0">
                    <Link to="/calculator">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300"
                      >
                        <Calculator className="h-5 w-5 text-grey-600" />
                      </Button>
                    </Link>

                    <Link to={isAdmin ? "/admin-dashboard?tab=notifications" : "/user-dashboard?tab=notifications"}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300 relative"
                      >
                        <Bell className="h-5 w-5 text-grey-600" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('logout')}</span>
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button className="bubble-btn-primary hover-bounce">
                    {t('login')}
                  </Button>
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center space-x-1">
              {/* Calculator icon */}
              <Link to="/calculator">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300"
                >
                  <Calculator className="h-5 w-5 text-gray-600" />
                </Button>
              </Link>

              {/* Notifications bell */}
              {user && (
                <Link to={isAdmin ? "/admin-dashboard?tab=notifications" : "/user-dashboard?tab=notifications"}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300 relative"
                  >
                    <Bell className="h-5 w-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>
              )}

              {/* Mobile menu toggle */}
              <Button
                id="mobileMenuToggle"
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="h-9 w-9 rounded-full hover:bg-capybara-cream transition-all duration-300"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
              </Button>
            </div>
          </div>
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden animate-fade-in" ref={mobileMenuRef}>

              <div className="px-2 pt-2 pb-2 space-y-2 sm:px-3 bg-white/95 border-t-2 border-capybara-orange/20 rounded-b-3xl min-h-screen">

                <Link
                  to="/"
                  className={`block px-4 py-3 rounded-full text-base font-semibold transition-all duration-300 ${location.pathname === '/'
                    ? 'text-white bg-capybara-orange'
                    : 'text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('home')}
                </Link>

                {/* Information Section Title */}
                <div className="px-4 py-2 text-base font-bold text-gray-500">{t('information')}</div>

                <Link
                  to="/services"
                  className={`block px-4 py-3 rounded-full text-base transition-all duration-300 ml-4 ${location.pathname === '/services'
                    ? 'text-white bg-capybara-orange'
                    : 'text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('services')}
                </Link>

                <Link
                  to="/store-guide"
                  className={`block px-4 py-3 rounded-full text-base transition-all duration-300 ml-4 ${location.pathname === '/store-guide'
                    ? 'text-white bg-capybara-orange'
                    : 'text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('storeGuide')}
                </Link>

                <Link
                  to="/contact"
                  className={`block px-4 py-3 rounded-full text-base transition-all duration-300 ml-4 ${location.pathname === '/contact'
                    ? 'text-white bg-capybara-orange'
                    : 'text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('contact')}
                </Link>

                <Link
                  to="/calculator"
                  className={`block px-4 py-3 rounded-full text-base font-semibold transition-all duration-300 ${location.pathname === '/calculator'
                    ? 'text-white bg-capybara-orange'
                    : 'text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('calculator')}
                </Link>

                <Link
                  to="/dashboard"
                  className={`block px-4 py-3 rounded-full text-base font-semibold transition-all duration-300 ${location.pathname === '/user-dashboard' || location.pathname === '/admin-dashboard'
                    ? 'text-white bg-capybara-orange'
                    : 'text-gray-700 hover:text-capybara-orange hover:bg-capybara-cream'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>




                <div className="relative w-full">
                  
                  <Globe className="w-4 h-4 text-capybara-orange absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none" />

                  
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                    className="appearance-none w-full bg-capybara-cream text-gray-700 border-none focus:outline-none font-body rounded-full px-4 py-2 pr-10 pl-10 text-sm cursor-pointer"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>

                  
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none" />
                </div>


                <div className="flex items-center justify-between px-1 py-3 border-b-2 border-capybara-orange/20">

                  {user ? (
                    <div className="flex items-center space-x-2">
                      <div className='flex ml-auto'>
                        {isAdmin && (
                          <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                            <Crown className="w-3 h-3" />
                          </div>
                        )}
                        <span className="text-sm text-gray-600">
                          {t('welcome')}, {displayName}
                          {userRole && userRole !== 'user' && (
                            <span className="ml-1 text-xs text-gray-500">({userRole})</span>
                          )}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          setIsMobileMenuOpen(false);
                          await handleSignOut();
                        }}
                        className="flex items-center space-x-1 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('logout')}</span>
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="bubble-btn-primary text-sm">
                        {t('login')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Language Switcher - Bottom Left */}
      <div className="fixed bottom-4 left-3 z-50 hidden md:block mr-1">
        <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-3 shadow-lg border border-capybara-orange/20">
          <Globe className="w-5 h-5 text-capybara-orange" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
            className="bg-transparent text-sm text-gray-700 border-none focus:outline-none cursor-pointer font-body"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>

          </select>
        </div>
      </div>
    </>
  );
};

export default Header;
