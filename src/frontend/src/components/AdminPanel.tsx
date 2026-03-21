import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Bot,
  Building2,
  Check,
  Download,
  FileText,
  Globe,
  Home,
  Loader2,
  Lock,
  LogOut,
  MessageCircle,
  Search,
  Settings,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Lead } from "../backend.d";
import { Intent, Language, Source } from "../backend.d";
import { useActor } from "../hooks/useActor";
import {
  useGetAllLeads,
  useGetPropertyAvailability,
  useGetSiteSettings,
} from "../hooks/useQueries";

const PIN = "distum2025";
const SESSION_KEY = "distum_admin_auth";

type AdminLang = "es" | "en";

function tA(adminLang: AdminLang, es: string, en: string) {
  return adminLang === "es" ? es : en;
}

const PROPERTY_LIST = [
  { id: "suite-loft", nameEs: "Suite Loft", nameEn: "Suite Loft" },
  { id: "loft-premium", nameEs: "Loft Premium", nameEn: "Premium Loft" },
  {
    id: "single-1br",
    nameEs: "Single 1 Recámara",
    nameEn: "Single 1BR",
  },
  {
    id: "family-2br",
    nameEs: "Family 2 Recámaras",
    nameEn: "Family 2BR",
  },
  {
    id: "family-plus-2br",
    nameEs: "Family Plus 2 Recámaras",
    nameEn: "Family Plus 2BR",
  },
  {
    id: "corner-2br",
    nameEs: "Corner 2 Recámaras",
    nameEn: "Corner 2BR",
  },
  {
    id: "family-plus-3br",
    nameEs: "Family Plus 3 Recámaras",
    nameEn: "Family Plus 3BR",
  },
  {
    id: "oficina-ejecutiva",
    nameEs: "Oficina Ejecutiva",
    nameEn: "Executive Office",
  },
  {
    id: "suite-corporativa",
    nameEs: "Suite Corporativa",
    nameEn: "Corporate Suite",
  },
];

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  const d = new Date(ms);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function exportCSV(leads: Lead[]) {
  const headers = [
    "Nombre",
    "Email",
    "Teléfono",
    "Intención",
    "Fuente",
    "Idioma",
    "Fecha",
  ];
  const rows = leads.map((l) => [
    l.name,
    l.email,
    l.phone,
    l.intent === Intent.investment ? "Inversión" : "Vivir",
    l.source === Source.brochure
      ? "Brochure"
      : l.source === Source.property
        ? "Propiedad"
        : "WhatsApp",
    l.language === Language.spanish ? "ES" : "EN",
    formatTimestamp(l.timestamp),
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((c) => `"${c}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `distum-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Login Gate ──────────────────────────────────────────────────────────────
function LoginGate({ onSuccess }: { onSuccess: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin === PIN) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #060f1a 0%, #0d1f33 50%, #060f1a 100%)",
      }}
      data-ocid="admin.panel"
    >
      <div
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-6"
        style={{
          background: "rgba(15,30,48,0.95)",
          border: "1px solid rgba(201,162,91,0.2)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #c9a25b, #d4b06a)" }}
          >
            <Building2 size={28} color="#071a2b" strokeWidth={2} />
          </div>
          <div className="text-center">
            <p className="text-lg font-bold tracking-widest text-white font-display">
              FFoccus
            </p>
            <p className="text-xs text-white/40 tracking-wide mt-0.5">
              Panel de Administración
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-pin"
              className="text-xs text-white/50 font-medium tracking-wider uppercase"
            >
              Contraseña de acceso
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-[#c9a25b] focus:ring-0 h-11"
              id="admin-pin"
              data-ocid="admin.input"
              autoFocus
            />
            {error && (
              <p
                className="text-red-400 text-xs mt-1"
                data-ocid="admin.error_state"
              >
                Contraseña incorrecta. Intenta de nuevo.
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full h-11 font-bold tracking-wider btn-gold border-0"
            data-ocid="admin.submit_button"
          >
            <Lock size={14} className="mr-2" />
            Entrar / Login
          </Button>
        </form>

        <p className="text-white/20 text-xs">
          Distum Anzures · Acceso Restringido
        </p>
      </div>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <Card
      className="border-white/10 relative overflow-hidden"
      style={{ background: "rgba(15,28,44,0.9)" }}
    >
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 -translate-y-6 translate-x-6"
        style={{ background: accent }}
      />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/50 text-xs font-medium tracking-wider uppercase mb-1">
              {label}
            </p>
            <p className="text-3xl font-bold text-white font-display">
              {value}
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `${accent}22`,
              border: `1px solid ${accent}44`,
            }}
          >
            <Icon size={18} style={{ color: accent }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Coming Soon Card ─────────────────────────────────────────────────────────
function ComingSoonCard({
  icon: Icon,
  titleEs,
  descEs,
  color,
}: {
  icon: React.ElementType;
  titleEs: string;
  descEs: string;
  color: string;
}) {
  return (
    <div
      className="relative rounded-xl p-5 overflow-hidden"
      style={{
        background: "rgba(15,28,44,0.7)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        className="absolute inset-0 rounded-xl flex items-center justify-center z-10"
        style={{
          backdropFilter: "blur(2px)",
          background: "rgba(6,15,26,0.45)",
        }}
      >
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
          style={{
            background: "rgba(201,162,91,0.15)",
            border: "1px solid rgba(201,162,91,0.4)",
            color: "#c9a25b",
          }}
        >
          <Lock size={10} />
          Coming Soon
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}20`, border: `1px solid ${color}30` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div>
          <p className="text-white font-semibold text-sm mb-0.5">{titleEs}</p>
          <p className="text-white/40 text-xs leading-relaxed">{descEs}</p>
        </div>
      </div>
    </div>
  );
}

// ── Settings Tab ─────────────────────────────────────────────────────────────
function SettingsTab({ adminLang }: { adminLang: AdminLang }) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: siteSettings } = useGetSiteSettings();
  const { data: availability = {} } = useGetPropertyAvailability();
  const [defaultLang, setDefaultLang] = useState<string>(
    siteSettings?.defaultLanguage ?? "spanish",
  );
  const [savingLang, setSavingLang] = useState(false);
  const [savedPropId, setSavedPropId] = useState<string | null>(null);

  const handleSaveLang = async () => {
    if (!actor) return;
    setSavingLang(true);
    try {
      await (actor as any).saveSiteSettings({
        defaultLanguage: defaultLang as Language,
      });
      await queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success(
        tA(
          adminLang,
          "Idioma predeterminado guardado.",
          "Default language saved.",
        ),
      );
    } catch {
      toast.error(tA(adminLang, "Error al guardar.", "Error saving."));
    } finally {
      setSavingLang(false);
    }
  };

  const handleAvailabilityChange = async (propId: string, status: string) => {
    if (!actor) return;
    try {
      await (actor as any).setPropertyAvailability(propId, status);
      await queryClient.invalidateQueries({
        queryKey: ["propertyAvailability"],
      });
      setSavedPropId(propId);
      setTimeout(() => setSavedPropId(null), 2000);
    } catch {
      toast.error(tA(adminLang, "Error al actualizar.", "Error updating."));
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Default Language */}
      <section
        className="rounded-xl p-6"
        style={{
          background: "rgba(15,28,44,0.8)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe size={16} style={{ color: "#c9a25b" }} />
          <h3 className="text-white font-semibold text-sm">
            {tA(
              adminLang,
              "Idioma predeterminado del sitio",
              "Default Site Language",
            )}
          </h3>
        </div>
        <p className="text-white/40 text-xs mb-4">
          {tA(
            adminLang,
            "Define el idioma que verán los visitantes al entrar al sitio por primera vez.",
            "Sets the language visitors will see when they first visit the site.",
          )}
        </p>
        <div className="flex items-center gap-3">
          <Select value={defaultLang} onValueChange={setDefaultLang}>
            <SelectTrigger
              className="w-56 bg-white/5 border-white/15 text-white"
              data-ocid="settings.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="spanish">Español (Spanish)</SelectItem>
              <SelectItem value="english">English (Inglés)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={handleSaveLang}
            disabled={savingLang}
            className="btn-gold border-0 h-9 px-4 text-xs font-bold"
            data-ocid="settings.save_button"
          >
            {savingLang ? (
              <Loader2 size={13} className="mr-1.5 animate-spin" />
            ) : (
              <Check size={13} className="mr-1.5" />
            )}
            {tA(adminLang, "Guardar", "Save")}
          </Button>
        </div>
      </section>

      {/* Property Availability */}
      <section
        className="rounded-xl overflow-hidden"
        style={{
          border: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(12,24,38,0.8)",
        }}
      >
        <div className="px-5 py-4 flex items-center gap-2 border-b border-white/[0.06]">
          <Building2 size={15} style={{ color: "#c9a25b" }} />
          <h3 className="text-white font-semibold text-sm">
            {tA(
              adminLang,
              "Disponibilidad de Propiedades",
              "Property Availability",
            )}
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow style={{ borderColor: "rgba(255,255,255,0.07)" }}>
              <TableHead className="text-white/40 text-xs font-semibold tracking-wider uppercase py-3">
                {tA(adminLang, "Propiedad", "Property")}
              </TableHead>
              <TableHead className="text-white/40 text-xs font-semibold tracking-wider uppercase py-3">
                {tA(adminLang, "Estado", "Status")}
              </TableHead>
              <TableHead className="text-white/40 text-xs font-semibold tracking-wider uppercase py-3 w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {PROPERTY_LIST.map((prop, i) => {
              const status = availability[prop.id] ?? "available";
              return (
                <TableRow
                  key={prop.id}
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                  className="hover:bg-white/[0.03]"
                  data-ocid={`settings.item.${i + 1}`}
                >
                  <TableCell className="text-white text-sm py-3">
                    {adminLang === "es" ? prop.nameEs : prop.nameEn}
                  </TableCell>
                  <TableCell className="py-3">
                    <Select
                      value={status}
                      onValueChange={(val) =>
                        handleAvailabilityChange(prop.id, val)
                      }
                    >
                      <SelectTrigger
                        className="w-40 h-8 text-xs bg-white/5 border-white/15 text-white"
                        data-ocid={`settings.select.${i + 1}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="available">
                          {tA(adminLang, "Disponible", "Available")}
                        </SelectItem>
                        <SelectItem value="reserved">
                          {tA(adminLang, "Reservado", "Reserved")}
                        </SelectItem>
                        <SelectItem value="sold">
                          {tA(adminLang, "Vendido", "Sold")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-3 w-10">
                    {savedPropId === prop.id && (
                      <Check size={14} style={{ color: "#34d399" }} />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { data: leads = [], isLoading } = useGetAllLeads();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"leads" | "settings">("leads");
  const [adminLang, setAdminLang] = useState<AdminLang>("es");

  const stats = useMemo(
    () => ({
      total: leads.length,
      living: leads.filter((l) => l.intent === Intent.living).length,
      investment: leads.filter((l) => l.intent === Intent.investment).length,
      brochure: leads.filter((l) => l.source === Source.brochure).length,
    }),
    [leads],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q),
    );
  }, [leads, search]);

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, #060f1a 0%, #0b1c2e 60%, #060f1a 100%)",
      }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between"
        style={{
          background: "rgba(6,15,26,0.9)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(201,162,91,0.15)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #c9a25b, #d4b06a)" }}
          >
            <Building2 size={18} color="#071a2b" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-base tracking-wider font-display">
                FFoccus CRM
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase"
                style={{
                  background: "rgba(201,162,91,0.15)",
                  color: "#c9a25b",
                  border: "1px solid rgba(201,162,91,0.3)",
                }}
              >
                Beta
              </span>
            </div>
            <p className="text-white/35 text-xs">
              {tA(
                adminLang,
                "Panel de Administración — Distum Anzures",
                "Admin Panel — Distum Anzures",
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin language toggle */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <button
              type="button"
              onClick={() => setAdminLang("es")}
              className="px-3 py-1.5 text-xs font-bold transition-all"
              style={{
                background:
                  adminLang === "es" ? "rgba(201,162,91,0.2)" : "transparent",
                color: adminLang === "es" ? "#c9a25b" : "rgba(255,255,255,0.4)",
              }}
              data-ocid="admin.toggle"
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => setAdminLang("en")}
              className="px-3 py-1.5 text-xs font-bold transition-all"
              style={{
                background:
                  adminLang === "en" ? "rgba(201,162,91,0.2)" : "transparent",
                color: adminLang === "en" ? "#c9a25b" : "rgba(255,255,255,0.4)",
              }}
            >
              EN
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-white/40 hover:text-white hover:bg-white/10 gap-1.5"
            data-ocid="admin.close_button"
          >
            <LogOut size={14} />
            <span className="text-xs">{tA(adminLang, "Salir", "Logout")}</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Tab Navigation */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("leads")}
            data-ocid="admin.tab"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background:
                activeTab === "leads"
                  ? "rgba(201,162,91,0.18)"
                  : "rgba(255,255,255,0.05)",
              border:
                activeTab === "leads"
                  ? "1px solid rgba(201,162,91,0.4)"
                  : "1px solid rgba(255,255,255,0.1)",
              color:
                activeTab === "leads" ? "#c9a25b" : "rgba(255,255,255,0.5)",
            }}
          >
            <Users size={14} />
            {tA(adminLang, "Prospectos", "Leads")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            data-ocid="admin.tab"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background:
                activeTab === "settings"
                  ? "rgba(201,162,91,0.18)"
                  : "rgba(255,255,255,0.05)",
              border:
                activeTab === "settings"
                  ? "1px solid rgba(201,162,91,0.4)"
                  : "1px solid rgba(255,255,255,0.1)",
              color:
                activeTab === "settings" ? "#c9a25b" : "rgba(255,255,255,0.5)",
            }}
          >
            <Settings size={14} />
            {tA(adminLang, "Configuración", "Settings")}
          </button>
        </div>

        {activeTab === "leads" && (
          <>
            {/* Stats */}
            <section>
              <h2 className="text-white/50 text-xs font-semibold tracking-widest uppercase mb-4">
                {tA(adminLang, "Resumen", "Overview")}
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label={tA(adminLang, "Total Leads", "Total Leads")}
                  value={stats.total}
                  icon={Users}
                  accent="#c9a25b"
                />
                <StatCard
                  label={tA(adminLang, "Vivir", "Living")}
                  value={stats.living}
                  icon={Home}
                  accent="#60a5fa"
                />
                <StatCard
                  label={tA(adminLang, "Inversión", "Investment")}
                  value={stats.investment}
                  icon={TrendingUp}
                  accent="#34d399"
                />
                <StatCard
                  label="Brochure"
                  value={stats.brochure}
                  icon={FileText}
                  accent="#a78bfa"
                />
              </div>
            </section>

            {/* Leads Table */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="text-white font-semibold text-lg font-display">
                  {tA(adminLang, "Prospectos Capturados", "Captured Leads")}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    />
                    <Input
                      placeholder={tA(
                        adminLang,
                        "Buscar nombre o email…",
                        "Search name or email…",
                      )}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 h-9 w-64 bg-white/5 border-white/10 text-white text-sm placeholder:text-white/25 focus:border-[#c9a25b]"
                      data-ocid="admin.search_input"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => exportCSV(leads)}
                    disabled={leads.length === 0}
                    className="h-9 gap-1.5 btn-gold border-0 text-xs px-3"
                    data-ocid="admin.primary_button"
                  >
                    <Download size={13} />
                    {tA(adminLang, "Exportar CSV", "Export CSV")}
                  </Button>
                </div>
              </div>

              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(12,24,38,0.8)",
                }}
              >
                {isLoading ? (
                  <div
                    className="py-16 flex items-center justify-center"
                    data-ocid="admin.loading_state"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full border-2 border-[#c9a25b] border-t-transparent animate-spin" />
                      <p className="text-white/30 text-sm">
                        {tA(
                          adminLang,
                          "Cargando prospectos…",
                          "Loading leads…",
                        )}
                      </p>
                    </div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div
                    className="py-16 flex items-center justify-center"
                    data-ocid="admin.empty_state"
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      <Users size={32} className="text-white/15" />
                      <p className="text-white/40 text-sm font-medium">
                        {search
                          ? tA(
                              adminLang,
                              "Sin resultados para esa búsqueda",
                              "No results for that search",
                            )
                          : tA(
                              adminLang,
                              "Aún no hay prospectos registrados",
                              "No leads yet",
                            )}
                      </p>
                    </div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow
                        style={{ borderColor: "rgba(255,255,255,0.07)" }}
                      >
                        {[
                          tA(adminLang, "Nombre", "Name"),
                          "Email",
                          tA(adminLang, "Teléfono", "Phone"),
                          tA(adminLang, "Intención", "Intent"),
                          tA(adminLang, "Fuente", "Source"),
                          tA(adminLang, "Idioma", "Language"),
                          tA(adminLang, "Fecha", "Date"),
                        ].map((h) => (
                          <TableHead
                            key={h}
                            className="text-white/40 text-xs font-semibold tracking-wider uppercase py-3"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((lead, i) => (
                        <TableRow
                          key={`${lead.email}-${i}`}
                          style={{ borderColor: "rgba(255,255,255,0.05)" }}
                          className="hover:bg-white/[0.03] transition-colors"
                          data-ocid={`admin.item.${i + 1}`}
                        >
                          <TableCell className="text-white font-medium text-sm py-3">
                            {lead.name}
                          </TableCell>
                          <TableCell className="text-white/60 text-sm">
                            {lead.email}
                          </TableCell>
                          <TableCell className="text-white/60 text-sm">
                            {lead.phone}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className="text-xs font-semibold"
                              style={
                                lead.intent === Intent.investment
                                  ? {
                                      background: "rgba(52,211,153,0.15)",
                                      color: "#34d399",
                                      border: "1px solid rgba(52,211,153,0.3)",
                                    }
                                  : {
                                      background: "rgba(96,165,250,0.15)",
                                      color: "#60a5fa",
                                      border: "1px solid rgba(96,165,250,0.3)",
                                    }
                              }
                            >
                              {lead.intent === Intent.investment
                                ? tA(adminLang, "Inversión", "Investment")
                                : tA(adminLang, "Vivir", "Living")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className="text-xs"
                              style={
                                lead.source === Source.brochure
                                  ? {
                                      background: "rgba(167,139,250,0.15)",
                                      color: "#a78bfa",
                                      border: "1px solid rgba(167,139,250,0.3)",
                                    }
                                  : lead.source === Source.whatsapp
                                    ? {
                                        background: "rgba(74,222,128,0.15)",
                                        color: "#4ade80",
                                        border:
                                          "1px solid rgba(74,222,128,0.3)",
                                      }
                                    : {
                                        background: "rgba(251,191,36,0.15)",
                                        color: "#fbbf24",
                                        border:
                                          "1px solid rgba(251,191,36,0.3)",
                                      }
                              }
                            >
                              {lead.source === Source.brochure
                                ? "Brochure"
                                : lead.source === Source.whatsapp
                                  ? "WhatsApp"
                                  : tA(adminLang, "Propiedad", "Property")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span
                              className="text-xs font-bold px-1.5 py-0.5 rounded"
                              style={{
                                background: "rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.5)",
                              }}
                            >
                              {lead.language === Language.spanish ? "ES" : "EN"}
                            </span>
                          </TableCell>
                          <TableCell className="text-white/40 text-xs">
                            {formatTimestamp(lead.timestamp)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              {filtered.length > 0 && (
                <p className="text-white/25 text-xs mt-2 text-right">
                  {filtered.length} {tA(adminLang, "prospecto(s)", "lead(s)")}
                  {search
                    ? ` · ${tA(adminLang, "filtrado(s) de", "filtered from")} ${leads.length}`
                    : ` · ${tA(adminLang, "total", "total")}`}
                </p>
              )}
            </section>

            {/* Coming Soon */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(201,162,91,0.3), transparent)",
                  }}
                />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-white/70 font-bold text-sm tracking-widest uppercase font-display">
                    FFoccus
                  </p>
                  <p className="text-white/35 text-xs tracking-wide">
                    {tA(adminLang, "Próximas Funciones", "Coming Features")}
                  </p>
                </div>
                <div
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(201,162,91,0.3))",
                  }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <ComingSoonCard
                  icon={Zap}
                  titleEs="Meta Ads Lead Sync"
                  descEs={tA(
                    adminLang,
                    "Captura automática de leads desde tus campañas en Facebook e Instagram",
                    "Auto-capture leads from your Meta Ads campaigns",
                  )}
                  color="#60a5fa"
                />
                <ComingSoonCard
                  icon={MessageCircle}
                  titleEs="WhatsApp Automation"
                  descEs={tA(
                    adminLang,
                    "Seguimiento automático por WhatsApp con mensajes personalizados",
                    "Automated WhatsApp follow-up with personalized messages",
                  )}
                  color="#4ade80"
                />
                <ComingSoonCard
                  icon={BarChart3}
                  titleEs={tA(
                    adminLang,
                    "Pipeline de Ventas",
                    "Sales Pipeline",
                  )}
                  descEs={tA(
                    adminLang,
                    "Kanban visual para gestionar prospectos en cada etapa del embudo",
                    "Visual Kanban board to manage prospects through your sales funnel",
                  )}
                  color="#c9a25b"
                />
                <ComingSoonCard
                  icon={Bot}
                  titleEs={tA(
                    adminLang,
                    "Analytics & Conversión",
                    "Analytics & Conversion",
                  )}
                  descEs={tA(
                    adminLang,
                    "Métricas de conversión, ROI por campaña y reportes automáticos",
                    "Conversion metrics, ROI per campaign, and automatic reports",
                  )}
                  color="#a78bfa"
                />
              </div>
            </section>
          </>
        )}

        {activeTab === "settings" && <SettingsTab adminLang={adminLang} />}
      </main>

      <footer
        className="mt-8 py-5 text-center"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-white/20 text-xs tracking-wide">
          Powered by <span style={{ color: "#c9a25b" }}>FFoccus</span>
          {" · Vertical SaaS para el mercado inmobiliario mexicano"}
        </p>
      </footer>
    </div>
  );
}

// ── Root Export ───────────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1",
  );

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={handleLogout} />;
}
