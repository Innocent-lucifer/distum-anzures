import { HERO_BG } from "../config/images";
import { useLang } from "../contexts/LanguageContext";

interface Props {
  onBrochureClick: () => void;
}

export default function HeroSection({ onBrochureClick }: Props) {
  const { lang, t } = useLang();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `url('${HERO_BG}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(7,26,43,0.92) 0%, rgba(7,26,43,0.72) 45%, rgba(7,26,43,0.25) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background:
            "linear-gradient(to top, rgba(7,26,43,1) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-10 pt-32 pb-20">
        <div className="max-w-2xl">
          <p className="hero-animate-1 text-xs font-bold tracking-[0.25em] gold-text mb-4 uppercase">
            {t("ÚLTIMAS UNIDADES DISPONIBLES", "FINAL UNITS AVAILABLE")}
          </p>

          <h1 className="hero-animate-2 font-display text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-4">
            {lang === "es" ? (
              <>
                Vive en el corazón
                <br />
                de CDMX.
              </>
            ) : (
              <>
                Live in the heart
                <br />
                of Mexico City.
              </>
            )}
          </h1>

          <p className="hero-animate-3 text-base md:text-lg font-semibold gold-text mb-3">
            {t("Entrega inmediata.", "Immediate delivery.")}
          </p>

          <p className="hero-animate-4 text-sm md:text-base text-white/70 mb-8 leading-relaxed">
            {t(
              "Distum Anzures — 25 niveles · Sky Gym · Sky Garden · Desde $2.4M MXN · Listo hoy.",
              "Distum Anzures — 25 levels · Sky Gym · Sky Garden · From $2.4M MXN · Ready today.",
            )}
          </p>

          <div className="hero-animate-5 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onBrochureClick}
              data-ocid="hero.primary_button"
              className="btn-gold px-7 py-3.5 rounded-lg text-sm font-bold tracking-wider"
            >
              {t("Descargar Brochure", "Download Brochure")}
            </button>
            <a
              href="#properties"
              data-ocid="hero.secondary_button"
              className="btn-outline-white px-7 py-3.5 rounded-lg text-sm font-semibold tracking-wider"
            >
              {t("Explorar Propiedades", "Explore Properties")}
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
        <span className="text-white text-xs tracking-widest">
          {t("SCROLL", "SCROLL")}
        </span>
        <div className="w-px h-8 bg-white/40" />
      </div>
    </section>
  );
}
