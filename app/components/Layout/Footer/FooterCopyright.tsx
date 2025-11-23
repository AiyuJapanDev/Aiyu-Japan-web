
import React from 'react';
import { useApp } from '@/contexts/AppContext';

const FooterCopyright = () => {
  const { t } = useApp();
  return (
    <div className="border-t border-primary/20 pt-8 mt-8">
      <div className="text-center">
        <p className="text-primary/60 text-sm">
          {t('footerCopyright')}
        </p>
      </div>
    </div>
  );
};

export default FooterCopyright;
