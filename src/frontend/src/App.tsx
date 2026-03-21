import { Toaster } from "@/components/ui/sonner";
import { FileText } from "lucide-react";
import { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import AmenitiesSection from "./components/AmenitiesSection";
import BrochureModal from "./components/BrochureModal";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import IntentSection from "./components/IntentSection";
import LocationSection from "./components/LocationSection";
import Navbar from "./components/Navbar";
import NeighborhoodSection from "./components/NeighborhoodSection";
import PropertyExplorer from "./components/PropertyExplorer";
import StatsSection from "./components/StatsSection";
import TestimonialsSection from "./components/TestimonialsSection";
import WhatsAppButton from "./components/WhatsAppButton";
import { LanguageProvider, useLang } from "./contexts/LanguageContext";
import { useGetSiteSettings } from "./hooks/useQueries";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

function FloatingBrochureButton({ onClick }: { onClick: () => void }) {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid="brochure.open_modal_button"
      aria-label={t("Descargar Brochure", "Download Brochure")}
      className="fixed bottom-24 left-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#c9a25b] text-[#c9a25b] hover:bg-[#c9a25b] hover:text-[#071a2b] transition-all duration-200 text-sm font-semibold shadow-lg"
      style={{
        background: "rgba(7,18,34,0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <FileText size={14} />
      {t("Brochure", "Brochure")}
    </button>
  );
}

function AppInner() {
  const [brochureOpen, setBrochureOpen] = useState(false);
  const { setLang } = useLang();
  const { data: siteSettings } = useGetSiteSettings();

  useEffect(() => {
    if (siteSettings) {
      setLang(siteSettings.defaultLanguage === "english" ? "en" : "es");
    }
  }, [siteSettings, setLang]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection onBrochureClick={() => setBrochureOpen(true)} />
        <StatsSection />
        <IntentSection />
        <PropertyExplorer />
        <NeighborhoodSection />
        <AmenitiesSection />
        <TestimonialsSection />
        <LocationSection />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <FloatingBrochureButton onClick={() => setBrochureOpen(true)} />
      <BrochureModal
        open={brochureOpen}
        onClose={() => setBrochureOpen(false)}
      />
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash === "#admin",
  );

  useEffect(() => {
    const handleHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return (
    <LanguageProvider>
      {isAdmin ? <AdminPanel /> : <AppInner />}
    </LanguageProvider>
  );
}
