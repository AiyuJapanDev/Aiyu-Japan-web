import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { CountrySelect } from "@/components/ui/country-select";
import { useApp } from "@/contexts/AppContext";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import {
  ALL_COUNTRIES,
  calculateShippingCostByCountry,
  getWeightRange,
  getZoneForCountry,
  isDHLOnlyCountry,
  hasExpressShipping,
  useAnimatedNumber,
  PERU_MARITIME_SHIPPING,
} from "@/lib/shippingUtils";
import { useEffect, useState } from "react";

const ShippingCalculator = () => {
  const { t } = useApp();
  const { convertCurrency, loading: ratesLoading } = useCurrencyRates();
  const { settings: systemSettings, loading: settingsLoading } =
    useSystemSettings();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [shippingMethod, setShippingMethod] = useState<
    "economic" | "express" | "paraguay" | "paraguay-maritime" | "peru-maritime" | "dhl"
  >("economic");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  const [weight, setWeight] = useState([500]);
  const [shippingResults, setShippingResults] = useState<{
    shippingCost: number;
    usd: string;
    mxn: string;
    clp: string;
  } | null>(null);

  const weightRange = getWeightRange(shippingMethod);
  const zoneInfo = selectedCountry ? getZoneForCountry(selectedCountry) : null;
  const isDHLOnly = selectedCountry ? isDHLOnlyCountry(selectedCountry) : false;

  useEffect(() => {
    if (selectedCountry === "Paraguay") {
      setShippingMethod("paraguay");
    } else if (shippingMethod === "paraguay" || shippingMethod === "paraguay-maritime") {
      setShippingMethod("economic");
    } else if (shippingMethod === "peru-maritime" && selectedCountry !== "Peru") {
      setShippingMethod("economic");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (isDHLOnly && shippingMethod !== "dhl") {
      setShippingMethod("dhl");
    }
  }, [isDHLOnly, shippingMethod]);

  useEffect(() => {
    if (shippingMethod === "express" && selectedCountry && !hasExpressShipping(selectedCountry)) {
      setShippingMethod("economic");
    }
  }, [selectedCountry, shippingMethod]);

  const isParaguay = selectedCountry === "Paraguay";
  const isPeru = selectedCountry === "Peru";
  const hasExpress = selectedCountry ? hasExpressShipping(selectedCountry) : false;

  const availableMethods =
    selectedCountry === "Paraguay"
      ? [
          { value: "paraguay", label: t("paraguayShippingLabel") },
          { value: "paraguay-maritime", label: t("paraguayMaritimeShippingLabel") }
        ]
      : selectedCountry === "Peru"
        ? [
            { value: "economic", label: t("economicShipping") },
            ...(hasExpress ? [{ value: "express", label: t("expressShippingMethod") }] : []),
            { value: "dhl", label: t("dhlShipping") },
            { value: "peru-maritime", label: t("peruMaritimeShippingLabel") }
          ]
        : isDHLOnly
          ? [{ value: "dhl", label: t("dhlShipping") }]
          : [
              { value: "economic", label: t("economicShipping") },
              ...(hasExpress ? [{ value: "express", label: t("expressShippingMethod") }] : []),
              { value: "dhl", label: t("dhlShipping") },
            ];

useEffect(() => {
    if (selectedCountry && !ratesLoading && !settingsLoading) {
      const dimensions =
        (shippingMethod === "dhl" || shippingMethod === "paraguay" || shippingMethod === "paraguay-maritime") &&
        length &&
        width &&
        height
          ? { L: Number(length), W: Number(width), H: Number(height) }
          : undefined;

      const cost = calculateShippingCostByCountry(
        selectedCountry,
        shippingMethod,
        weight[0],
        dimensions,
        shippingMethod === "dhl" ? systemSettings.dhlFuelPercentage : undefined
      );

      if (cost) {
        let totalCost = typeof cost === "number" ? cost : cost.total;

        // Costos adicionales específicos de DHL
        if (shippingMethod === "dhl") {
          const handlingFee = 500;
          const tax = (totalCost + handlingFee) * 0.1;
          totalCost = totalCost + handlingFee + tax;
        }

        let usdPrice: string;

        // --- INICIO LÓGICA DE PRECIOS EN USD ---

        // 1. Paraguay Marítimo: Forzar $12 USD por KG con saltos de 200g
        if (shippingMethod === "paraguay-maritime") {
          const step = 200;
          const minWeight = 1000;
          const maxWeight = 30000;
          
          // Aplicamos redondeo para la visualización en USD
          const clampedWeight = Math.max(minWeight, Math.min(maxWeight, weight[0]));
          const roundedWeight = Math.ceil(clampedWeight / step) * step;
          
          // Cálculo directo: (Gramos / 1000) * 12 USD
          const finalUsd = (roundedWeight / 1000) * 12;
          usdPrice = finalUsd.toFixed(2);
        } 
        // 2. Perú Marítimo: Usar tabla de precios definida
        else if (shippingMethod === "peru-maritime") {
          const weightInKg = Math.ceil(weight[0] / 1000);
          const priceEntry = PERU_MARITIME_SHIPPING.priceTable.find(
            (entry) => entry.kg === weightInKg
          );
          usdPrice = priceEntry ? priceEntry.usd.toFixed(2) : convertCurrency(totalCost, "usd");
        } 
        // 3. Otros métodos: Conversión estándar basada en Yenes
        else {
          usdPrice = convertCurrency(totalCost, "usd");
        }

        // --- FIN LÓGICA DE PRECIOS EN USD ---

        setShippingResults({
          shippingCost: totalCost,
          usd: usdPrice,
          mxn: convertCurrency(totalCost, "mxn"),
          clp: convertCurrency(totalCost, "clp"),
        });
      } else {
        setShippingResults(null);
      }
    } else {
      setShippingResults(null);
    }
  }, [
    selectedCountry,
    shippingMethod,
    weight,
    length,
    width,
    height,
    systemSettings,
    ratesLoading,
    settingsLoading,
    convertCurrency,
  ]);

  useEffect(() => {
    setWeight([weightRange.min]);
  }, [shippingMethod, weightRange.min]);

  const animatedTotal = useAnimatedNumber(
    shippingResults?.shippingCost || 0,
    1000
  );

  return (
    <Card className="rounded-3xl p-8 bg-white shadow-xl border-2 border-capybara-orange/30">
      <CardHeader className="pb-6 border-b-2 border-capybara-yellow/40">
        <CardTitle className="flex items-center gap-3 font-heading text-2xl text-gray-900 leading-tight flex-wrap">
          <span className="whitespace-normal break-words">
            {t("shippingCalculator")}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label className="font-body text-sm font-semibold text-gray-700">
            {t("destination")}
          </Label>
          <CountrySelect
            countries={ALL_COUNTRIES}
            value={selectedCountry}
            onValueChange={setSelectedCountry}
            placeholder="Select Country"
          />
          {zoneInfo && !isDHLOnly && (
            <p className="text-xs text-gray-600 font-body text-center">
              Zone {zoneInfo.zone}: {zoneInfo.name}
            </p>
          )}
          {isDHLOnly && (
            <p className="text-xs text-gray-600 font-body text-center">
              DHL Shipping Only
            </p>
          )}
          {!zoneInfo && !isDHLOnly && (
            <p className="text-xs text-gray-600 font-body text-center">
              Select a country
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="font-body text-sm font-semibold text-gray-700">
            {t("shippingMethods")}
          </Label>
          <p className="text-xs text-gray-600">{t("chooseShippingMethod")}</p>

          <RadioGroup
            value={shippingMethod}
            onValueChange={(v) =>
              setShippingMethod(
                v as "economic" | "express" | "paraguay" | "paraguay-maritime" | "peru-maritime" | "dhl"
              )
            }
            className="space-y-2 mt-2"
          >
            {availableMethods.map((method) => (
              <div
                key={method.value}
                className={`flex items-center space-x-3 p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                  shippingMethod === method.value
                    ? "bg-capybara-yellow border-capybara-orange shadow-md"
                    : "bg-white border-gray-200 hover:border-capybara-orange/50 hover:bg-capybara-cream/30"
                }`}
              >
                <RadioGroupItem
                  value={method.value}
                  id={method.value}
                  className="w-4 h-4"
                />
                <Label
                  htmlFor={method.value}
                  className="flex-1 font-body cursor-pointer text-sm"
                >
                  <span className="font-semibold text-gray-800">{method.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {(shippingMethod === "dhl" || shippingMethod === "paraguay" || shippingMethod === "paraguay-maritime" || shippingMethod === "peru-maritime") && (
          <div className="space-y-4 p-4 bg-capybara-cream/30 rounded-2xl border-2 border-capybara-yellow/40">
            <div className="space-y-3">
              <Label className="font-body text-sm font-semibold text-gray-700">
                {t("dimensionsLabel")}
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="length" className="text-xs font-medium text-gray-700">
                    {t("lengthLabel")}
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    min="1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="L"
                    className="rounded-xl border-2 border-capybara-orange/40 focus:border-capybara-orange shadow-sm bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="width" className="text-xs font-medium text-gray-700">
                    {t("widthLabel")}
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="W"
                    className="rounded-xl border-2 border-capybara-orange/40 focus:border-capybara-orange shadow-sm bg-white"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs font-medium text-gray-700">
                    {t("heightLabel")}
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="H"
                    className="rounded-xl border-2 border-capybara-orange/40 focus:border-capybara-orange shadow-sm bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Label className="font-body text-sm font-semibold text-gray-700">
            {t("selectWeight")}
          </Label>
          <div className="p-4 bg-capybara-cream/30 rounded-2xl border-2 border-capybara-yellow/40">
            <div className="flex items-center gap-4 mb-3">
              <Input
                type="number"
                min={weightRange.min}
                max={weightRange.max}
                step={shippingMethod === "paraguay" ? 100 : shippingMethod === "paraguay-maritime" ? 200 : shippingMethod === "peru-maritime" ? 1000 : 50}
                defaultValue={weight[0]}
                key={`weight-${weight[0]}`}
                onBlur={(e) => {
                  const value = e.target.value.trim();
                  if (value === "" || isNaN(Number(value))) {
                    setWeight([weightRange.min]);
                    e.target.value = String(weightRange.min);
                  } else {
                    const numValue = Number(value);
                    if (numValue < weightRange.min) {
                      setWeight([weightRange.min]);
                      e.target.value = String(weightRange.min);
                    } else if (numValue > weightRange.max) {
                      setWeight([weightRange.max]);
                      e.target.value = String(weightRange.max);
                    } else {
                      setWeight([numValue]);
                    }
                  }
                }}
                className="w-32 rounded-xl border-2 border-capybara-orange/40 focus:border-capybara-orange shadow-sm bg-white font-semibold"
              />
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                gramos
              </span>
            </div>
            <Slider
              value={weight}
              onValueChange={setWeight}
              min={weightRange.min}
              max={weightRange.max}
              step={
                shippingMethod === "paraguay-maritime" ? 200 : 
                shippingMethod === "paraguay" ? 100 : 
                shippingMethod === "peru-maritime" ? 1000 : 50
              }
              className="flex-1"
            />
            <div className="flex justify-between text-xs text-gray-600 font-body mt-2">
              <span>{weightRange.min.toLocaleString()}g</span>
              <span>{weightRange.max.toLocaleString()}g</span>
            </div>
          </div>
        </div>

        {shippingResults && (
          <div className="space-y-3 mt-4 animate-fade-in">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-2xl p-4 transition-all duration-500">
              <div className="text-2xl font-bold text-center">
                {animatedTotal.toLocaleString()} yen
              </div>
              <p className="text-gray-300 text-sm text-center">
                {t("internationalShippingCost")}
              </p>
            </div>
            <div className="space-y-2">
              <div className="border-t-2 border-capybara-orange pt-2 space-y-2">
                <div className="flex justify-between items-center py-2 px-3 bg-capybara-yellow rounded-full text-sm">
                  <span className="font-body text-gray-700">USD</span>
                  <span className="font-heading font-bold text-gray-800">
                    ${shippingResults.usd}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-capybara-yellow rounded-full text-sm hidden">
                  <span className="font-body text-gray-700">CLP</span>
                  <span className="font-heading font-bold text-gray-800">
                    {shippingResults.clp}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-capybara-yellow rounded-full text-sm hidden">
                  <span className="font-body text-gray-700">MXN</span>
                  <span className="font-heading font-bold text-gray-800">
                    {shippingResults.mxn}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {!shippingResults && (
          <div className="text-center py-8">
            <div className="mb-4">
              <img
                src="/KapyPlane.png"
                alt="Capybara Plane"
                className="w-28 h-36 mx-auto mb-2"
              />
            </div>
            <p className="font-body text-gray-600 text-sm">
              {t("enterDataToCalculate")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShippingCalculator;
