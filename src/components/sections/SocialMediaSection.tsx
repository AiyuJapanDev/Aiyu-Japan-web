import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

const SocialMediaSection = () => {
  const { t } = useApp();

 

  return (
    <section className="py-20 bg-white/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
          
          {/* Customer Reviews */}
          <div className="w-full max-w-md flex flex-col items-center hidden">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t('customerReviews')}
            </h3>
            <Card className="flex-grow bg-white/90 backdrop-blur-sm border-blue-200 shadow-md h-full w-full">
              
            </Card>
          </div>

          {/* Instagram Profile Embed */}
          <div className="w-full max-w-md flex flex-col items-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {t('instagramFeed')}
            </h3>
            <Card className="flex-grow bg-white/90 backdrop-blur-sm border-[#FFB115] border-2 shadow-lg h-full w-full">
              <CardContent className="h-full">
                <div className="p-5 pt-10 max-w-[600px] mx-auto">
                  <iframe
                    src="https://www.instagram.com/aiyu.japan/embed"
                    width="100%"
                    height="400"
                    name="Instagram Feed"
                    scrolling="no"
                    className="w-full h-[400px] border-none"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SocialMediaSection;
