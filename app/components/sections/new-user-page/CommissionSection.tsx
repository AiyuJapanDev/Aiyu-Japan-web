import { useApp } from "@/contexts/AppContext";
import { CheckCircle, HelpCircle } from "lucide-react";

export const CommissionSection = () => {
  const { t } = useApp();

  const commissionSteps = [
    {
      title: t("commissionStep1Title"),
      description: t("commissionStep1Desc"),
    },
    {
      title: t("commissionStep2Title"),
      description: t("commissionStep2Desc"),
    },
    {
      title: t("commissionStep3Title"),
      description: t("commissionStep3Desc"),
    },
    {
      title: t("commissionStep4Title"),
      description: t("commissionStep4Desc"),
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("commissionTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {t("commissionSubtitle")}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="space-y-8">
              {commissionSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 rounded-2xl bg-gray-50 p-8">
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                {t("commissionWhenToUseTitle")}
              </h3>
              <ul className="space-y-3">
                {[
                  t("commissionUse1"),
                  t("commissionUse2"),
                  t("commissionUse3"),
                  t("commissionUse4"),
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 to-pink-600 p-8 text-white shadow-2xl md:p-12">
              <div className="relative z-10">
                <h3 className="mb-6 text-2xl font-bold">
                  {t("commissionFeesTitle")}
                </h3>
                <div className="mb-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/20 pb-4">
                    <span className="text-lg font-medium text-white/90">
                      {t("commissionBaseFee")}
                    </span>
                    <span className="text-3xl font-bold">¥300</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/20 pb-4">
                    <span className="text-lg font-medium text-white/90">
                      {t("commissionPerRequest")}
                    </span>
                    <span className="text-3xl font-bold">¥500</span>
                  </div>
                </div>
                <div className="mb-8 flex gap-3 rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                  <HelpCircle className="h-6 w-6 flex-shrink-0" />
                  <p className="text-sm text-white/90">
                    {t("commissionFeeNote")}
                  </p>
                </div>
                <button className="w-full rounded-xl bg-white py-4 text-lg font-bold text-blue-600 shadow-lg transition-transform hover:scale-105 hover:bg-gray-50">
                  {t("commissionCTA")}
                </button>
              </div>

              {/* Decorative circles */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
