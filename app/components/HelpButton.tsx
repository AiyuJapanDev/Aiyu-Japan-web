import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/contexts/useAuth';
import ReactGA from 'react-ga4';

export default function HelpButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const isHelpActive = location.pathname.includes('/help-center') || 
    (location.pathname.includes('/user-dashboard') && location.search.includes('tab=help'));

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

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50">
      <button
        onClick={handleClick}
        className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 hover:scale-110 ${
          isHelpActive
            ? 'bg-white/80 text-black'
            : 'bg-white/80 drop-shadow-xl text-white hover:bg-capybara-orange'
        }`}
        aria-label="Centro de Ayuda"
      >
        <img 
          src="/capiHelp.png" 
          alt="Ayuda" 
          width={50} 
          height={50} 
          className="w-full h-full object-cover rounded-full"
        />
      </button>
    </div>
  );
}
