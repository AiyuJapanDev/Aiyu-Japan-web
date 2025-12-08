import { useApp } from "@/contexts/AppContext";
import { Check, X, Info } from "lucide-react";

interface ComparisonRow {
  aspect: string;
  aiyu: string | React.ReactNode;
  empresaB: string | React.ReactNode;
  empresaC: string | React.ReactNode;
}

export function ComparisonTable() {
  const { t } = useApp();

  const comparisonData: ComparisonRow[] = [
    {
      aspect: t("compAspectFee"),
      aiyu: t("compValFrom500"),
      empresaB: "¥500–¥800",
      empresaC: "¥350",
    },
    {
      aspect: t("compAspectLocker"),
      aiyu: t("compVal1000PerPkg"),
      empresaB: t("compValNo"),
      empresaC: t("compValNo"),
    },
    {
      aspect: t("compAspectConsolidation"),
      aiyu: t("compValIncluded"),
      empresaB: t("compValIncluded"),
      empresaC: t("compValIncluded"),
    },
    {
      aspect: t("compAspectPackaging"),
      aiyu: t("compValFree"),
      empresaB: t("compValFree"),
      empresaC: t("compVal500Plus"),
    },
    {
      aspect: t("compAspectUnpacking"),
      aiyu: t("compValFree"),
      empresaB: "¥500",
      empresaC: "¥1,000",
    },
    {
      aspect: t("compAspectFreeStorage"),
      aiyu: t("compValUnlimited"),
      empresaB: t("compVal60Days"),
      empresaC: t("compVal45Days"),
    },
    {
      aspect: t("compAspectStorageLimit"),
      aiyu: t("compValNoLimit"),
      empresaB: t("compVal90Days"),
      empresaC: t("compValNoLimitExtra"),
    },
    {
      aspect: t("compAspectPhotos"),
      aiyu: t("compValFree"),
      empresaB: "¥300",
      empresaC: "¥500",
    },
  ];

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle px-4 sm:px-0">
        <div className="border-2 overflow-hidden  rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead
              style={{
                background: "linear-gradient(to right, #367cb1, #2c669a)",
              }}
            >
              <tr>
                <th
                  scope="col"
                  className="py-3 px-3 sm:py-4 sm:px-6 text-left text-white text-xs sm:text-base"
                >
                  {t("comparisonCategory")}
                </th>
                <th
                  scope="col"
                  className="py-3 px-3 sm:py-4 sm:px-6 text-left text-white text-xs sm:text-base"
                  style={{ backgroundColor: "rgba(54, 124, 177, 0.9)" }}
                >
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span
                      className="inline-block px-2 py-1 sm:px-3 sm:py-1.5 bg-white text-[#367cb1] rounded-full text-xs sm:text-sm"
                      style={{ fontWeight: "600" }}
                    >
                      ★ Aiyu Japan
                    </span>
                  </div>
                </th>
                <th
                  scope="col"
                  className="py-3 px-3 sm:py-4 sm:px-6 text-left text-white text-xs sm:text-base"
                >
                  {t("comparisonCompanyB")}
                </th>
                <th
                  scope="col"
                  className="py-3 px-3 sm:py-4 sm:px-6 text-left text-white text-xs sm:text-base"
                >
                  {t("comparisonCompanyC")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {comparisonData.map((row, index) => (
                <tr key={index} className="transition-colors hover:bg-slate-50">
                  <td className="py-3 px-3 sm:py-4 sm:px-6 text-slate-900 text-xs sm:text-base">
                    {row.aspect}
                  </td>
                  <td
                    className="py-3 px-3 sm:py-4 sm:px-6 text-slate-900 text-xs sm:text-base"
                    style={{
                      backgroundColor: "rgba(54, 124, 177, 0.12)",
                      fontWeight: "500",
                    }}
                  >
                    {row.aiyu}
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6 text-slate-700 text-xs sm:text-base">
                    {row.empresaB}
                  </td>
                  <td className="py-3 px-3 sm:py-4 sm:px-6 text-slate-700 text-xs sm:text-base">
                    {row.empresaC}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
