import { useApp } from "@/contexts/AppContext";
import {
  Box,
  Check,
  CreditCard,
  Info,
  PersonStanding,
  Plane,
  ShoppingBag,
  User2,
} from "lucide-react";

export const FeesSection = () => {
  const { t } = useApp();

  const serviceFees = [
    {
      title: t("feeServiceTitle"),
      price: t("feeServicePrice"),
      description: t("feeServiceDesc"),
      icon: <CreditCard className="h-6 w-6 text-blue-600" />,
      note: t("feeServiceNote"),
    },
    {
      title: t("feeStorageTitle"),
      price: t("feeStoragePrice"),
      description: t("feeStorageDesc"),
      icon: <Box className="h-6 w-6 text-green-600" />,
      note: t("feeStorageNote"),
    },
    {
      title: t("feeShippingTitle"),
      price: t("feeShippingPrice"),
      description: t("feeShippingDesc"),
      icon: <Plane className="h-6 w-6 text-purple-600" />,
      note: t("feeShippingNote"),
    },
  ];

  const newServices = [
    {
      title: t("onSiteOsakaShoppingTitle"),
      description: t("onSiteOsakaShoppingDesc"),
      icon: <ShoppingBag className="h-6 w-6 text-blue-600" />,
    },
    {
      title: t("shoppingLimitPerPersonTitle"),
      description: t("shoppingLimitPerPersonDesc"),
      icon: <User2 className="h-6 w-6 text-green-600" />,
    },
  ];

  const shippingOptions = [
    {
      method: t("feesOptionAirmail"),
      time: t("feesTimeWeeks"),
      tracking: t("feesTrackingBasic"),
      price: t("feesPriceEconomy"),
    },
    {
      method: t("feesOptionEMS"),
      time: t("feesTimeDays3_7"),
      tracking: t("feesTrackingFull"),
      price: t("feesPriceStandard"),
    },
    {
      method: t("feesOptionDHL"),
      time: t("feesTimeDays2_5"),
      tracking: t("feesTrackingFull"),
      price: t("feesPricePremium"),
    },
  ];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("feesTitle")}
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            {t("feesSubtitle")}
          </p>
        </div>

        <div className="mb-4 grid gap-8 md:grid-cols-3">
          {serviceFees.map((fee, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
                {fee.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {fee.title}
              </h3>
              <div className="mb-4 text-3xl font-bold text-blue-600">
                {fee.price}
              </div>
              <p className="mb-4 text-gray-600">{fee.description}</p>
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <Check className="h-4 w-4" />
                {fee.note}
              </div>
            </div>
          ))}
        </div>
        <div className="mb-20 flex gap-8 justify-center">
          {newServices.map((fee, index) => (
            <div
              key={index}
              className="flex-1 relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-8 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50">
                {fee.icon}
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                {fee.title}
              </h3>
              <p className="mb-4 text-gray-600">{fee.description}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl bg-gray-50 shadow-inner">
          <div className="p-8 md:p-12">
            <h3 className="mb-8 text-2xl font-bold text-gray-900">
              {t("feesShippingOptionsTitle")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                    <th className="pb-4 font-medium">
                      {t("feesMethodHeader")}
                    </th>
                    <th className="pb-4 font-medium">{t("feesTimeHeader")}</th>
                    <th className="pb-4 font-medium">
                      {t("feesTrackingHeader")}
                    </th>
                    <th className="pb-4 font-medium">{t("feesPriceHeader")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shippingOptions.map((option, index) => (
                    <tr key={index} className="group">
                      <td className="py-4 font-medium text-gray-900">
                        {option.method}
                      </td>
                      <td className="py-4 text-gray-600">{option.time}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            option.tracking === t("feesTrackingFull")
                              ? "bg-green-100 text-green-800"
                              : option.tracking === t("feesTrackingBasic")
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {option.tracking}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-gray-900">
                        {option.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-gray-50 shadow-inner">
          <div className="p-8 md:p-12">
            <h3 className="mb-8 text-2xl font-bold text-gray-900">
              {t("feesShippingOptionsTitleSpecial")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                    <th className="pb-4 font-medium">
                      {t("feesMethodHeader")}
                    </th>
                    <th className="pb-4 font-medium">{t("feesTimeHeader")}</th>
                    <th className="pb-4 font-medium">
                      {t("feesTrackingHeader")}
                    </th>
                    <th className="pb-4 font-medium">{t("feesPriceHeader")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="group">
                    <td className="py-4 font-medium text-gray-900">
                      {t("feesOptionAiyuJapanExpress")}
                    </td>
                    <td className="py-4 text-gray-600">
                      {t("feesTimeDays14")}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800`}
                      >
                        {t("feesTrackingContactSupport")}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-gray-900">
                      {t("feesPriceAiyuJapanExpress")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-blue-50 p-6 md:p-8">
          <div className="flex flex-col items-start gap-4 md:flex-row">
            <div className="flex-shrink-0 rounded-full bg-blue-100 p-3 text-blue-600">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h4 className="mb-2 text-lg font-bold text-blue-900">
                {t("feesConsolidationTitle")}
              </h4>
              <p className="text-blue-800">{t("feesConsolidationDesc")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeesSection;
