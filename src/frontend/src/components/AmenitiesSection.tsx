import { X } from "lucide-react";
import { useState } from "react";
import { AMENITY_IMAGES } from "../config/images";
import { useLang } from "../contexts/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface Amenity {
  id: string;
  nameEs: string;
  nameEn: string;
  image: string;
  descEs: string;
  descEn: string;
}

const AMENITIES: Amenity[] = [
  {
    id: "sky-garden",
    nameEs: "Sky Garden",
    nameEn: "Sky Garden",
    image: AMENITY_IMAGES.skyGarden,
    descEs:
      "Jardín elevado con vistas panorámicas de 360° sobre la Ciudad de México. Un oasis verde en las alturas para relajarse y conectar con la naturaleza.",
    descEn:
      "Elevated garden with 360° panoramic views over Mexico City. A green oasis at altitude to relax and connect with nature.",
  },
  {
    id: "jacuzzi",
    nameEs: "Jacuzzi Rooftop",
    nameEn: "Rooftop Jacuzzi",
    image: AMENITY_IMAGES.jacuzzi,
    descEs:
      "Jacuzzi de rooftop con vista inigualable a la ciudad. Relájate en aguas cálidas mientras disfrutas del skyline de CDMX.",
    descEn:
      "Rooftop jacuzzi with unmatched city views. Relax in warm waters while enjoying the CDMX skyline.",
  },
  {
    id: "sky-gym",
    nameEs: "Sky Gym",
    nameEn: "Sky Gym",
    image: AMENITY_IMAGES.skyGym,
    descEs:
      "Gimnasio en las alturas con equipamiento premium de última generación. Entrena con la mejor vista de la ciudad.",
    descEn:
      "Sky-high gym with state-of-the-art premium equipment. Train with the best view of the city.",
  },
  {
    id: "juice-bar",
    nameEs: "Juice Bar",
    nameEn: "Juice Bar",
    image: AMENITY_IMAGES.juiceBar,
    descEs:
      "Bar de jugos naturales y snacks saludables. Nutrición premium para un estilo de vida activo y consciente.",
    descEn:
      "Natural juice bar and healthy snacks. Premium nutrition for an active and conscious lifestyle.",
  },
  {
    id: "concierge",
    nameEs: "Concierge 24/7",
    nameEn: "24/7 Concierge",
    image: AMENITY_IMAGES.concierge,
    descEs:
      "Servicio de concierge 24/7 estilo hotelero. Desde reservaciones hasta servicios especiales, siempre a tu disposición.",
    descEn:
      "24/7 hotel-style concierge service. From reservations to special services, always at your disposal.",
  },
  {
    id: "valet",
    nameEs: "Valet Parking",
    nameEn: "Valet Parking",
    image: AMENITY_IMAGES.valet,
    descEs:
      "Estacionamiento con servicio de valet incluido. El cuidado de tu vehículo en manos de profesionales.",
    descEn:
      "Parking with included valet service. Your vehicle's care in the hands of professionals.",
  },
];

export default function AmenitiesSection() {
  const { t } = useLang();
  const [selected, setSelected] = useState<Amenity | null>(null);
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="reveal py-20 md:py-28 bg-navy-deep"
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest gold-text mb-3">
            {t("EXPERIENCIA DE LUJO", "LUXURY EXPERIENCE")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            {t("Amenidades World-Class", "World-Class Amenities")}
          </h2>
          <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
            {t(
              "Cada espacio ha sido diseñado para elevar tu estilo de vida.",
              "Every space has been designed to elevate your lifestyle.",
            )}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AMENITIES.map((amenity, idx) => (
            <button
              key={amenity.id}
              type="button"
              onClick={() => setSelected(amenity)}
              data-ocid={`amenities.item.${idx + 1}`}
              className="amenity-card bg-card rounded-2xl overflow-hidden text-left w-full"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={amenity.image}
                  alt={amenity.nameEs}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div
                  className="amenity-overlay absolute inset-0 flex items-center justify-center"
                  style={{ background: "rgba(201,162,91,0.15)" }}
                >
                  <span className="text-white font-semibold text-sm tracking-wider">
                    {t("Ver más →", "Learn more →")}
                  </span>
                </div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(7,26,43,0.85) 0%, transparent 50%)",
                  }}
                />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-bold text-base">
                    {t(amenity.nameEs, amenity.nameEn)}
                  </h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                  {t(amenity.descEs, amenity.descEn)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          data-ocid="amenities.modal"
        >
          <div
            role="presentation"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.80)" }}
            onClick={() => setSelected(null)}
            onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
          />
          <div className="glass-modal-bg relative w-full max-w-lg z-10 overflow-hidden">
            <button
              type="button"
              onClick={() => setSelected(null)}
              data-ocid="amenities.close_button"
              className="absolute top-4 right-4 z-10 text-white/70 hover:text-white bg-black/30 rounded-full p-1"
            >
              <X size={18} />
            </button>
            <div className="h-56 overflow-hidden">
              <img
                src={selected.image}
                alt={selected.nameEs}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <span className="text-xs font-bold tracking-widest gold-text">
                {t("AMENIDAD PREMIUM", "PREMIUM AMENITY")}
              </span>
              <h2 className="font-display text-2xl font-bold text-white mt-1 mb-3">
                {t(selected.nameEs, selected.nameEn)}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(selected.descEs, selected.descEn)}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                data-ocid="amenities.cancel_button"
                className="mt-6 btn-gold w-full py-3 rounded-lg text-xs font-bold tracking-wider"
              >
                {t("CERRAR", "CLOSE")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
