import { Star } from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const TESTIMONIALS = [
  {
    textEs:
      "Distum Anzures superó todas mis expectativas. La calidad de los acabados y las vistas son simplemente impresionantes.",
    textEn:
      "Distum Anzures exceeded all my expectations. The quality of finishes and the views are simply impressive.",
    name: "Carlos M.",
    roleEs: "Comprador",
    roleEn: "Buyer",
  },
  {
    textEs:
      "Como inversión es inmejorable. La zona de Anzures sigue creciendo y el ROI está siendo superior a lo proyectado.",
    textEn:
      "As an investment it's unbeatable. The Anzures area keeps growing and ROI has been above projections.",
    name: "Andrea L.",
    roleEs: "Inversionista",
    roleEn: "Investor",
  },
  {
    textEs:
      "El proceso de compra fue transparente y el equipo siempre dispuesto a resolver dudas. Muy recomendado.",
    textEn:
      "The buying process was transparent and the team was always ready to answer questions. Highly recommended.",
    name: "Roberto F.",
    roleEs: "Residente",
    roleEn: "Resident",
  },
];

export default function TestimonialsSection() {
  const { t } = useLang();
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="reveal py-24"
      style={{
        background:
          "linear-gradient(160deg, #060f1a 0%, #0d1f33 50%, #060f1a 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] gold-text mb-3 uppercase">
            {t("TESTIMONIOS", "TESTIMONIALS")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            {t("Lo que dicen nuestros clientes", "What our clients say")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, i) => (
            <div
              key={item.name}
              className="relative rounded-2xl p-7 flex flex-col gap-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(201,162,91,0.18)",
                backdropFilter: "blur(12px)",
                animationDelay: `${i * 0.12}s`,
              }}
            >
              {/* Big quote mark */}
              <span
                className="absolute top-4 right-5 text-6xl font-display font-bold leading-none select-none"
                style={{ color: "rgba(201,162,91,0.15)" }}
              >
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1">
                <Star
                  size={13}
                  fill="#c9a25b"
                  strokeWidth={0}
                  style={{ color: "#c9a25b" }}
                />
                <Star
                  size={13}
                  fill="#c9a25b"
                  strokeWidth={0}
                  style={{ color: "#c9a25b" }}
                />
                <Star
                  size={13}
                  fill="#c9a25b"
                  strokeWidth={0}
                  style={{ color: "#c9a25b" }}
                />
                <Star
                  size={13}
                  fill="#c9a25b"
                  strokeWidth={0}
                  style={{ color: "#c9a25b" }}
                />
                <Star
                  size={13}
                  fill="#c9a25b"
                  strokeWidth={0}
                  style={{ color: "#c9a25b" }}
                />
              </div>

              <p className="text-white/80 text-sm leading-relaxed flex-1">
                &ldquo;{t(item.textEs, item.textEn)}&rdquo;
              </p>

              <div className="flex items-center gap-3 mt-2">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #c9a25b, #d4b06a)",
                    color: "#071a2b",
                  }}
                >
                  {item.name[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {item.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t(item.roleEs, item.roleEn)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
