import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Package, MapPin, Phone, User, Truck, Globe, JapaneseYen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  calculateShippingCostByCountry,
  ALL_COUNTRIES,
  getZoneForCountry,
  useAnimatedNumber,
  getWeightRange,
  isDHLOnlyCountry,
  hasExpressShipping,
  PERU_MARITIME_SHIPPING,
} from "@/lib/shippingUtils";
import { useCurrencyRates } from "@/hooks/useCurrencyRates";
import { useSystemSettings } from "@/hooks/useSystemSettings";
import { notifyAllAdmins } from "@/lib/notificationUtils";
import { useApp } from "@/contexts/AppContext";

interface ShippingQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItems: Array<{
    id: string;
    order_id?: string; // Made optional for admin-added items
    product_request: {
      item_name: string;
      quantity: number;
      product_url?: string;
    };
    weight?: number;
  }>;
  totalWeight: number;
  onSuccess?: () => void;
}

const ShippingQuoteDialog: React.FC<ShippingQuoteDialogProps> = ({
  open,
  onOpenChange,
  selectedItems,
  totalWeight,
  onSuccess,
}) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { convertCurrency } = useCurrencyRates();
  const { settings: systemSettings, loading: settingsLoading } =
    useSystemSettings();
  const [loading, setLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [shippingMethod, setShippingMethod] = useState<
    | "economic"
    | "express"
    | "paraguay"
    | "paraguay-maritime"
    | "peru-maritime"
    | "dhl"
  >("economic");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [addressNotes, setAddressNotes] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [taxVatId, setTaxVatId] = useState("");
  const [useCredit, setUseCredit] = useState(false);
  const { t } = useApp();

  const zoneInfo = selectedCountry ? getZoneForCountry(selectedCountry) : null;
  const isDHLOnly = selectedCountry ? isDHLOnlyCountry(selectedCountry) : false;
  const numericWeight = Number(totalWeight) || 0;
  const hasExpress = selectedCountry
    ? hasExpressShipping(selectedCountry)
    : false;

  useEffect(() => {
    if (selectedCountry === "Paraguay") {
      setShippingMethod("paraguay");
    } else if (
      shippingMethod === "paraguay" ||
      shippingMethod === "paraguay-maritime"
    ) {
      setShippingMethod("economic");
    } else if (
      shippingMethod === "peru-maritime" &&
      selectedCountry !== "Peru"
    ) {
      setShippingMethod("economic");
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (isDHLOnly && shippingMethod !== "dhl") {
      setShippingMethod("dhl");
    }
  }, [isDHLOnly, shippingMethod]);

  useEffect(() => {
    if (
      shippingMethod === "express" &&
      selectedCountry &&
      !hasExpressShipping(selectedCountry)
    ) {
      setShippingMethod(numericWeight > 2000 ? "dhl" : "economic");
    }
  }, [selectedCountry, shippingMethod, numericWeight]);

  const availableMethods =
    selectedCountry === "Paraguay"
      ? [
          { value: "paraguay", label: t("paraguayShippingLabel") },
          {
            value: "paraguay-maritime",
            label: t("paraguayMaritimeShippingLabel"),
          },
        ]
      : selectedCountry === "Peru"
        ? isDHLOnly
          ? [{ value: "dhl", label: t("dhlShipping") }]
          : numericWeight > 2000
            ? [
                ...(hasExpress
                  ? [{ value: "express", label: t("expressShippingLabel") }]
                  : []),
                { value: "dhl", label: t("dhlShipping") },
                {
                  value: "peru-maritime",
                  label: t("peruMaritimeShippingLabel"),
                },
              ]
            : [
                { value: "economic", label: t("economicShippingLabel") },
                ...(hasExpress
                  ? [{ value: "express", label: t("expressShippingLabel") }]
                  : []),
                { value: "dhl", label: t("dhlShipping") },
                {
                  value: "peru-maritime",
                  label: t("peruMaritimeShippingLabel"),
                },
              ]
        : isDHLOnly
          ? [{ value: "dhl", label: t("dhlShipping") }]
          : numericWeight > 2000
            ? [
                ...(hasExpress
                  ? [{ value: "express", label: t("expressShippingLabel") }]
                  : []),
                { value: "dhl", label: t("dhlShipping") },
              ]
            : [
                { value: "economic", label: t("economicShippingLabel") },
                ...(hasExpress
                  ? [{ value: "express", label: t("expressShippingLabel") }]
                  : []),
                { value: "dhl", label: t("dhlShipping") },
              ];

  useEffect(() => {
    if (numericWeight > 2000 && shippingMethod === "economic") {
      setShippingMethod("express");
    }
  }, [numericWeight, shippingMethod]);

  const dimensions =
    (shippingMethod === "dhl" ||
      shippingMethod === "paraguay" ||
      shippingMethod === "paraguay-maritime" ||
      shippingMethod === "peru-maritime") &&
    length &&
    width &&
    height
      ? { L: Number(length), W: Number(width), H: Number(height) }
      : undefined;

  const shippingCostResult =
    selectedCountry && !settingsLoading
      ? calculateShippingCostByCountry(
          selectedCountry,
          shippingMethod,
          numericWeight,
          dimensions,
          shippingMethod === "dhl"
            ? systemSettings.dhlFuelPercentage
            : undefined,
        )
      : null;

  const shippingCost = shippingCostResult
    ? typeof shippingCostResult === "number"
      ? shippingCostResult
      : shippingCostResult.total
    : null;

  const animatedCost = useAnimatedNumber(shippingCost || 0, 1000);

  useEffect(() => {
    if (open && profile) {
      setFullName(profile.full_name || "");
      setPhoneNumber(profile.phone_number || "");
      setAddress(profile.address || "");
      setAddressNotes(profile.address_notes || "");
      setSelectedCountry(profile.country || "");
      setPostalCode(profile.postal_code || "");
      setCity(profile.city || "");
      setState(profile.state || "");
      setTaxVatId(profile.tax_vat_Id || "");
      setUseCredit(false);
    }
  }, [open, profile]);

  const userCreditBalance = (profile as any)?.credit_balance ?? 0;
  const hasCredits = userCreditBalance > 0;

  const handleSubmit = async () => {
    if (
      !fullName ||
      !phoneNumber ||
      !address ||
      !selectedCountry ||
      !postalCode ||
      !city ||
      !state
    ) {
      toast({
        title: "Missing Information",
        description: t("missingAddressInfo"),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const shippingAddress: any = {
        full_name: fullName,
        phone_number: phoneNumber,
        address,
        address_notes: addressNotes,
        country: selectedCountry,
        postal_code: postalCode,
        city,
        state,
        ...((shippingMethod === "dhl" ||
          shippingMethod === "paraguay" ||
          shippingMethod === "paraguay-maritime" ||
          shippingMethod === "peru-maritime") &&
        length &&
        width &&
        height
          ? {
              dimensions: {
                length: Number(length),
                width: Number(width),
                height: Number(height),
              },
              ...(shippingMethod === "dhl"
                ? { fuel_percentage: systemSettings.dhlFuelPercentage }
                : {}),
            }
          : {}),
      };
      if (taxVatId) {
        shippingAddress.tax_vat_Id = taxVatId;
      }

      const { error } = await supabase.from("shipping_quotes").insert({
        user_id: profile?.id,
        shipping_method: shippingMethod,
        destination: selectedCountry,
        total_weight: totalWeight,
        estimated_cost: Math.round(shippingCost),
        shipping_address: shippingAddress,
        use_credit_request: useCredit,
        items: selectedItems.map((item) => ({
          order_item_id: item.id,
          order_id: item.order_id || "", // Handle optional order_id
          item_name: item.product_request.item_name,
          quantity: item.product_request.quantity,
          weight: item.weight || 0,
          product_url: item.product_request.product_url,
        })),
      });

      if (error) throw error;

      const { data: quoteData } = await supabase
        .from("shipping_quotes")
        .select("id")
        .eq("user_id", profile?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (quoteData) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("full_name, user_personal_id")
          .eq("id", profile?.id)
          .single();

        const customerName = userProfile?.full_name || "Unknown User";
        const customerId = userProfile?.user_personal_id
          ? `#${userProfile.user_personal_id}`
          : "";

        await notifyAllAdmins(
          "new_shipping_request",
          `New shipping quote request from ${customerName} ${customerId} — ${selectedCountry} (${shippingMethod}). ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""}, ${totalWeight}g total.`,
          quoteData.id,
        );
      }

      toast({
        title: "Shipping Quote Requested",
        description: t("shippingQuoteRequestedSuccess"),
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting shipping quote:", error);
      toast({
        title: "Error",
        description: t("shippingQuoteRequestError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/95 backdrop-blur-sm border-2 border-capybara-yellow shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading flex items-center gap-2 text-gray-800">
            <div className="w-10 h-10 bg-gradient-to-br from-capybara-orange to-capybara-yellow rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            {t("requestShippingQuoteTitle")}
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-body text-sm">
            {t("shippingQuoteDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Selected Items */}
          <Card className="p-4 rounded-2xl bg-capybara-cream border border-capybara-yellow shadow-inner">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">
              <Package className="w-4 h-4 text-capybara-orange" />
              {t("selectedItems")} ({selectedItems.length})
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto text-sm font-body text-gray-700">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.product_request.item_name} ×
                    {item.product_request.quantity}
                  </span>
                  <span className="text-gray-500">{item.weight}g</span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between font-semibold text-gray-800">
              <span>{t("totalWeight")}</span>
              <span>{totalWeight}g</span>
            </div>
          </Card>

          {/* Country & Zone */}
          <div className="space-y-3">
            <Label className="text-base font-semibold mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4 text-capybara-orange" />
              {t("shippingCountry")}
            </Label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="rounded-full border-2 border-capybara-orange/20 focus:border-capybara-orange text-sm px-3 py-2">
                <SelectValue placeholder={t("selectCountryLabel")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2 border-capybara-orange/20 max-h-[300px]">
                {ALL_COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {zoneInfo && !isDHLOnly && (
              <p className="text-xs text-gray-600 text-center">
                Zone {zoneInfo.zone}: {zoneInfo.name}
              </p>
            )}
            {isDHLOnly && (
              <p className="text-xs text-gray-600 text-center">
                {t("dhlOnlyNote")}
              </p>
            )}
          </div>

          {/* Shipping Method */}
          <div className="space-y-2">
            <Label className="font-body text-sm text-gray-700">
              {t("shippingMethod")}
            </Label>
            <RadioGroup
              value={shippingMethod}
              onValueChange={(v) =>
                setShippingMethod(
                  v as
                    | "economic"
                    | "express"
                    | "paraguay"
                    | "paraguay-maritime"
                    | "peru-maritime"
                    | "dhl",
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

          {/* Dimensions (optional for DHL, Paraguay, Paraguay Maritime, Peru Maritime) */}
          {(shippingMethod === "dhl" ||
            shippingMethod === "paraguay" ||
            shippingMethod === "paraguay-maritime" ||
            shippingMethod === "peru-maritime") && (
            <div className="space-y-3">
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

          {/* Estimated Cost */}
          {shippingCost &&
            (() => {
              let usdPrice = convertCurrency(shippingCost, "usd");

            if (shippingMethod === 'paraguay-maritime') {
              const step = 200;
              const minWeight = 1000;
              const clampedWeight = Math.max(minWeight, numericWeight);
              const roundedWeight = Math.ceil(clampedWeight / step) * step;
              
              const finalUsd = (roundedWeight / 1000) * 12;
              usdPrice = finalUsd.toFixed(2);
              }
              else if (shippingMethod === "peru-maritime") {
                const weightInKg = Math.ceil(numericWeight / 1000);
                const priceEntry = PERU_MARITIME_SHIPPING.priceTable.find(
                  (entry) => entry.kg === weightInKg,
                );
                if (priceEntry) {
                  usdPrice = priceEntry.usd.toFixed(2);
                }
              }

              return (
                <Card className="p-4 bg-gradient-to-br bg-gray-700 text-white rounded-2xl">
                    <div className="text-2xl font-bold text-center">
                    {animatedCost.toLocaleString()} {t("yen")}
                    </div>
                  <p className="text-gray-300 text-sm text-center">
                    {t("estimatedInternationalShipping")}
                  </p>
                  <div className="border-t border-gray-200 mt-3 pt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>USD</span>
                      <span>${usdPrice}</span>
                    </div>
                  </div>
                </Card>
              );
            })()}

          {/* Use Credits Section */}
          {hasCredits && (
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm transition-all hover:shadow-md">
              <Checkbox
                id="useCreditsShipping"
                checked={useCredit}
                onCheckedChange={(checked) => setUseCredit(checked === true)}
                className="w-5 h-5 border-2 border-amber-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <div className="grid gap-1.5 leading-none cursor-pointer" onClick={() => setUseCredit(!useCredit)}>
                <label
                  htmlFor="useCreditsShipping"
                  className="text-sm font-semibold text-amber-900 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                >
                  <JapaneseYen className="w-4 h-4 text-amber-600" />
                  {t("useCreditsForShipping")}
                </label>
                <p className="text-xs text-amber-700/80">
                  {t("availableBalance")} <span className="font-bold">{userCreditBalance.toLocaleString('en-US')}</span>
                </p>
              </div>
            </div>
          )}

          {/* Address Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base flex items-center gap-2 text-gray-800">
              <MapPin className="w-4 h-4 text-capybara-orange" />
              {t("shippingAddressLabel")}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">{t("fullName")} *</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t("phoneNumberLabel")} *</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">{t("stateLabel")} *</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">{t("cityLabel")} *</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="postalCode">{t("postalCode")} *</Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="taxVatId">{t("taxVatIdLabel")}</Label>
              <Input
                id="taxVatId"
                value={taxVatId}
                onChange={(e) => setTaxVatId(e.target.value)}
                placeholder={t("taxVatIdPlaceholder")}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">{t("deliveryAddress")} *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
            />
          </div>
          <div>
            <Label htmlFor="addressNotes">{t("deliveryNotes")}</Label>
            <Textarea
              id="addressNotes"
              value={addressNotes}
              onChange={(e) => setAddressNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !shippingCost}>
            {loading ? t("requestingQuote") : t("requestQuote")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingQuoteDialog;
