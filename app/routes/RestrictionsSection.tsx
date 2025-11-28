import { useApp } from "@/contexts/AppContext";
import { AlertTriangle, Ban, HelpCircle, Info } from "lucide-react";

export const RestrictionsSection = () => {
  const { t } = useApp();

  const prohibitedItems = [
    t("restrictionsProhibited1"),
    t("restrictionsProhibited2"),
    t("restrictionsProhibited3"),
    t("restrictionsProhibited4"),
    t("restrictionsProhibited5"),
    t("restrictionsProhibited6"),
    t("restrictionsProhibited7"),
    t("restrictionsProhibited8"),
  ];

  const restrictedItems = [
    {
      category: t("restrictionsRestricted1Cat"),
      description: t("restrictionsRestricted1Desc"),
    },
    {
      category: t("restrictionsRestricted2Cat"),
      description: t("restrictionsRestricted2Desc"),
    },
    {
      category: t("restrictionsRestricted3Cat"),
      description: t("restrictionsRestricted3Desc"),
    },
    {
      category: t("restrictionsRestricted4Cat"),
      description: t("restrictionsRestricted4Desc"),
    },
  ];

  const importantNotes = [
    t("restrictionsNote1"),
    t("restrictionsNote2"),
    t("restrictionsNote3"),
    t("restrictionsNote4"),
    t("restrictionsNote5"),
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("restrictionsTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {t("restrictionsSubtitle")}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="mb-12 overflow-hidden rounded-3xl bg-blue-50">
              <div className="bg-blue-600 px-8 py-6 text-white">
                <div className="flex items-center gap-4">
                  <Ban className="h-8 w-8" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {t("restrictionsProhibitedTitle")}
                    </h3>
                    <p className="text-blue-100">
                      {t("restrictionsProhibitedDesc")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {prohibitedItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-8">
              <div className="mb-6 flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div>
                  <h3 className="text-xl font-bold text-yellow-900">
                    {t("restrictionsRestrictedTitle")}
                  </h3>
                  <p className="text-yellow-700">
                    {t("restrictionsRestrictedDesc")}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {restrictedItems.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-white/50 p-4 transition-colors hover:bg-white"
                  >
                    <h4 className="font-bold text-gray-900">{item.category}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl bg-gray-50 p-8">
              <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-gray-900">
                <Info className="h-6 w-6 text-blue-600" />
                {t("restrictionsNotesTitle")}
              </h3>
              <ul className="space-y-4">
                {importantNotes.map((note, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{note}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-blue-600 p-8 text-white shadow-xl">
              <div className="mb-6 flex items-start gap-4">
                <div className="rounded-full bg-white/20 p-3">
                  <HelpCircle className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold">
                    {t("restrictionsDoubtsTitle")}
                  </h3>
                  <p className="text-blue-100">{t("restrictionsDoubtsDesc")}</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <button className="flex-1 rounded-xl bg-white py-3 font-bold text-blue-600 transition-colors hover:bg-blue-50">
                  {t("marketsContactSupport")}
                </button>
                <button className="flex-1 rounded-xl border-2 border-white/30 py-3 font-bold text-white transition-colors hover:bg-white/10">
                  {t("restrictionsViewFAQ")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestrictionsSection;
