import { Slider } from "@/components/ui/slider";
import { Check, MessageCircle, Table2, TrendingUp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLang } from "../contexts/LanguageContext";

const WA_NUMBER = "5215521864824";
const DISPLAY_NUMBER = "+52 55 2186 4824";
const makeWaLink = (msg: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

const WA_ANALYSIS_MSG =
  "Hola, quiero recibir el análisis de inversión completo de Distum Anzures. ¿Me pueden ayudar?";
const WA_PRICES_MSG =
  "Hola, me gustaría ver la tabla de precios y disponibilidad de Distum Anzures.";

const METRICS_ES = [
  { label: "Precio/m² Distum", value: "$80,000 – 87,000" },
  { label: "Plusvalía anual zona", value: "17.48% documentado" },
  { label: "Cap rate renta tradicional", value: "4.77% real" },
  { label: "Renta Airbnb estimada", value: "8.2% anual" },
];

const METRICS_EN = [
  { label: "Distum price/m²", value: "$80,000 – 87,000" },
  { label: "Annual area appreciation", value: "17.48% documented" },
  { label: "Traditional rental cap rate", value: "4.77% real" },
  { label: "Estimated Airbnb yield", value: "8.2% annual" },
];

const COMPARISON_ES = [
  { zone: "Polanco", price: "$82,664 – 89,314/m²" },
  { zone: "Roma Norte", price: "$59,848/m²" },
  { zone: "Condesa", price: "$67,865/m²" },
  { zone: "Del Valle", price: "$50,453/m²" },
];

const COMPARISON_EN = [
  { zone: "Polanco", price: "$82,664 – 89,314/m²" },
  { zone: "Roma Norte", price: "$59,848/m²" },
  { zone: "Condesa", price: "$67,865/m²" },
  { zone: "Del Valle", price: "$50,453/m²" },
];

function fmt(n: number) {
  return n.toLocaleString("es-MX");
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InvestmentCalculatorSection({ open, onClose }: Props) {
  const { lang, t } = useLang();
  const [investment, setInvestment] = useState(2400000);

  const metrics = lang === "es" ? METRICS_ES : METRICS_EN;
  const comparison = lang === "es" ? COMPARISON_ES : COMPARISON_EN;

  // ESC key to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const calc = useMemo(() => {
    const traditionalMonthly = Math.round((investment * 0.0477) / 12);
    const m2 = Math.round(investment / 83500);
    const dailyRate = 880;
    const occupancy = 0.7;
    const airbnbMin = Math.round(m2 * dailyRate * occupancy * 0.85);
    const airbnbMax = Math.round(m2 * dailyRate * occupancy * 1.15);
    const plusvalia = Math.round(investment * 0.1748);
    const annualRent = Math.round(investment * 0.0477);
    const totalAnnual = plusvalia + annualRent;
    return {
      traditionalMonthly,
      airbnbMin,
      airbnbMax,
      plusvalia,
      annualRent,
      totalAnnual,
      m2,
    };
  }, [investment]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.88)" }}
      aria-modal="true"
      data-ocid="investment.modal"
    >
      {/* Backdrop click */}
      <div
        role="presentation"
        className="absolute inset-0"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Inner scrollable container */}
      <div
        id="investment"
        className="relative w-full max-w-3xl mx-auto my-4 sm:my-8 rounded-2xl overflow-hidden p-5 md:p-8"
        style={{
          background: "#050e1a",
          border: "1px solid rgba(201,162,91,0.18)",
          maxHeight: "calc(100vh - 2rem)",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          data-ocid="investment.close_button"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close calculator"
        >
          <X size={18} />
        </button>

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest"
            style={{
              background: "rgba(201,162,91,0.12)",
              border: "1px solid rgba(201,162,91,0.35)",
              color: "#c9a25b",
            }}
          >
            <TrendingUp size={11} />
            {t(
              "PARA INVERTIR · ENTREGA INMEDIATA",
              "FOR INVESTORS · IMMEDIATE DELIVERY",
            )}
          </span>
        </div>

        {/* Headline */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
            {lang === "es" ? (
              <>
                El precio de hoy.
                <br />
                La plusvalía de mañana.
              </>
            ) : (
              <>
                Today&rsquo;s price.
                <br />
                Tomorrow&rsquo;s upside.
              </>
            )}
          </h2>
          <p className="text-muted-foreground text-base">
            {t(
              "Renta desde el mes 1. No en 2 años.",
              "Rental income from month 1. Not in 2 years.",
            )}
          </p>
        </div>

        {/* Why Distum metrics table */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="px-5 py-3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-xs font-bold tracking-widest text-muted-foreground">
              {t(
                "POR QUÉ DISTUM ES LA MEJOR INVERSIÓN HOY",
                "WHY DISTUM IS THE BEST INVESTMENT TODAY",
              )}
            </p>
          </div>
          <div
            className="divide-y"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex justify-between items-center px-5 py-4"
                style={{ background: "rgba(7,18,34,0.6)" }}
              >
                <span className="text-white/70 text-sm">{m.label}</span>
                <span
                  className="font-semibold text-sm text-right"
                  style={{ color: "#c9a25b" }}
                >
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Slider calculator */}
        <div
          className="rounded-2xl p-5 md:p-8 mb-8"
          style={{
            background: "rgba(12,24,42,0.9)",
            border: "1px solid rgba(201,162,91,0.22)",
            boxShadow: "0 0 40px rgba(201,162,91,0.06)",
          }}
        >
          {/* Amount display */}
          <div className="text-center mb-6">
            <p
              className="text-xs font-semibold tracking-widest mb-2"
              style={{ color: "rgba(201,162,91,0.7)" }}
            >
              {t("TU INVERSIÓN / YOUR INVESTMENT", "YOUR INVESTMENT")}
            </p>
            <p className="font-display text-3xl md:text-5xl font-bold text-white">
              ${fmt(investment)}{" "}
              <span className="text-xl md:text-3xl text-white/50 font-semibold">
                MXN
              </span>
            </p>
          </div>

          {/* Slider */}
          <div className="mb-8">
            <Slider
              min={1500000}
              max={12000000}
              step={100000}
              value={[investment]}
              onValueChange={(vals) => setInvestment(vals[0])}
              className="mb-3"
              data-ocid="investment.input"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$1.5M MXN</span>
              <span>$12M MXN</span>
            </div>
          </div>

          {/* Rent estimates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              <p className="text-xs text-muted-foreground mb-2">
                {t("Renta tradicional estimada", "Est. traditional rent")}
              </p>
              <p className="text-white font-bold text-2xl">
                ${fmt(calc.traditionalMonthly)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                / {t("mes", "mo")} &nbsp;·&nbsp; {calc.m2} m²
              </p>
            </div>
            <div
              className="rounded-xl p-5"
              style={{
                background: "rgba(201,162,91,0.07)",
                border: "1px solid rgba(201,162,91,0.25)",
              }}
            >
              <p className="text-xs text-muted-foreground mb-2">
                {t("Renta Airbnb estimada", "Est. Airbnb rent")}
              </p>
              <p className="font-bold text-2xl" style={{ color: "#c9a25b" }}>
                ${fmt(calc.airbnbMin)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                – ${fmt(calc.airbnbMax)} / {t("mes", "mo")}
              </p>
            </div>
          </div>

          {/* Total return box */}
          <div
            className="rounded-xl p-5"
            style={{
              background: "rgba(201,162,91,0.08)",
              border: "2px solid rgba(201,162,91,0.4)",
              boxShadow: "0 0 20px rgba(201,162,91,0.08)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {t(
                    "Retorno total anual estimado",
                    "Estimated total annual return",
                  )}
                </p>
                <p
                  className="font-display text-3xl font-bold"
                  style={{ color: "#c9a25b" }}
                >
                  +${fmt(calc.totalAnnual)}
                  <span className="text-base font-normal text-white/50 ml-1">
                    MXN
                  </span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">
                  {t("Renta", "Rent")}
                </p>
                <p className="text-white font-semibold text-sm">
                  +${fmt(calc.annualRent)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t("Plusvalía", "Appreciation")}
                </p>
                <p className="text-white font-semibold text-sm">
                  +${fmt(calc.plusvalia)}
                </p>
              </div>
            </div>
            <p
              className="text-xs mt-3"
              style={{ color: "rgba(201,162,91,0.6)" }}
            >
              {t(
                "4.77% renta + 17.48% plusvalía anual · estimado",
                "4.77% rent + 17.48% annual appreciation · estimated",
              )}
            </p>
          </div>
        </div>

        {/* Comparative price per m2 */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="px-5 py-3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-xs font-bold tracking-widest text-muted-foreground">
              {t("COMPARATIVA PRECIO POR M²", "PRICE PER M² COMPARISON")}
            </p>
          </div>
          {/* Distum highlight row */}
          <div
            className="flex justify-between items-center px-5 py-4"
            style={{
              background: "rgba(201,162,91,0.14)",
              borderBottom: "1px solid rgba(201,162,91,0.28)",
            }}
          >
            <span className="flex items-center gap-2">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: "rgba(201,162,91,0.25)" }}
              >
                <Check size={11} style={{ color: "#c9a25b" }} />
              </span>
              <span className="text-sm font-bold" style={{ color: "#c9a25b" }}>
                Distum Anzures
              </span>
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "#c9a25b" }}
            >
              {t(
                "igual precio, mejor ubicación",
                "same price, better location",
              )}
            </span>
          </div>
          <div
            className="divide-y"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            {comparison.map((row) => (
              <div
                key={row.zone}
                className="flex justify-between items-center px-5 py-3.5"
                style={{ background: "rgba(7,18,34,0.6)" }}
              >
                <span className="text-white/60 text-sm">{row.zone}</span>
                <span className="text-white/80 font-semibold text-sm">
                  {row.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate delivery advantage */}
        <div
          className="rounded-xl p-5 mb-8"
          style={{
            background: "rgba(201,162,91,0.06)",
            border: "1px solid rgba(201,162,91,0.2)",
          }}
        >
          <p className="text-white/90 text-sm leading-relaxed">
            <span className="font-bold" style={{ color: "#c9a25b" }}>
              {t(
                "Entrega inmediata = ventaja real.",
                "Immediate delivery = real advantage.",
              )}
            </span>{" "}
            {t(
              "Otros proyectos en la zona: 18–36 meses de espera. Aquí recibes llaves en 60 días y empiezas a generar renta desde el mes 1.",
              "Other projects in the area: 18–36 months wait. Here you get keys in 60 days and start generating rent from month 1.",
            )}
          </p>
        </div>

        {/* Available units label */}
        <p className="text-xs font-bold tracking-widest text-muted-foreground text-center mb-5">
          {t(
            "UNIDADES DISPONIBLES PARA INVERSIÓN",
            "UNITS AVAILABLE FOR INVESTMENT",
          )}
        </p>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <div>
            <a
              href={makeWaLink(WA_ANALYSIS_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="investment.primary_button"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#25D366", color: "#fff" }}
            >
              <MessageCircle size={18} />
              {t(
                "Quiero el análisis de inversión",
                "I want the investment analysis",
              )}
            </a>
            <p
              className="text-center text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {DISPLAY_NUMBER}
            </p>
          </div>
          <div>
            <a
              href={makeWaLink(WA_PRICES_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="investment.secondary_button"
              className="flex items-center justify-center gap-3 w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              <Table2 size={16} />
              {t(
                "Ver tabla de precios y disponibilidad",
                "View price and availability table",
              )}
            </a>
            <p
              className="text-center text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {DISPLAY_NUMBER}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-xs text-muted-foreground mt-5 mb-2">
          {t(
            "Análisis técnico gratuito · Ing. Civil UNAM · Sin compromiso",
            "Free technical analysis · Civil Engineer UNAM · No commitment",
          )}
        </p>
      </div>
    </div>
  );
}
