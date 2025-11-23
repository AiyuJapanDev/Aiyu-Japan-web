
import React from 'react';
import { useApp } from '@/contexts/AppContext';

const FooterLegal = () => {
  const { t } = useApp();
  
  const legalItems = [
    { name: t('termsOfService'), href: '/terms-of-service' },
    { name: t('privacyPolicy'), href: '/privacy-policy' },
  ];

  return (
    <div className="lg:col-span-1">
      <h4 className="font-bold text-lg mb-4">{t('legal')}</h4>
      <ul className="space-y-3">
        {legalItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.href}
              className="text-primary/80 hover:text-capybara-orange transition-colors text-sm"
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLegal;
