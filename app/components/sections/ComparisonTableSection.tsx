import { ComparisonTable } from "@/components/ui/custom/ComparisonTable";
import { useApp } from "@/contexts/AppContext";

export default function App() {
  const { t } = useApp();
  return (
    <div className=" bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("comparisonTitle")}
          </h2>
          <p className="text-lg text-gray-600"> {t("comparisonSubtitle")}</p>
        </div>

        <ComparisonTable />
      </div>
    </div>
  );
}
