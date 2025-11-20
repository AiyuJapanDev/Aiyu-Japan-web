
import React from 'react';
import { MapPin, Calculator, Package, DollarSign, Headphones, Mail } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

const FooterMenu = () => {
  const { t } = useApp();
  
  const menuItems = [
    { icon: MapPin, name: t('whereToShopMenu'), href: '/store-guide' },
    { icon: Calculator, name: t('calculatorBeta'), href: '/calculator' },
    { icon: Package, name: t('servicesFooter'), href: '/services' },
    { icon: Mail, name: t('contactFooter'), href: '/contact' },
  ];

  return (
    <div className="lg:col-span-1">
      <h4 className="font-bold text-lg mb-4">{t('footerMenu')}</h4>
      <ul className="space-y-3">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <li key={index}>
              <a
                href={item.href}
                className="flex items-center space-x-2 text-primary/80 hover:text-capybara-orange transition-colors text-sm"
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FooterMenu;
