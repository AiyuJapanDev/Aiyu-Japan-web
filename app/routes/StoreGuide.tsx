import { CommissionSection } from "@/components/sections/new-user-page/CommissionSection";
import { FeesSection } from "@/components/sections/new-user-page/FeesSection";
import { HeroSection } from "@/components/sections/new-user-page/HeroSection";
import { HowItWorksSection } from "@/components/sections/new-user-page/HowItWorksSection";
import { PopularMarketsSection } from "@/components/sections/new-user-page/PopularMarketsSection";
import { RestrictionsSection } from "@/components/sections/new-user-page/RestrictionsSection";
import { TabNavigation } from "@/components/sections/new-user-page/TabNavigation";
import { WhatIsSection } from "@/components/sections/new-user-page/WhatIsSection";
import { useState } from "react";

export default function StoreGuide() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 0 && <WhatIsSection />}
      {activeTab === 1 && <HowItWorksSection />}
      {activeTab === 2 && <FeesSection />}
      {activeTab === 3 && <CommissionSection />}
      {activeTab === 4 && <PopularMarketsSection />}
      {activeTab === 5 && <RestrictionsSection />}
    </div>
  );
}
