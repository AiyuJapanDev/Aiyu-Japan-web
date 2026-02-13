import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Copy, MapPin } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

interface JapaneseAddressCardProps {
  userId?: string;
  username?: string;
}

const JapaneseAddressCard: React.FC<JapaneseAddressCardProps> = ({
  userId,
  username,
}) => {
  const [isRomaji, setIsRomaji] = useState(false);
  const [fadeKey, setFadeKey] = useState(0);
  const { t } = useApp();

  const handleCopy = (label: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    toast({
      title: t("japaneseAddresstoastCopied"),
      description: `${label}: ${value}`,
    });
  };

  const handleToggle = (checked: boolean) => {
    setIsRomaji(checked);
    setFadeKey((prev) => prev + 1);
  };

  const japaneseData = {
    username: username || "",
    prefecture: "大阪府大阪市淀川区",
    street: "西中島 6丁目2-3",
    building: `チサン第7-903号室 (${userId})`,
    postal: "〒532-0011",
    phone: "090-7238-0062",
  };

  const romajiData = {
    username: username || "",
    prefecture: "Osaka, Osaka-shi Yodogawa-ku",
    street: "Nishinakajima 6-2-3",
    building: `Chisun 7th #903 (${userId})`,
    postal: "532-0011",
    phone: "090-7238-0062",
  };

  const data = isRomaji ? romajiData : japaneseData;

  return (
    <Card className="max-w-4xl border border-gray-200 shadow-sm mt-5">
      <CardHeader className="flex flex-col items-start text-left space-y-3">
        {/* Title */}
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-capybara-orange" />
          <CardTitle>{t("japaneseAddresstitle")}</CardTitle>
        </div>

        {/* User Code Pill */}
        {userId && (
          <div className="flex justify-center w-full">
            <button
              onClick={() => handleCopy("User ID", userId)}
              className="flex items-center gap-2 bg-capybara-orange text-black font-mono px-4 py-2 rounded-full text-sm hover:opacity-90 transition"
            >
              <span>{userId}</span>
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center w-full">
          {t("japaneseAddressuserCodeNote")}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Toggle */}
        <div className="flex justify-center items-center gap-4">
          <Label
            className={`text-sm transition-colors duration-300 ${
              !isRomaji
                ? "text-capybara-orange font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {t("japaneseAddresstoggleJapanese")}
          </Label>

          <Switch
            checked={isRomaji}
            onCheckedChange={handleToggle}
            className="transition-colors duration-300 data-[state=checked]:bg-capybara-orange"
          />

          <Label
            className={`text-sm transition-colors duration-300 ${
              isRomaji
                ? "text-capybara-orange font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {t("japaneseAddresstoggleRomaji")}
          </Label>
        </div>

        {/* Address Display (with fade) */}
        <div
          key={fadeKey}
          className="border rounded-lg divide-y text-sm transition-opacity duration-500 opacity-100 animate-fade-in"
        >
          {[
            { label: t("japaneseAddresslabelsname"), value: data.username },
            {
              label: t("japaneseAddresslabelsprefectureCity"),
              value: data.prefecture,
            },
            { label: t("japaneseAddresslabelsstreet"), value: data.street },
            { label: t("japaneseAddresslabelsbuilding"), value: data.building },
            { label: t("japaneseAddresslabelspostalCode"), value: data.postal },
            { label: t("japaneseAddresslabelsphone"), value: data.phone },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center p-3 hover:bg-muted/40 transition-colors cursor-pointer group"
              onClick={() => handleCopy(item.label, item.value)}
            >
              <div className="flex items-center gap-1 font-medium text-gray-800">
                {item.label}
                <Copy className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <span>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p>{t("japaneseAddressexplanation")}</p>
        </div>

        {/* Warnings */}
        <div className="border-t pt-3 text-sm text-muted-foreground">
          <p className="font-semibold text-blue-600 mb-1">
            {t("japaneseAddresswarningsTitle")}
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t("japaneseAddresswarnings0")}</li>
            <li>{t("japaneseAddresswarnings2")}</li>
          </ul>
        </div>

        {/* Rules */}
        <div className="border-t pt-3 text-sm text-muted-foreground leading-relaxed space-y-2">
          <p className="font-semibold text-blue-600 mb-1">
            {t("japaneseAddressrulesTitle")}
          </p>

          <p>{t("japaneseAddressrulesIntro")}</p>

          <ul className="list-disc pl-5 space-y-1">
            <li>{t("japaneseAddressrules0")}</li>
            <li>{t("japaneseAddressrules1")}</li>
            <li>{t("japaneseAddressrules2")}</li>
            <li>{t("japaneseAddressrules3")}</li>
          </ul>

          <p className="mt-3">{t("japaneseAddressrulesBottom")}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JapaneseAddressCard;
