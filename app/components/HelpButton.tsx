import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/contexts/useAuth';
import { useApp } from '@/contexts/AppContext';
import ReactGA from 'react-ga4';
import { useState, useEffect } from 'react';

export default function HelpButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { language } = useApp();
  const [showBubble, setShowBubble] = useState(false);
  
  const isHelpActive = location.pathname.includes('/help-center') || 
    (location.pathname.includes('/user-dashboard') && location.search.includes('tab=help'));

  useEffect(() => {
    const showTimeout = setTimeout(() => {
      setShowBubble(true);
      
      const hideTimeout = setTimeout(() => {
        setShowBubble(false);
      }, 6000);

      return () => clearTimeout(hideTimeout);
    }, 500);

    return () => clearTimeout(showTimeout);
  }, []);
  
  const shouldHide = location.pathname.includes('/admin-dashboard') || 
    location.pathname.includes('/help-center') ||
    (location.pathname.includes('/user-dashboard') && location.search.includes('tab=help'));
  
  if (shouldHide) {
    return null;
  }

  const handleClick = () => {
    ReactGA.event({
      category: 'Help Center',
      action: 'Click Help Button',
      label: user ? 'Logged In User' : 'Guest User'
    });

    if (user) {
      navigate('/user-dashboard?tab=help');
    } else {
      navigate('/help-center');
    }
  };

  const helpText = language === 'es' ? '¿Necesitas ayuda?' : 'Need help?';

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50">
      {showBubble && (
        <div className="absolute bottom-full right-0 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="relative bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-capybara-orange/40">
            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
              {helpText}
            </p>
            <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-capybara-orange/40"></div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" style={{ marginTop: '-2px' }}></div>
          </div>
        </div>
      )}
      
      <button
        onClick={handleClick}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all active:scale-95 hover:scale-110 ${
          isHelpActive
            ? ' text-black'
            : 'bg-white/20 text-white hover:bg-white/40'
        }`}
        aria-label="Centro de Ayuda"
      >
        <img 
          src="/capiRules.png" 
          alt="Ayuda"
          width={96}
          height={96}
          className="w-full h-full object-cover rounded-full"
        />
      </button>
    </div>
  );
}
