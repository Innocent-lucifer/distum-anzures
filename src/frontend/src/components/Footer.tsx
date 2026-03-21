import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Loader2, MapPin, Phone, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LOGO } from "../config/images";
import { useLang } from "../contexts/LanguageContext";
import { useActor } from "../hooks/useActor";

const YEAR = new Date().getFullYear();

const FOOTER_NAV = [
  {
    titleEs: "Proyecto",
    titleEn: "Project",
    links: [
      { es: "Propiedades", en: "Properties", href: "#properties" },
      { es: "Amenidades", en: "Amenities", href: "#amenities" },
      { es: "Calculadora", en: "Calculator", href: "#calculator" },
    ],
  },
  {
    titleEs: "Información",
    titleEn: "Information",
    links: [
      { es: "Ubicación", en: "Location", href: "#location" },
      { es: "FAQ", en: "FAQ", href: "#faq" },
      { es: "Contacto", en: "Contact", href: "#contact" },
    ],
  },
];

function LegalModal({
  type,
  onClose,
}: { type: "privacy" | "terms"; onClose: () => void }) {
  const { t } = useLang();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
    >
      <div
        role="presentation"
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.80)" }}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <div className="glass-modal-bg relative w-full max-w-lg p-8 z-10 max-h-[80vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white"
        >
          <X size={20} />
        </button>
        <h2 className="font-display text-xl font-bold text-white mb-4">
          {type === "privacy"
            ? t("Política de Privacidad", "Privacy Policy")
            : t("Términos y Condiciones", "Terms & Conditions")}
        </h2>
        <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
          <p>
            {t(
              "Distum Anzures respeta tu privacidad y protege tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).",
              "Distum Anzures respects your privacy and protects your personal data in accordance with applicable privacy laws.",
            )}
          </p>
          <p>
            {t(
              "La información proporcionada será utilizada exclusivamente para contactarte sobre el proyecto Distum Anzures y no será compartida con terceros sin tu consentimiento.",
              "Information provided will be used exclusively to contact you about the Distum Anzures project and will not be shared with third parties without your consent.",
            )}
          </p>
          <p>
            {t(
              "Para ejercer tus derechos ARCO, puedes contactarnos en: info@distumanzures.com",
              "To exercise your rights, please contact us at: info@distumanzures.com",
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const { t } = useLang();
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [legalModal, setLegalModal] = useState<"privacy" | "terms" | null>(
    null,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error(
        t("Por favor completa nombre y email.", "Please fill name and email."),
      );
      return;
    }
    setSending(true);
    try {
      await actor?.captureLead({
        name,
        email,
        phone: "",
        language: "spanish" as any,
        intent: "living" as any,
        source: "whatsapp" as any,
        timestamp: BigInt(Date.now()),
      } as any);
      window.gtag?.("event", "generate_lead", { source: "contact_form" });
      toast.success(
        t(
          "¡Mensaje enviado! Te contactaremos pronto.",
          "Message sent! We'll contact you soon.",
        ),
      );
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error(
        t(
          "Ocurrió un error. Intenta de nuevo.",
          "An error occurred. Please try again.",
        ),
      );
    } finally {
      setSending(false);
    }
  };

  void message;

  return (
    <footer className="bg-navy-deep border-t border-border" id="contact">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <img
                src={LOGO}
                alt="Distum Anzures"
                className="h-12 w-12 rounded-xl object-contain"
                style={{ background: "#f5e478" }}
              />
              <div>
                <span className="font-display text-lg font-bold gold-text block leading-tight">
                  DISTUM
                </span>
                <span className="font-display text-base font-light text-white tracking-[0.2em] block leading-tight">
                  ANZURES
                </span>
              </div>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed mb-5">
              {t(
                "Residencias de lujo en el corazón de Anzures, CDMX. 25 niveles de vida premium.",
                "Luxury residences in the heart of Anzures, CDMX. 25 levels of premium living.",
              )}
            </p>

            <div className="flex gap-3">
              <a
                href="tel:+5215521864824"
                className="text-muted-foreground hover:text-white transition-colors"
                aria-label="Phone"
              >
                <Phone size={18} />
              </a>
              <a
                href="https://www.instagram.com/distum.cdmx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {FOOTER_NAV.map((col) => (
            <div key={col.titleEs}>
              <h4 className="text-white font-bold text-sm mb-4 tracking-wider">
                {t(col.titleEs, col.titleEn)}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.es}>
                    <a
                      href={link.href}
                      className="text-muted-foreground text-sm hover:text-white transition-colors"
                    >
                      {t(link.es, link.en)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider">
              {t("Contáctanos", "Contact Us")}
            </h4>
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Phone size={13} />
                <a
                  href="tel:+5215521864824"
                  className="hover:text-white transition-colors"
                >
                  +52 55 2186 4824
                </a>
              </div>
              <div className="flex items-start gap-2 text-muted-foreground text-xs">
                <MapPin size={13} className="mt-0.5 shrink-0" />
                <span>
                  {t(
                    "Av. Ejército Nacional 843, Anzures, CDMX",
                    "Av. Ejército Nacional 843, Anzures, Mexico City",
                  )}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("Nombre", "Name")}
                data-ocid="footer.input"
                className="bg-secondary border-border text-white placeholder:text-muted-foreground text-sm h-9"
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="bg-secondary border-border text-white placeholder:text-muted-foreground text-sm h-9"
              />
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("Mensaje", "Message")}
                data-ocid="footer.textarea"
                rows={3}
                className="bg-secondary border-border text-white placeholder:text-muted-foreground text-sm resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                data-ocid="footer.submit_button"
                className="btn-gold w-full py-2.5 rounded-lg text-xs font-bold tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {sending && <Loader2 size={14} className="animate-spin" />}
                {t("ENVIAR MENSAJE", "SEND MESSAGE")}
              </button>
            </form>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {YEAR} Distum Anzures.{" "}
            {t("Todos los derechos reservados.", "All rights reserved.")}
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setLegalModal("privacy")}
              data-ocid="footer.toggle"
              className="hover:text-white transition-colors"
            >
              {t("Política de Privacidad", "Privacy Policy")}
            </button>
            <button
              type="button"
              onClick={() => setLegalModal("terms")}
              data-ocid="footer.secondary_button"
              className="hover:text-white transition-colors"
            >
              {t("Términos y Condiciones", "Terms & Conditions")}
            </button>
          </div>
        </div>
      </div>
      {legalModal && (
        <LegalModal type={legalModal} onClose={() => setLegalModal(null)} />
      )}
    </footer>
  );
}
