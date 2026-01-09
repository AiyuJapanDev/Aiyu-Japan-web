import { Language, TranslationKey, translations } from "@/lib/i18n";
import { createContext, ReactNode, useContext, useState } from "react";

interface AppContextType {
  language: Language;
  currency: "JPY" | "USD" | "EUR";
  setCurrency: (curr: "JPY" | "USD" | "EUR") => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({
  children,
  language,
}: {
  children: ReactNode;
  language: Language;
}) => {
  const [currency, setCurrency] = useState<"JPY" | "USD" | "EUR">("JPY");

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <AppContext.Provider value={{ language, currency, setCurrency, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
