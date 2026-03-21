import { useEffect, useRef, useState } from "react";
import { useLang } from "../contexts/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface StatItem {
  valueEs: string;
  valueEn: string;
  subtitleEs: string;
  subtitleEn: string;
  numericValue?: number;
  suffix?: string;
  isText?: boolean;
}

const STATS: StatItem[] = [
  {
    valueEs: "25",
    valueEn: "25",
    subtitleEs: "Niveles de altura premium",
    subtitleEn: "Floors of premium height",
    numericValue: 25,
    suffix: "",
  },
  {
    valueEs: "6",
    valueEn: "6",
    subtitleEs: "Amenidades world-class exclusivas",
    subtitleEn: "World-class exclusive amenities",
    numericValue: 6,
    suffix: "",
  },
  {
    valueEs: "Inmediata",
    valueEn: "Ready Now",
    subtitleEs: "Entrega — sin esperas",
    subtitleEn: "Delivery — move in today",
    isText: true,
  },
  {
    valueEs: "Anzures",
    valueEn: "Anzures",
    subtitleEs: "CDMX — ubicación privilegiada",
    subtitleEn: "CDMX — prime location",
    isText: true,
  },
];

function AnimatedCounter({
  target,
  suffix = "",
  trigger,
}: { target: number; suffix?: string; trigger: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [trigger, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const { t } = useLang();
  const sectionRef = useScrollReveal();
  const [triggered, setTriggered] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observerRef.current.observe(el);
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="reveal py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0e1a 0%, #0d1528 50%, #0a0e1a 100%)",
      }}
    >
      {/* Decorative gold line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #c9a84c, transparent)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #c9a84c, transparent)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6" ref={triggerRef}>
        <div className="text-center mb-14">
          <p className="text-xs tracking-[0.3em] gold-text mb-3 font-semibold uppercase">
            {t("DATOS DEL PROYECTO", "PROJECT DATA")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            {t("El Proyecto en Cifras", "The Project by the Numbers")}
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div
              key={stat.valueEs}
              className="group relative text-center p-8 rounded-2xl border border-border hover:border-gold transition-all duration-500"
              style={{
                background: "rgba(255,255,255,0.03)",
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {/* Gold glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(201,168,76,0.06) 0%, transparent 70%)",
                }}
              />

              <div className="font-display text-4xl md:text-5xl font-bold gold-text mb-3 leading-none">
                {stat.isText ? (
                  <span>{t(stat.valueEs, stat.valueEn)}</span>
                ) : (
                  <AnimatedCounter
                    target={stat.numericValue!}
                    suffix={stat.suffix}
                    trigger={triggered}
                  />
                )}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t(stat.subtitleEs, stat.subtitleEn)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
