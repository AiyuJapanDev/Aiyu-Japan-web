import { useApp } from "@/contexts/AppContext";
import { NavLink } from "react-router";

export const TabNavigation = () => {
  const { t } = useApp();

  const tabs = [
    { label: t("tabWhatIs"), value: "what-is" },
    { label: t("tabHowItWorks"), value: "how-it-works" },
    { label: t("tabFees"), value: "fees" },
    /* { label: t("tabCommission"), value: "commission" }, */
    { label: t("tabMarkets"), value: "popular-markets" },
    { label: t("tabRestrictions"), value: "restrictions" },
  ];

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto overflow-x-auto px-4">
        <div className="flex min-w-max space-x-8">
          {tabs.map((tab, index) => (
            <NavLink
              to={`${tab.value}`}
              key={index}
              className={({ isActive, isPending }) => {
                const active = "text-blue-600";
                const inactive = "text-gray-500 hover:text-gray-900";
                return `relative py-4 text-sm font-medium transition-colors ${
                  isActive ? active : inactive
                }`;
              }}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
