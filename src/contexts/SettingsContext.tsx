// src/contexts/SettingsContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Language, TranslationText } from "@/i18n/translations";

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  lowDataMode: boolean;
  toggleLowDataMode: () => void;
  t: (key: keyof TranslationText) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) || "en";
  });
  
  const [lowDataMode, setLowDataMode] = useState<boolean>(() => {
    return localStorage.getItem("lowDataMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("lowDataMode", String(lowDataMode));
    if (lowDataMode) {
      document.documentElement.setAttribute("low-data-mode", "true");
    } else {
      document.documentElement.removeAttribute("low-data-mode");
    }
  }, [lowDataMode]);

  const setLanguage = (lang: Language) => setLanguageState(lang);
  const toggleLowDataMode = () => setLowDataMode(prev => !prev);
  
  const t = (key: keyof TranslationText) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <SettingsContext.Provider value={{ language, setLanguage, lowDataMode, toggleLowDataMode, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};
