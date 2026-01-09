import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { SocialMediaIframeBlock } from "@/types/blocks";

interface SocialMediaSectionProps {
  data: SocialMediaIframeBlock;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ data }) => {
  const { t } = useApp();
  const url = data.url || "https://www.instagram.com/aiyu.japan/embed";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row justify-center items-start gap-8">
        {/* Customer Reviews */}
        <div className="w-full max-w-md flex flex-col items-center hidden">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t("customerReviews")}
          </h3>
          <Card className="flex-grow bg-white/90 backdrop-blur-sm border-blue-200 shadow-md h-full w-full"></Card>
        </div>

        {/* Instagram Profile Embed */}
        <div className="w-full max-w-md flex flex-col items-center mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t("instagramFeed")}
          </h3>
          <Card className="flex-grow bg-white/90 backdrop-blur-sm border-[#FFB115] border-2 shadow-lg h-full w-full">
            <CardContent className="h-full">
              <div className="p-5 pt-10 max-w-[600px] mx-auto">
                <iframe
                  src={url}
                  width="100%"
                  height="400"
                  name="Instagram Feed"
                  scrolling="no"
                  className="w-full h-[400px] border-none"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaSection;
