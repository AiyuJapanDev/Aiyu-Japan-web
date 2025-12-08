import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/contexts/AppContext";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import {
  ALL_COUNTRIES,
  calculateShippingCostByCountry,
  getWeightRange,
  getZoneForCountry,
  isDHLOnlyCountry,
  useAnimatedNumber,
} from "@/lib/shippingUtils";
import { useEffect, useState } from "react";

const ShippingCalculator = () => {
  const { t } = useApp();
  const { convertCurrency, loading: ratesLoading } = useCurrencyRates();
  const { settings: systemSettings, loading: settingsLoading } =
    useSystemSettings();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [shippingMethod, setShippingMethod] = useState<
    "economic" | "express" | "paraguay" | "dhl"
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

  // Automatically switch shipping method if Paraguay is selected
  useEffect(() => {
    if (selectedCountry === "Paraguay") {
      setShippingMethod("paraguay");
    } else if (shippingMethod === "paraguay") {
      // If user switches away from Paraguay, reset to economic
      setShippingMethod("economic");
    }
  }, [selectedCountry]);

  // Automatically switch to DHL for DHL-only countries
  useEffect(() => {
    if (isDHLOnly && shippingMethod !== "dhl") {
      setShippingMethod("dhl");
    }
  }, [isDHLOnly, shippingMethod]);

  const isParaguay = selectedCountry === "Paraguay";

  const availableMethods =
    selectedCountry === "Paraguay"
      ? [{ value: "paraguay", label: "Paraguay Shipping" }]
      : isDHLOnly
        ? [{ value: "dhl", label: t("dhlShipping") }]
        : [
            { value: "economic", label: t("economicShipping") },
            { value: "express", label: t("expressShippingMethod") },
            { value: "dhl", label: t("dhlShipping") },
          ];

  useEffect(() => {
    if (selectedCountry && !ratesLoading && !settingsLoading) {
      const dimensions =
        (shippingMethod === "dhl" || shippingMethod === "paraguay") &&
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
        // Always return number (total only)
        let totalCost = typeof cost === "number" ? cost : cost.total;

        // Add handling fee and tax for DHL method (same as purchase calculator)
        if (shippingMethod === "dhl") {
          const handlingFee = 500;
          const tax = (totalCost + handlingFee) * 0.1;
          totalCost = totalCost + handlingFee + tax;
        }

        setShippingResults({
          shippingCost: totalCost,
          usd: convertCurrency(totalCost, "usd"),
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
    <Card className="rounded-3xl p-8 bg-white/90 backdrop-blur-sm shadow-lg border-2 border-white/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 font-heading text-xl text-gray-800 leading-tight flex-wrap">
          <span className="whitespace-normal break-words">
            {t("shippingCalculator")}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full rounded-full px-3 py-2 text-sm border-2 border-capybara-orange/20 focus:border-capybara-orange transition-all duration-300 font-body">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2 border-capybara-orange/20 max-h-[300px]">
              {ALL_COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  <div className="text-left leading-tight">{country}</div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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

        <div className="space-y-2">
          <Label className="font-body text-sm text-gray-700">
            {t("shippingMethods")}
          </Label>
          <p className="text-xs text-gray-500">{t("chooseShippingMethod")}</p>

          <RadioGroup
            value={shippingMethod}
            onValueChange={(v) =>
              setShippingMethod(
                v as "economic" | "express" | "paraguay" | "dhl"
              )
            }
            className="space-y-2 mt-2"
          >
            {availableMethods.map((method) => (
              <div
                key={method.value}
                className="flex items-center space-x-2 p-2 rounded-full bg-capybara-cream transition-colors"
              >
                <RadioGroupItem
                  value={method.value}
                  id={method.value}
                  className="w-3 h-3"
                />
                <Label
                  htmlFor={method.value}
                  className="flex-1 font-body cursor-pointer text-xs"
                >
                  <span className="font-semibold">{method.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {(shippingMethod === "dhl" || shippingMethod === "paraguay") && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="font-body text-sm text-gray-700">
                {t("dimensionsLabel")}
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="length" className="text-xs">
                    {t("lengthLabel")}
                  </Label>
                  <Input
                    id="length"
                    type="number"
                    min="1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="L"
                    className="rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange"
                  />
                </div>
                <div>
                  <Label htmlFor="width" className="text-xs">
                    {t("widthLabel")}
                  </Label>
                  <Input
                    id="width"
                    type="number"
                    min="1"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="W"
                    className="rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange"
                  />
                </div>
                <div>
                  <Label htmlFor="height" className="text-xs">
                    {t("heightLabel")}
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="H"
                    className="rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label className="font-body text-sm text-gray-700">
            {t("selectWeight")}
          </Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min={weightRange.min}
              max={weightRange.max}
              step={shippingMethod === "paraguay" ? 200 : 50}
              defaultValue={weight[0]}
              key={`weight-${weight[0]}`}
              onBlur={(e) => {
                // Validate and update state when user finishes typing
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
              className="w-32"
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              g
            </span>
            <Slider
              value={weight}
              onValueChange={setWeight}
              min={weightRange.min}
              max={weightRange.max}
              step={shippingMethod === "paraguay" ? 200 : 50}
              className="flex-1"
            />
          </div>

          <div className="flex justify-end text-xs text-gray-600 font-body">
            <span>{weightRange.max.toLocaleString()}g</span>
          </div>
        </div>

        {shippingResults && (
          <div className="space-y-3 mt-4 animate-fade-in animate-scale-in">
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
                src="KapyPlane.png"
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
