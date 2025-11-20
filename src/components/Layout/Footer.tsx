
import React from 'react';
import FooterLogo from './Footer/FooterLogo';
import FooterMenu from './Footer/FooterMenu';
import FooterLegal from './Footer/FooterLegal';
import FooterContact from './Footer/FooterContact';
import FooterCopyright from './Footer/FooterCopyright';

const Footer = () => {
  return (
    <footer className="text-primary mt-16" style={{ backgroundColor: '#ffffffff' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top row: Menu | Logo | Legal */}
        <div className="grid grid-cols-3 gap-8 items-center mb-8">
          <div className="flex justify-start">
        <FooterMenu />
          </div>
          <div className="flex justify-center">
        <FooterLogo />
          </div>
          <div className="flex justify-end">
        <FooterLegal />
          </div>
        </div>





        {/* Bottom row: Contact */}
        <div className="flex justify-start">
          <FooterContact />
        </div>

        <FooterCopyright />
      </div>
    </footer>
  );
};

export default Footer;
