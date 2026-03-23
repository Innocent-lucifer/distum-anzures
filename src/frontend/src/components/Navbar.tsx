import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { LOGO } from "../config/images";
import { useLang } from "../contexts/LanguageContext";

const NAV_LINKS = [
  {
    href: "#properties",
    es: "Propiedades",
    en: "Properties",
    isCalculator: false,
  },
  {
    href: "#amenities",
    es: "Amenidades",
    en: "Amenities",
    isCalculator: false,
  },
  { href: "#location", es: "Ubicación", en: "Location", isCalculator: false },
  {
    href: "#calculator",
    es: "Calculadora",
    en: "Calculator",
    isCalculator: true,
  },
  { href: "#contact", es: "Contacto", en: "Contact", isCalculator: false },
];

interface Props {
  onBrochureClick?: () => void;
  onOpenCalculator?: () => void;
}

export default function Navbar({
  onBrochureClick: _onBrochureClick,
  onOpenCalculator,
}: Props) {
  const { lang, toggle, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on Escape
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [mobileOpen]);

  return (
    <header
      className={`fixed left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-6xl transition-all duration-300 ${
        scrolled ? "top-2" : "top-4"
      }`}
    >
      <nav
        className="glass-navbar rounded-full px-4 py-2.5 flex items-center justify-between"
        data-ocid="nav.panel"
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          {logoFailed ? (
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: "#f5e478", color: "#071a2b" }}
              aria-label="Distum Anzures"
            >
              DA
            </div>
          ) : (
            <img
              src={LOGO}
              alt="Distum Anzures"
              className="h-9 w-9 rounded-lg object-contain"
              style={{ background: "#f5e478" }}
              onError={() => setLogoFailed(true)}
            />
          )}
          <span className="font-display text-base font-bold gold-text tracking-wider hidden sm:block">
            DISTUM <span className="font-light text-white">ANZURES</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) =>
            link.isCalculator ? (
              <button
                key={link.href}
                type="button"
                onClick={() => onOpenCalculator?.()}
                data-ocid="nav.link"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {t(link.es, link.en)}
              </button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                data-ocid="nav.link"
                className="text-sm font-medium text-white/80 hover:text-white transition-colors"
              >
                {t(link.es, link.en)}
              </a>
            ),
          )}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            data-ocid="nav.toggle"
            className="text-xs font-bold border rounded-full px-3 py-1.5 transition-colors"
            style={{ borderColor: "rgba(201,162,91,0.5)", color: "#C9A25B" }}
          >
            {lang === "es" ? "EN" : "ES"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden text-white p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-ocid="nav.button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer with animated transition */}
      <div
        className={`mobile-drawer glass-navbar mt-2 rounded-2xl overflow-hidden md:hidden ${
          mobileOpen ? "mobile-drawer-open" : "mobile-drawer-closed"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="p-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) =>
            link.isCalculator ? (
              <button
                key={link.href}
                type="button"
                onClick={() => {
                  onOpenCalculator?.();
                  setMobileOpen(false);
                }}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors py-1 text-left"
              >
                {t(link.es, link.en)}
              </button>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors py-1"
              >
                {t(link.es, link.en)}
              </a>
            ),
          )}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={toggle}
              className="text-xs font-bold border rounded-full px-4 py-2.5 transition-colors"
              style={{
                borderColor: "rgba(201,162,91,0.5)",
                color: "#C9A25B",
              }}
            >
              {lang === "es" ? "EN" : "ES"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
