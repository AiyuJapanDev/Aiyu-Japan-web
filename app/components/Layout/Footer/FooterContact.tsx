
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const FooterContact = () => {
  const { t } = useApp();
  return (
    <div className="lg:col-span-1">
      <div className="flex items-center space-x-4 mb-6">
        <a
          href="https://facebook.com/aiyujapan"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-capybara-orange hover:text-primary-foreground transition-colors"
        >
          <Facebook className="w-5 h-5" />
        </a>
        <a
          href="https://instagram.com/aiyu.japan"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-capybara-orange hover:text-primary-foreground transition-colors"
        >
          <Instagram className="w-5 h-5" />
        </a>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-semibold mb-1">{t('contactLabel')}</p>
        <a
          href="mailto:info@aiyujapan.com"
          className="text-primary/80 hover:text-capybara-orange transition-colors text-sm"
        >
          info@aiyujapan.com
        </a>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1">{t('taxIdFooter')}</p>
        <div className="flex space-x-4 text-primary/80 text-sm">
          <span>1120003030849</span>

        </div>
      </div>
    </div>
  );
};

export default FooterContact;
