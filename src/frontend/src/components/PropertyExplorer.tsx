import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PROPERTY_IMAGES } from "../config/images";
import { useLang } from "../contexts/LanguageContext";
import { useActor } from "../hooks/useActor";
import { useGetPropertyAvailability } from "../hooks/useQueries";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface Property {
  id: string;
  nameEs: string;
  nameEn: string;
  type: "loft" | "1bed" | "2bed" | "3bed" | "office";
  tab: "apartments" | "offices";
  price: number;
  area: number;
  beds?: number;
  image: string;
  featuresEs: string[];
  featuresEn: string[];
  badgeEs: string;
  badgeEn: string;
}

const PROPERTIES: Property[] = [
  {
    id: "suite-loft",
    nameEs: "Suite Loft",
    nameEn: "Suite Loft",
    type: "loft",
    tab: "apartments",
    price: 2400000,
    area: 45,
    image: PROPERTY_IMAGES.loft,
    featuresEs: ["Acabados de lujo", "Vistas panorámicas", "Cocina integral"],
    featuresEn: ["Luxury finishes", "Panoramic views", "Integrated kitchen"],
    badgeEs: "Loft",
    badgeEn: "Loft",
  },
  {
    id: "loft-premium",
    nameEs: "Loft Premium",
    nameEn: "Premium Loft",
    type: "loft",
    tab: "apartments",
    price: 2850000,
    area: 55,
    image: PROPERTY_IMAGES.loft,
    featuresEs: ["Doble altura", "Mezzanine", "Terraza privada"],
    featuresEn: ["Double height", "Mezzanine", "Private terrace"],
    badgeEs: "Loft",
    badgeEn: "Loft",
  },
  {
    id: "single-1br",
    nameEs: "Single 1 Recámara",
    nameEn: "Single 1BR",
    type: "1bed",
    tab: "apartments",
    price: 3200000,
    area: 65,
    beds: 1,
    image: PROPERTY_IMAGES.bed1,
    featuresEs: ["Recámara master", "Sala independiente", "Balcón"],
    featuresEn: ["Master bedroom", "Independent living room", "Balcony"],
    badgeEs: "1 Recámara",
    badgeEn: "1 Bedroom",
  },
  {
    id: "family-2br",
    nameEs: "Family 2 Recámaras",
    nameEn: "Family 2BR",
    type: "2bed",
    tab: "apartments",
    price: 4500000,
    area: 90,
    beds: 2,
    image: PROPERTY_IMAGES.bed2,
    featuresEs: ["2 recámaras", "Sala-comedor", "2 baños completos"],
    featuresEn: ["2 bedrooms", "Living-dining room", "2 full bathrooms"],
    badgeEs: "2 Recámaras",
    badgeEn: "2 Bedrooms",
  },
  {
    id: "family-plus-2br",
    nameEs: "Family Plus 2 Recámaras",
    nameEn: "Family Plus 2BR",
    type: "2bed",
    tab: "apartments",
    price: 5200000,
    area: 105,
    beds: 2,
    image: PROPERTY_IMAGES.bed2,
    featuresEs: ["Cuarto de servicio", "Walk-in closet", "Terraza"],
    featuresEn: ["Service room", "Walk-in closet", "Terrace"],
    badgeEs: "2 Recámaras",
    badgeEn: "2 Bedrooms",
  },
  {
    id: "corner-2br",
    nameEs: "Corner 2 Recámaras",
    nameEn: "Corner 2BR",
    type: "2bed",
    tab: "apartments",
    price: 5800000,
    area: 115,
    beds: 2,
    image: PROPERTY_IMAGES.bed2,
    featuresEs: ["Esquinero", "Vistas 270°", "Estudio independiente"],
    featuresEn: ["Corner unit", "270° views", "Independent study"],
    badgeEs: "2 Recámaras",
    badgeEn: "2 Bedrooms",
  },
  {
    id: "family-plus-3br",
    nameEs: "Family Plus 3 Recámaras",
    nameEn: "Family Plus 3BR",
    type: "3bed",
    tab: "apartments",
    price: 7500000,
    area: 145,
    beds: 3,
    image: PROPERTY_IMAGES.bed3,
    featuresEs: ["3 recámaras", "Cuarto de servicio", "Gran terraza"],
    featuresEn: ["3 bedrooms", "Service room", "Large terrace"],
    badgeEs: "3 Recámaras",
    badgeEn: "3 Bedrooms",
  },
  {
    id: "oficina-ejecutiva",
    nameEs: "Oficina Ejecutiva",
    nameEn: "Executive Office",
    type: "office",
    tab: "offices",
    price: 2900000,
    area: 55,
    image: PROPERTY_IMAGES.office,
    featuresEs: ["Piso pulido", "Plafón abierto", "Vista ciudad"],
    featuresEn: ["Polished floor", "Open ceiling", "City view"],
    badgeEs: "Oficina",
    badgeEn: "Office",
  },
  {
    id: "suite-corporativa",
    nameEs: "Suite Corporativa",
    nameEn: "Corporate Suite",
    type: "office",
    tab: "offices",
    price: 4100000,
    area: 80,
    image: PROPERTY_IMAGES.office,
    featuresEs: ["Sala juntas integrada", "Recepción", "2 privados"],
    featuresEn: ["Integrated meeting room", "Reception", "2 private offices"],
    badgeEs: "Oficina",
    badgeEn: "Office",
  },
];

