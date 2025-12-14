import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Language, translations, TranslationKey } from "@/lib/i18n";
import { useNavigate, Navigate, redirectDocument } from "react-router";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: "JPY" | "USD" | "EUR";
  setCurrency: (curr: "JPY" | "USD" | "EUR") => void;
  t: (key: TranslationKey) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [currency, setCurrency] = useState<"JPY" | "USD" | "EUR">("JPY");

  const navigate = useNavigate();

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  // Set language to user browser language
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userLang = navigator.language.split("-")[0] as Language;
      // Check if the detected user language is one of the supported languages
      if (Object.keys(translations).includes(userLang)) {
        setLanguage(userLang);
      }
    }
  }, []);

  /* Navigate to blog and news pages in current lang */
  useEffect(() => {
    if (window.location.pathname.includes("/blog")) {
      navigate("/blog/" + language);
    }
    if (window.location.pathname.includes("/news")) {
      navigate("/news/" + language);
    }
  }, [language]);

  return (
    <AppContext.Provider
      value={{ language, setLanguage, currency, setCurrency, t }}
    >
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
