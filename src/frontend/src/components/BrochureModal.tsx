import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Loader2, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLang } from "../contexts/LanguageContext";
import { useActor } from "../hooks/useActor";
import { useGetBrochureCount } from "../hooks/useQueries";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/maqpzrwp";

const WA_NUMBER = "5215521864824";
const WA_MSG = encodeURIComponent(
  "Hola, me interesa conocer más sobre Distum Anzures. ¿Podrían enviarme información sobre disponibilidad y precios?",
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function BrochureModal({ open, onClose }: Props) {
  const { t } = useLang();
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [language, setLanguage] = useState("spanish");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: brochureCount } = useGetBrochureCount();

  const displayCount = brochureCount && brochureCount > 0 ? brochureCount : 47;

  // Escape key to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error(
        t("Por favor completa todos los campos.", "Please fill all fields."),
      );
      return;
    }
    setLoading(true);

    let backendSuccess = false;
    let formspreeSuccess = false;

    // 1. Try the app backend first
    try {
      if (actor) {
        await actor.captureLead({
          name,
          email,
          phone,
          language: language as any,
          intent: "living" as any,
          source: "brochure" as any,
          timestamp: BigInt(Date.now()),
        } as any);
        await actor.recordBrochureDownload(email);
        backendSuccess = true;
      }
    } catch {
      // Backend failed, so fall through to Formspree.
    }

    // 2. If the backend didn't succeed, try Formspree
    if (!backendSuccess) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ name, email, phone, language }),
        });
        if (res.ok) {
          formspreeSuccess = true;
        }
      } catch {
        // Formspree also failed
      }
    }

    setLoading(false);

    if (backendSuccess || formspreeSuccess) {
      window.fbq?.("track", "Lead", { source: "brochure" });
      window.gtag?.("event", "generate_lead", { source: "brochure" });
      setSuccess(true);
    } else {
      toast.error(
        t(
          "Ocurrió un error. Intenta de nuevo.",
          "An error occurred. Please try again.",
        ),
      );
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setName("");
      setEmail("");
      setPhone("");
    }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      data-ocid="brochure.modal"
    >
      <div
        role="presentation"
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.75)" }}
        onClick={handleClose}
        onKeyDown={() => {}}
      />

      <div className="glass-modal-bg relative w-full max-w-md p-5 sm:p-8 z-10 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          data-ocid="brochure.close_button"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {!success ? (
          <>
            {/* Social proof */}
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{
                background: "rgba(201,162,91,0.12)",
                border: "1px solid rgba(201,162,91,0.3)",
                color: "#c9a25b",
              }}
            >
              <span>🔥</span>
              {t(
                `${displayCount} personas ya descargaron el brochure`,
                `${displayCount} people have downloaded the brochure`,
              )}
            </div>

            <p className="text-xs font-semibold tracking-widest gold-text mb-2">
              {t("ACCESO EXCLUSIVO", "EXCLUSIVE ACCESS")}
            </p>
            <h2 className="font-display text-2xl font-bold text-white mb-1">
              {t("Descarga el Brochure", "Download the Brochure")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t(
                "Recibe información completa de Distum Anzures.",
                "Receive complete information about Distum Anzures.",
              )}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="b-name"
                  className="text-white text-sm mb-1.5 block"
                >
                  {t("Nombre completo", "Full name")}
                </Label>
                <Input
                  id="b-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("Tu nombre", "Your name")}
                  data-ocid="brochure.input"
                  className="bg-secondary border-border text-white placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Label
                  htmlFor="b-email"
                  className="text-white text-sm mb-1.5 block"
                >
                  Email
                </Label>
                <Input
                  id="b-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="bg-secondary border-border text-white placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Label
                  htmlFor="b-phone"
                  className="text-white text-sm mb-1.5 block"
                >
                  {t("Teléfono", "Phone")}
                </Label>
                <Input
                  id="b-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="bg-secondary border-border text-white placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <Label
                  htmlFor="b-lang"
                  className="text-white text-sm mb-1.5 block"
                >
                  {t("Idioma preferido", "Preferred language")}
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger
                    id="b-lang"
                    className="bg-secondary border-border text-white"
                    data-ocid="brochure.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <button
                type="submit"
                disabled={loading}
                data-ocid="brochure.submit_button"
                className="btn-gold w-full py-3 rounded-lg text-sm font-bold tracking-wider flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {t("DESCARGAR BROCHURE", "DOWNLOAD BROCHURE")}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4" data-ocid="brochure.success_state">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{
                background: "rgba(201,162,91,0.15)",
                border: "1px solid rgba(201,162,91,0.4)",
              }}
            >
              <Download size={28} className="gold-text" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              {t("¡Tu brochure está listo!", "Your brochure is ready!")}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {t(
                "Gracias por tu interés en Distum Anzures.",
                "Thank you for your interest in Distum Anzures.",
              )}
            </p>
            <a
              href="/brochure.pdf"
              download
              data-ocid="brochure.primary_button"
              className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold tracking-wider mb-3"
            >
              <Download size={16} />
              {t("DESCARGAR PDF", "DOWNLOAD PDF")}
            </a>
            <div className="mt-3">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="brochure.secondary_button"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold btn-outline-white"
              >
                <MessageCircle size={16} />
                {t("Continuar en WhatsApp", "Continue on WhatsApp")}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