type Filter = "all" | "loft" | "1bed" | "2bed" | "3bed";

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(n);

export default function PropertyExplorer() {
  const { lang, t } = useLang();
  const { actor } = useActor();
  const [tab, setTab] = useState<"apartments" | "offices">("apartments");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Property | null>(null);
  const sectionRef = useScrollReveal<HTMLElement>();
  const { data: availability = {} } = useGetPropertyAvailability();

  // Escape key to close modal
  useEffect(() => {
    if (!selected) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected]);

  const filtered = PROPERTIES.filter((p) => {
    if (p.tab !== tab) return false;
    if (filter === "all") return true;
    return p.type === filter;
  });

  // Fires WhatsApp immediately — no delay, backend call is fire-and-forget
  const handleInterest = (prop: Property) => {
    window.open(
      `https://wa.me/5215521864824?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20${encodeURIComponent(prop.nameEs)}%20en%20Distum%20Anzures.%20%C2%BFPodr%C3%ADan%20enviarme%20informaci%C3%B3n%20sobre%20disponibilidad%20y%20precios%3F`,
      "_blank",
    );
    setSelected(null);
    // Background analytics + backend — no await, never blocks UX
    window.gtag?.("event", "generate_lead", {
      source: "property",
      property: prop.id,
    });
    actor
      ?.captureLead({
        name: "Interesado",
        email: "lead@distumanzures.com",
        phone: "",
        language: "spanish" as any,
        intent: "living" as any,
        source: "property" as any,
        timestamp: BigInt(Date.now()),
      } as any)
      .catch(() => {});
  };

  const FILTERS: { value: Filter; es: string; en: string }[] = [
    { value: "all", es: "Todos", en: "All" },
    { value: "loft", es: "Loft", en: "Loft" },
    { value: "1bed", es: "1 Recámara", en: "1 Bedroom" },
    { value: "2bed", es: "2 Recámaras", en: "2 Bedrooms" },
    { value: "3bed", es: "3 Recámaras", en: "3 Bedrooms" },
  ];

  return (
    <section
      ref={sectionRef}
      id="properties"
      className="reveal py-20 md:py-28"
      style={{ background: "#0d2035" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest gold-text mb-3">
            {t("PORTAFOLIO", "PORTFOLIO")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            {t("Residencias Exclusivas", "Exclusive Residences")}
          </h2>
        </div>

        <div className="flex justify-center mb-6">
          <div
            className="flex rounded-full p-1"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {(["apartments", "offices"] as const).map((tabVal) => (
              <button
                key={tabVal}
                type="button"
                onClick={() => {
                  setTab(tabVal);
                  setFilter("all");
                }}
                data-ocid="properties.tab"
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${tab === tabVal ? "btn-gold" : "text-white/60 hover:text-white"}`}
              >
                {tabVal === "apartments"
                  ? t("Departamentos", "Apartments")
                  : t("Oficinas", "Offices")}
              </button>
            ))}
          </div>
        </div>

        {tab === "apartments" && (
          <div className="flex overflow-x-auto pb-2 justify-start sm:justify-center gap-2 mb-8 snap-x -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                data-ocid="properties.toggle"
                className="px-4 py-1.5 rounded-full text-xs font-semibold border transition-all shrink-0 snap-start"
                style={
                  filter === f.value
                    ? { borderColor: "rgba(201,162,91,0.7)", color: "#C9A25B" }
                    : {
                        borderColor: "rgba(255,255,255,0.2)",
                        color: "rgba(255,255,255,0.6)",
                      }
                }
              >
                {t(f.es, f.en)}
              </button>
            ))}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16" data-ocid="properties.empty_state">
            <p className="text-muted-foreground">
              {t(
                "No hay propiedades en esta categoría.",
                "No properties in this category.",
              )}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((prop, idx) => (
              <button
                key={prop.id}
                type="button"
                onClick={() => setSelected(prop)}
                data-ocid={`properties.item.${idx + 1}`}
                className="property-card bg-card rounded-2xl overflow-hidden text-left w-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={prop.image}
                    alt={prop.nameEs}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: "rgba(201,162,91,0.9)",
                      color: "#071A2B",
                    }}
                  >
                    {t(prop.badgeEs, prop.badgeEn)}
                  </div>
                  {(() => {
                    const status = availability[prop.id] ?? "available";
                    if (status === "available") return null;
                    const isReserved = status === "reserved";
                    return (
                      <div
                        className="absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                        style={{
                          background: isReserved
                            ? "rgba(251,191,36,0.9)"
                            : "rgba(239,68,68,0.85)",
                          color: isReserved ? "#071a2b" : "#fff",
                        }}
                      >
                        {isReserved
                          ? t("Reservado", "Reserved")
                          : t("Vendido", "Sold")}
                      </div>
                    );
                  })()}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white text-base mb-1">
                    {t(prop.nameEs, prop.nameEn)}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-3">
                    {prop.area}m²
                    {prop.beds
                      ? ` · ${prop.beds} ${t("recámara(s)", "bedroom(s)")}`
                      : ""}
                  </p>
                  <p className="gold-text font-bold text-lg mb-3">
                    {fmt(prop.price)}
                  </p>
                  <ul className="space-y-1">
                    {(lang === "es" ? prop.featuresEs : prop.featuresEn).map(
                      (f) => (
                        <li
                          key={f}
                          className="text-xs text-white/60 flex items-center gap-1.5"
                        >
                          <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                          {f}
                        </li>
                      ),
                    )}
                  </ul>
                  <p className="text-xs gold-text font-semibold mt-4">
                    {t("Más información →", "More info →")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          data-ocid="properties.modal"
        >
          <div
            role="presentation"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.80)" }}
            onClick={() => setSelected(null)}
            onKeyDown={() => {}}
          />
          <div className="glass-modal-bg relative w-full max-w-xl z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelected(null)}
              data-ocid="properties.close_button"
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white bg-black/30 rounded-full p-1"
            >
              <X size={18} />
            </button>

            <div className="relative h-56 overflow-hidden shrink-0">
              <img
                src={selected.image}
                alt={selected.nameEs}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(7,26,43,0.7) 0%, transparent 60%)",
                }}
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`}
                  />
                ))}
              </div>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
                <ChevronLeft size={20} />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50">
                <ChevronRight size={20} />
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(201,162,91,0.15)",
                      color: "#C9A25B",
                    }}
                  >
                    {t(selected.badgeEs, selected.badgeEn)}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mt-2">
                    {t(selected.nameEs, selected.nameEn)}
                  </h3>
                </div>
                <p className="gold-text font-bold text-xl shrink-0">
                  {fmt(selected.price)}
                </p>
              </div>

              <p className="text-muted-foreground text-sm mb-4">
                {selected.area}m²
                {selected.beds
                  ? ` · ${selected.beds} ${t("recámara(s)", "bedroom(s)")}`
                  : ""}
              </p>

              <ul className="space-y-2 mb-6">
                {(lang === "es"
                  ? selected.featuresEs
                  : selected.featuresEn
                ).map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-sm text-white/80"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: "#C9A25B" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleInterest(selected)}
                data-ocid="properties.confirm_button"
                className="btn-gold w-full py-3 rounded-lg text-sm font-bold tracking-wider"
              >
                {t("Estoy interesado", "I'm interested")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
