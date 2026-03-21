import { createContext, useContext, useState } from "react";

type Lang = "es" | "en";

interface LangCtx {
  lang: Lang;
  toggle: () => void;
  t: (es: string, en: string) => string;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LangCtx>({
  lang: "es",
  toggle: () => {},
  t: (es) => es,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  const toggle = () => setLang((l) => (l === "es" ? "en" : "es"));
  const t = (es: string, en: string) => (lang === "es" ? es : en);

  return (
    <LanguageContext.Provider value={{ lang, toggle, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
