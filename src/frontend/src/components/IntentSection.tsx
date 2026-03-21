import { Slider } from "@/components/ui/slider";
import { Check, Home, TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const WA_NUMBER = "5215521864824";
const WA_MSG = encodeURIComponent(
  "Hola, me interesa conocer más sobre Distum Anzures. ¿Podrían enviarme información sobre disponibilidad y precios?",
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

function AnimatedNumber({ value }: { value: number }) {
  return <span className="tabular-nums">{value.toLocaleString("es-MX")}</span>;
}

const LIVING_BENEFITS_ES = [
  {
    icon: "🌆",
    title: "Vistas panorámicas",
    desc: "25 niveles con vistas 360° de la Ciudad de México",
  },
  {
    icon: "🏋️",
    title: "Sky Gym & Sky Garden",
    desc: "Amenidades exclusivas en las alturas",
  },
  {
    icon: "🛎️",
    title: "Concierge 24/7",
    desc: "Servicio personalizado estilo hotel cinco estrellas",
  },
  {
    icon: "🔐",
    title: "Seguridad total",
    desc: "Sistema de acceso controlado y vigilancia",
  },
];

const LIVING_BENEFITS_EN = [
  {
    icon: "🌆",
    title: "Panoramic views",
    desc: "25 levels with 360° views of Mexico City",
  },
  {
    icon: "🏋️",
    title: "Sky Gym & Sky Garden",
    desc: "Exclusive amenities at altitude",
  },
  {
    icon: "🛎️",
    title: "24/7 Concierge",
    desc: "Personalized five-star hotel style service",
  },
  {
    icon: "🔐",
    title: "Total security",
    desc: "Controlled access and surveillance system",
  },
];

const INVEST_BENEFITS_ES = [
  { text: "Plusvalía garantizada en Anzures" },
  { text: "Renta mensual desde el primer día" },
  { text: "Administración integral disponible" },
];

const INVEST_BENEFITS_EN = [
  { text: "Guaranteed appreciation in Anzures" },
  { text: "Monthly income from day one" },
  { text: "Full management available" },
];

export default function IntentSection() {
  const { lang, t } = useLang();
  const [modal, setModal] = useState<"living" | "investment" | null>(null);
  const [investment, setInvestment] = useState(3000000);
  const sectionRef = useScrollReveal<HTMLElement>();

  const monthlyIncome = Math.round(investment * 0.006);
  const annualROI = 8.5;
  const fiveYearAppreciation = Math.round(investment * 1.35);

  const benefits = lang === "es" ? LIVING_BENEFITS_ES : LIVING_BENEFITS_EN;
  const investBenefits =
    lang === "es" ? INVEST_BENEFITS_ES : INVEST_BENEFITS_EN;

  return (
    <section
      ref={sectionRef}
      id="calculator"
      className="reveal py-20 md:py-28 bg-background"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest gold-text mb-3">
            {t("TU DECISIÓN", "YOUR CHOICE")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            {t("¿Qué estás buscando?", "What are you looking for?")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => setModal("living")}
            data-ocid="intent.primary_button"
            className="bg-card rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 border border-transparent"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "rgba(201,162,91,0.15)" }}
            >
              <Home size={26} className="gold-text" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              {t("Vivir", "Living")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t(
                "Encuentra tu hogar ideal en el corazón de CDMX con todas las amenidades de lujo.",
                "Find your ideal home in the heart of CDMX with all luxury amenities.",
              )}
            </p>
            <span className="inline-block mt-4 text-xs font-bold tracking-wider gold-text">
              {t("VER BENEFICIOS →", "VIEW BENEFITS →")}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setModal("investment")}
            data-ocid="intent.secondary_button"
            className="bg-card rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 border border-transparent"
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
              style={{ background: "rgba(201,162,91,0.15)" }}
            >
              <TrendingUp size={26} className="gold-text" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">
              {t("Invertir", "Investment")}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t(
                "Maximiza tu patrimonio con una inversión en el mercado inmobiliario más dinámico.",
                "Maximize your wealth with an investment in the most dynamic real estate market.",
              )}
            </p>
            <span className="inline-block mt-4 text-xs font-bold tracking-wider gold-text">
              {t("CALCULAR ROI →", "CALCULATE ROI →")}
            </span>
          </button>
        </div>
      </div>

      {/* Living Modal */}
      {modal === "living" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          data-ocid="intent.modal"
        >
          <div
            role="presentation"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={() => setModal(null)}
            onKeyDown={(e) => e.key === "Escape" && setModal(null)}
          />
          <div className="glass-modal-bg relative w-full max-w-lg p-8 z-10">
            <button
              type="button"
              onClick={() => setModal(null)}
              data-ocid="intent.close_button"
              className="absolute top-4 right-4 text-muted-foreground hover:text-white"
            >
              <X size={20} />
            </button>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(201,162,91,0.15)" }}
            >
              <Home size={22} className="gold-text" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {t("Vivir en Distum Anzures", "Living at Distum Anzures")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t(
                "Experimenta el lujo y la comodidad en el corazón de la ciudad.",
                "Experience luxury and comfort in the heart of the city.",
              )}
            </p>
            <div className="space-y-4">
              {benefits.map((b) => (
                <div key={b.title} className="flex gap-4 items-start">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {b.title}
                    </p>
                    <p className="text-muted-foreground text-xs mt-0.5">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  document
                    .querySelector("#properties")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                data-ocid="intent.confirm_button"
                className="btn-gold w-full py-3 rounded-lg text-xs font-bold tracking-wider"
              >
                {t("VER PROPIEDADES", "VIEW PROPERTIES")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Investment Modal + Calculator */}
      {modal === "investment" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          data-ocid="calculator.modal"
        >
          <div
            role="presentation"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.75)" }}
            onClick={() => setModal(null)}
            onKeyDown={(e) => e.key === "Escape" && setModal(null)}
          />
          <div className="glass-modal-bg relative w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setModal(null)}
              data-ocid="calculator.close_button"
              className="absolute top-4 right-4 text-muted-foreground hover:text-white"
            >
              <X size={20} />
            </button>

            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ background: "rgba(201,162,91,0.15)" }}
            >
              <TrendingUp size={22} className="gold-text" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-1">
              {t("Calculadora de Inversión", "Investment Calculator")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t(
                "Proyecta el rendimiento de tu inversión.",
                "Project your investment returns.",
              )}
            </p>

            <div className="space-y-3 mb-6">
              {investBenefits.map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <Check size={14} className="gold-text shrink-0" />
                  <span className="text-white/80 text-sm">{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white text-sm font-semibold">
                  {t("Monto de inversión", "Investment amount")}
                </span>
                <span className="gold-text font-bold text-lg">
                  ${investment.toLocaleString("es-MX")} MXN
                </span>
              </div>
              <Slider
                min={500000}
                max={10000000}
                step={100000}
                value={[investment]}
                onValueChange={(vals) => setInvestment(vals[0])}
                data-ocid="calculator.input"
                className="mb-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$500K</span>
                <span>$10M</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(201,162,91,0.08)",
                  border: "1px solid rgba(201,162,91,0.2)",
                }}
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {t("Renta mensual", "Monthly income")}
                </p>
                <p className="gold-text font-bold text-lg">
                  $<AnimatedNumber value={monthlyIncome} />
                </p>
                <p className="text-xs text-muted-foreground">MXN</p>
              </div>
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(201,162,91,0.08)",
                  border: "1px solid rgba(201,162,91,0.2)",
                }}
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {t("ROI anual", "Annual ROI")}
                </p>
                <p className="gold-text font-bold text-lg">{annualROI}%</p>
                <p className="text-xs text-muted-foreground">
                  {t("rendimiento", "return")}
                </p>
              </div>
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background: "rgba(201,162,91,0.08)",
                  border: "1px solid rgba(201,162,91,0.2)",
                }}
              >
                <p className="text-xs text-muted-foreground mb-1">
                  {t("Valor en 5 años", "5-year value")}
                </p>
                <p className="gold-text font-bold text-base">
                  $<AnimatedNumber value={fiveYearAppreciation} />
                </p>
                <p className="text-xs text-muted-foreground">MXN</p>
              </div>
            </div>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="calculator.primary_button"
              className="btn-gold w-full py-3 rounded-lg text-xs font-bold tracking-wider text-center block"
            >
              {t("HABLAR CON UN ASESOR", "TALK TO AN ADVISOR")}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
