import { useApp } from "@/contexts/AppContext";

interface TabNavigationProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
}

export const TabNavigation = ({
  activeTab,
  setActiveTab,
}: TabNavigationProps) => {
  const { t } = useApp();

  const tabs = [
    t("tabWhatIs"),
    t("tabHowItWorks"),
    t("tabFees"),
    t("tabCommission"),
    t("tabMarkets"),
    t("tabRestrictions"),
  ];

  return (
    <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto overflow-x-auto px-4">
        <div className="flex min-w-max space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`relative py-4 text-sm font-medium transition-colors ${
                activeTab === index
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
              {activeTab === index && (
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
