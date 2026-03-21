import { useLang } from "../contexts/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface BenefitCard {
  icon: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
}

const BENEFITS: BenefitCard[] = [
  {
    icon: "🛡️",
    titleEs: "Seguridad y Exclusividad",
    titleEn: "Safety & Exclusivity",
    descEs: "Colonia de alto nivel con acceso controlado y ambiente tranquilo.",
    descEn:
      "High-end neighborhood with controlled access and a calm, safe environment.",
  },
  {
    icon: "🚇",
    titleEs: "Conectividad Total",
    titleEn: "Total Connectivity",
    descEs: "Metro, Metrobús y acceso directo a Periférico en minutos.",
    descEn: "Metro, Metrobus, and direct access to the Periférico in minutes.",
  },
  {
    icon: "🍽️",
    titleEs: "Gastronomía y Cultura",
    titleEn: "Gastronomy & Culture",
    descEs:
      "Rodeado de los mejores restaurantes, galerías y vida cultural de CDMX.",
    descEn:
      "Surrounded by the best restaurants, galleries, and cultural life in CDMX.",
  },
  {
    icon: "📈",
    titleEs: "Mayor Plusvalía",
    titleEn: "Top Appreciation",
    descEs:
      "Anzures ha crecido más del 35% en valor inmobiliario en los últimos 5 años.",
    descEn:
      "Anzures has grown over 35% in real estate value in the last 5 years.",
  },
];

export default function NeighborhoodSection() {
  const { t } = useLang();
  const sectionRef = useScrollReveal();

  return (
    <section
      ref={sectionRef}
      className="reveal py-24 bg-navy-deep"
      id="neighborhood"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] gold-text mb-3 font-semibold uppercase">
            {t("LA COLONIA", "THE NEIGHBORHOOD")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            {t("¿Por qué Anzures?", "Why Anzures?")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            {t(
              "Una de las colonias más cotizadas y exclusivas de Ciudad de México, con todo lo que necesitas a tu alcance.",
              "One of the most sought-after and exclusive neighborhoods in Mexico City, with everything you need within reach.",
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((card, i) => (
            <div
              key={card.titleEs}
              className="group relative p-7 rounded-2xl border border-border hover:border-gold transition-all duration-500 cursor-default"
              style={{
                background: "rgba(255,255,255,0.03)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(circle at top left, rgba(201,168,76,0.07) 0%, transparent 70%)",
                }}
              />

              <div className="text-4xl mb-5 transform group-hover:scale-110 transition-transform duration-300">
                {card.icon}
              </div>
              <h3 className="font-display text-base font-bold text-white mb-3 leading-snug">
                {t(card.titleEs, card.titleEn)}
              </h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t(card.descEs, card.descEn)}
              </p>

              {/* Gold accent bar on hover */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-1/2 rounded-full transition-all duration-500"
                style={{ background: "#c9a84c" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
