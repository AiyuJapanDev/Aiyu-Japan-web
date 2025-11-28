import React, { useState } from "react";
import HowItWorksSection from "../HowItWorksSection";
import { CommissionSection } from "../../../routes/CommissionSection";
import { FeesSection } from "../../../routes/FeesSection";
import { PopularMarketsSection } from "../../../routes/PopularMarketsSection";
import { RestrictionsSection } from "../../../routes/RestrictionsSection";
import { TabNavigation } from "./TabNavigation";
import { WhatIsSection } from "../../../routes/WhatIsSection";

function TabPages() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 0 && <WhatIsSection />}
      {activeTab === 1 && <HowItWorksSection />}
      {activeTab === 2 && <FeesSection />}
      {activeTab === 3 && <CommissionSection />}
      {activeTab === 4 && <PopularMarketsSection />}
      {activeTab === 5 && <RestrictionsSection />}
    </>
  );
}

export default TabPages;
