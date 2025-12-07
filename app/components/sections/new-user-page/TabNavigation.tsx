import { Button } from "@/components/ui/button";
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
    <div className=" border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container overflow-x-hidden px-4">
        <div className="flex flex-wrap gap-2 py-2">
          {tabs.map((tab, index) => (
            <NavLink
              key={index}
              to={`${tab.value}`}
              className={({ isActive, isPending }) => {
                const active = "text-blue-600";
                const inactive = "text-gray-500 hover:text-gray-900";
                return `flex-1 relative font-medium transition-colors w-full ${
                  isActive ? active : inactive
                }`;
              }}
            >
              <Button variant="outline" className="w-full">
                {tab.label}
              </Button>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};
