import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ShoppingCart, ChevronDown, Check } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";

const PurchaseCalculator = () => {
  const { t } = useApp();
  const { convertCurrency, loading: ratesLoading } = useCurrencyRates();
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [purchaseResults, setPurchaseResults] = useState(null);
  const [isBenefitsOpen, setIsBenefitsOpen] = useState(false);

  // Purchase Calculator Logic
  useEffect(() => {
    const amount = parseFloat(purchaseAmount);
    if (amount && !ratesLoading) {
      const serviceFee = 500;
      const tax = (serviceFee + amount) * 0.039;
      const total = amount + serviceFee + tax;

      setPurchaseResults({
        productCost: amount,
        serviceFee,
        tax,
        total,
        usd: convertCurrency(total, "usd"),
        mxn: convertCurrency(total, "mxn"),
        clp: convertCurrency(total, "clp"),
      });
    } else {
      setPurchaseResults(null);
    }
  }, [purchaseAmount, ratesLoading, convertCurrency]);

  return (
    <Card className="rounded-3xl p-8 bg-white shadow-xl border-2 border-capybara-orange/30">
      <CardHeader className="pb-6 border-b-2 border-capybara-yellow/40">
        <CardTitle className="flex items-center gap-3 font-heading text-2xl text-gray-900">
          {t("purchaseCalculator")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <label className="font-body text-sm font-semibold text-gray-700">
            {t("enterPriceInYen")}
          </label>
          <Input
            type="number"
            placeholder="¥100"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            className="w-full rounded-xl px-4 py-3 border-2 border-capybara-orange/40 focus:border-capybara-orange transition-all duration-300 font-body shadow-sm bg-white text-base"
          />
        </div>

        {purchaseResults && (
          <div className="space-y-3 mt-4 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-4 transition-all duration-500">
              <div className="text-2xl font-bold text-center">
                ¥{purchaseResults.total.toLocaleString()}
              </div>
              <p className="text-gray-300 text-sm text-center">
                {t("quotedPrice")}
              </p>
            </div>

            <div className="space-y-2">
              <Collapsible
                open={isBenefitsOpen}
                onOpenChange={setIsBenefitsOpen}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex justify-between items-center py-2 px-3 bg-capybara-yellow rounded-full text-sm hover:bg-capybara-yellow/80 transition-colors cursor-pointer group">
                    <span className="font-body text-gray-700 flex items-center gap-2">
                      👉 {t("serviceFeeLabel")} — {t("viewBenefits")}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isBenefitsOpen ? "rotate-180" : ""}`}
                      />
                    </span>
                    <span className="font-heading font-bold text-gray-800">
                      {purchaseResults.serviceFee.toLocaleString()} yen
                    </span>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 p-3 bg-capybara-cream/50 rounded-xl text-sm space-y-2">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {t("handlingFeeBenefitConsolidation")}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {t("handlingFeeBenefitStorage")}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {t("handlingFeeBenefitPhotos")}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {t("handlingFeeBenefitPackaging")}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-capybara-orange mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">
                        {t("handlingFeeBenefitSupport")}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-capybara-orange/20 mt-3">
                      <p className="text-xs text-gray-600 font-medium">
                        🧾 {t("noHiddenFees")}
                      </p>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <div className="flex justify-between items-center py-2 px-3 bg-capybara-cream rounded-full text-sm">
                <span className="font-body text-gray-700">
                  {t("handlingFee")}
                </span>
                <span className="font-heading font-bold text-gray-800">
                  {Math.round(purchaseResults.tax).toLocaleString()} yen
                </span>
              </div>
              {/* t('serviceFeeLabel') */}

              <div className="border-t-2 border-capybara-orange pt-2 space-y-2">
                <div
                  className="flex justify-between items-center py-2 px-3 rounded-full text-sm"
                  style={{ backgroundColor: "#c8effaff" }}
                >
                  <span className="font-body text-gray-700">USD</span>
                  <span className="font-heading font-bold text-gray-800">
                    ${purchaseResults.usd}
                  </span>
                </div>

                <div
                  className="flex justify-between items-center py-2 px-3 rounded-full text-sm hidden"
                  style={{ backgroundColor: "#c8effaff" }}
                >
                  <span className="font-body text-gray-700">CLP</span>
                  <span className="font-heading font-bold text-gray-800">
                    {purchaseResults.clp}
                  </span>
                </div>

                <div
                  className="flex justify-between items-center py-2 px-3 rounded-full text-sm hidden"
                  style={{ backgroundColor: "#c8effaff" }}
                >
                  <span className="font-body text-gray-700">MXN</span>
                  <span className="font-heading font-bold text-gray-800">
                    {purchaseResults.mxn}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!purchaseResults && (
          <div className="text-center py-8">
            <div className="mb-4">
              <img
                src="/KapyCalculator.png"
                alt="Capybara Calculator"
                className="w-28 h-36 mx-auto mb-2"
              />
            </div>
            <p className="font-body text-gray-600 text-sm">
              {t("enterPriceToCalculate")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PurchaseCalculator;
