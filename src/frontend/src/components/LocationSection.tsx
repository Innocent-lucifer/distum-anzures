import { useLang } from "../contexts/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const MAPS_SHARE_URL = "https://maps.app.goo.gl/xe4nRS9dPwXXWhri8";
const MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Av.+Ejercito+Nacional+843,+Anzures,+Miguel+Hidalgo,+Ciudad+de+Mexico&output=embed";

const TRAVEL_TIMES = [
  {
    icon: "🚇",
    placeEs: "Metro Polanco",
    placeEn: "Metro Polanco",
    timeEs: "5 min",
    timeEn: "5 min",
  },
  {
    icon: "✈️",
    placeEs: "Aeropuerto AICM",
    placeEn: "AICM Airport",
    timeEs: "25 min",
    timeEn: "25 min",
  },
  {
    icon: "🏥",
    placeEs: "Hospital Ángeles",
    placeEn: "Ángeles Hospital",
    timeEs: "10 min",
    timeEn: "10 min",
  },
  {
    icon: "🛍️",
    placeEs: "Antara Fashion Hall",
    placeEn: "Antara Fashion Hall",
    timeEs: "3 min",
    timeEn: "3 min",
  },
  {
    icon: "🏢",
    placeEs: "Distrito Santa Fe",
    placeEn: "Santa Fe Business District",
    timeEs: "20 min",
    timeEn: "20 min",
  },
];

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
      focusable="false"
    >
      <title>Map pin</title>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

export default function LocationSection() {
  const { t } = useLang();
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="location"
      className="reveal py-20 md:py-28 bg-background"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-widest gold-text mb-3">
            {t("CONECTIVIDAD TOTAL", "TOTAL CONNECTIVITY")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            {t("Ubicación Privilegiada", "Prime Location")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left: Address + travel times */}
          <div>
            <div
              className="rounded-2xl p-6 mb-6"
              style={{
                background: "rgba(201,162,91,0.06)",
                border: "1px solid rgba(201,162,91,0.2)",
              }}
            >
              <p className="text-xs font-bold tracking-widest gold-text mb-1">
                {t("DIRECCIÓN", "ADDRESS")}
              </p>
              <h3 className="text-white font-bold text-lg mb-1">
                Av. Ejército Nacional 843
              </h3>
              <p className="text-muted-foreground text-sm">
                Anzures, Miguel Hidalgo, CDMX
              </p>
              <a
                href={MAPS_SHARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-xs font-semibold gold-text hover:underline"
              >
                <MapPinIcon />
                {t("Ver en Google Maps", "View on Google Maps")}
              </a>
            </div>

            <h4 className="text-white font-semibold text-sm mb-4">
              {t("Tiempos de traslado", "Travel times")}
            </h4>
            <div className="space-y-3">
              {TRAVEL_TIMES.map((item) => (
                <div
                  key={item.placeEs}
                  className="flex items-center justify-between py-3 px-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white/80 text-sm">
                      {t(item.placeEs, item.placeEn)}
                    </span>
                  </div>
                  <span className="gold-text font-bold text-sm">
                    {t(item.timeEs, item.timeEn)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Google Maps embed */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ height: "400px" }}
          >
            <iframe
              title="Distum Anzures Location"
              src={MAPS_EMBED_URL}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
