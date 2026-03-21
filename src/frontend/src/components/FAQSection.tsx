import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLang } from "../contexts/LanguageContext";
import { useScrollReveal } from "../hooks/useScrollReveal";

const FAQS = [
  {
    qEs: "¿Cuándo es la entrega?",
    qEn: "When is delivery?",
    aEs: "La entrega es inmediata. El edificio está terminado y listo para habitarse hoy mismo.",
    aEn: "Delivery is immediate. The building is complete and ready to move into today.",
  },
  {
    qEs: "¿Qué opciones de financiamiento hay?",
    qEn: "What financing options are available?",
    aEs: "Contamos con crédito hipotecario con bancos líderes (BBVA, Banorte, Santander) y esquemas de pago directo con enganche. Contáctanos para una asesoría personalizada.",
    aEn: "We offer mortgage financing with leading banks (BBVA, Banorte, Santander) and direct payment plans with down payment. Contact us for personalized advice.",
  },
  {
    qEs: "¿El estacionamiento está incluido?",
    qEn: "Is parking included?",
    aEs: "Sí, todos los departamentos y oficinas incluyen cajones de estacionamiento. Además, contamos con servicio de Valet Parking para residentes y visitas.",
    aEn: "Yes, all apartments and offices include parking spaces. We also offer Valet Parking service for residents and guests.",
  },
  {
    qEs: "¿Qué amenidades están incluidas?",
    qEn: "What amenities are included?",
    aEs: "Sky Garden, Jacuzzi Rooftop, Sky Gym, Juice Bar, Concierge 24/7 y Valet Parking — todas sin costo adicional para residentes de Distum Anzures.",
    aEn: "Sky Garden, Rooftop Jacuzzi, Sky Gym, Juice Bar, 24/7 Concierge, and Valet Parking — all included at no extra cost for Distum Anzures residents.",
  },
  {
    qEs: "¿Puedo rentar mi propiedad?",
    qEn: "Can I rent out my unit?",
    aEs: "Absolutamente. La ubicación privilegiada en Anzures y las amenidades world-class hacen de Distum una opción muy cotizada para renta residencial y corporativa de corto y largo plazo.",
    aEn: "Absolutely. The prime location in Anzures and world-class amenities make Distum a highly sought-after option for short and long-term residential and corporate rentals.",
  },
  {
    qEs: "¿Cuál es el precio por m²?",
    qEn: "What is the price per m²?",
    aEs: "Los precios varían por tipo de unidad y nivel. Las residencias parten desde $2.4M MXN. Contáctanos directamente para disponibilidad actualizada y precios.",
    aEn: "Prices vary by unit type and floor. Residences start from $2.4M MXN. Contact us directly for up-to-date availability and pricing.",
  },
];

export default function FAQSection() {
  const { t } = useLang();
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section ref={sectionRef} className="reveal py-24 bg-navy-deep" id="faq">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.3em] gold-text mb-3 uppercase">
            {t("PREGUNTAS FRECUENTES", "FAQ")}
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            {t("Todo lo que necesitas saber", "Everything you need to know")}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={faq.qEs}
              value={`faq-${i}`}
              data-ocid={`faq.item.${i + 1}`}
              className="rounded-xl border border-border px-5 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <AccordionTrigger className="text-white font-semibold text-sm text-left hover:no-underline py-4 [&>svg]:text-[#c9a25b]">
                {t(faq.qEs, faq.qEn)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                {t(faq.aEs, faq.aEn)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
