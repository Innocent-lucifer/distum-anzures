import {
  type backendInterface,
  type CreateActorOptions,
  type Intent,
  type Lead,
  type SiteSettings,
  type Source,
} from "./backend";

type ApiMethod = keyof backendInterface;

type JsonLead = Omit<Lead, "timestamp"> & { timestamp: string };

interface Config {
  apiBaseUrl: string;
}

let configCache: Config | null = null;
const LOCAL_DATA_KEY = "distum_local_backend_v1";
const PREFER_LOCAL_BACKEND =
  import.meta.env.DEV && import.meta.env.VITE_USE_REAL_API !== "true";

interface LocalData {
  leads: Record<string, JsonLead>;
  brochureDownloads: Record<string, number>;
  propertyAvailability: Record<string, string>;
  siteSettings: SiteSettings;
}

const DEFAULT_LOCAL_DATA: LocalData = {
  leads: {},
  brochureDownloads: {},
  propertyAvailability: {},
  siteSettings: { defaultLanguage: "spanish" as SiteSettings["defaultLanguage"] },
};

export async function loadConfig(): Promise<Config> {
  if (configCache) return configCache;
  configCache = { apiBaseUrl: "" };
  return configCache;
}

function toJsonLead(lead: Lead): JsonLead {
  return { ...lead, timestamp: lead.timestamp.toString() };
}

function fromJsonLead(lead: JsonLead): Lead {
  return { ...lead, timestamp: BigInt(lead.timestamp) };
}

function getLocalData(): LocalData {
  if (typeof window === "undefined") return structuredClone(DEFAULT_LOCAL_DATA);
  try {
    const raw = window.localStorage.getItem(LOCAL_DATA_KEY);
    if (!raw) return structuredClone(DEFAULT_LOCAL_DATA);
    return JSON.parse(raw) as LocalData;
  } catch {
    return structuredClone(DEFAULT_LOCAL_DATA);
  }
}

function saveLocalData(data: LocalData): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
}

async function callLocalBackend<T>(method: ApiMethod, params: unknown[] = []): Promise<T> {
  const data = getLocalData();
  switch (method) {
    case "captureLead": {
      const [lead] = params as [JsonLead];
      data.leads[lead.email] = lead;
      saveLocalData(data);
      return undefined as T;
    }
    case "recordBrochureDownload": {
      const [email] = params as [string];
      const count = (data.brochureDownloads[email] ?? 0) + 1;
      data.brochureDownloads[email] = count;
      saveLocalData(data);
      return String(count) as T;
    }
    case "getAllLeads":
      return Object.values(data.leads).sort((a, b) => a.email.localeCompare(b.email)) as T;
    case "getBrochureDownloads": {
      const [email] = params as [string];
      return String(data.brochureDownloads[email] ?? 0) as T;
    }
    case "getLeadsByIntent": {
      const [intent] = params as [Intent];
      return Object.values(data.leads)
        .filter((lead) => lead.intent === intent)
        .sort((a, b) => a.email.localeCompare(b.email)) as T;
    }
    case "getLeadsBySource": {
      const [source] = params as [Source];
      return Object.values(data.leads)
        .filter((lead) => lead.source === source)
        .sort((a, b) => a.email.localeCompare(b.email)) as T;
    }
    case "getTotalLeads":
      return String(Object.keys(data.leads).length) as T;
    case "getTotalBrochureRequests":
      return String(
        Object.values(data.leads).filter((lead) => lead.source === "brochure").length,
      ) as T;
    case "getSiteSettings":
      return data.siteSettings as T;
    case "saveSiteSettings": {
      const [settings] = params as [SiteSettings];
      data.siteSettings = settings;
      saveLocalData(data);
      return undefined as T;
    }
    case "getPropertyAvailability":
      return Object.entries(data.propertyAvailability) as T;
    case "setPropertyAvailability": {
      const [propId, status] = params as [string, string];
      data.propertyAvailability[propId] = status;
      saveLocalData(data);
      return undefined as T;
    }
    default:
      throw new Error(`Unknown local method: ${method}`);
  }
}

async function callBackend<T>(method: ApiMethod, params: unknown[] = []): Promise<T> {
  if (PREFER_LOCAL_BACKEND) {
    return callLocalBackend<T>(method, params);
  }

  const { apiBaseUrl } = await loadConfig();
  try {
    const response = await fetch(`${apiBaseUrl}/api/backend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, params }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        return callLocalBackend<T>(method, params);
      }
      const message = await response.text();
      throw new Error(message || `Backend request failed: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (
      message.includes("Failed to fetch") ||
      message.includes("NetworkError") ||
      message.includes("fetch failed")
    ) {
      return callLocalBackend<T>(method, params);
    }
    throw error;
  }
}

async function maybeLoadMockBackend(): Promise<backendInterface | null> {
  if (import.meta.env.VITE_USE_MOCK !== "true") return null;

  const mockModules = import.meta.glob("./mocks/backend.{ts,tsx,js,jsx}");
  const path = Object.keys(mockModules)[0];
  if (!path) return null;

  const mod = (await mockModules[path]()) as { mockBackend?: backendInterface };
  return mod.mockBackend ?? null;
}

class VercelBackendClient implements backendInterface {
  async captureLead(lead: Lead): Promise<void> {
    await callBackend<void>("captureLead", [toJsonLead(lead)]);
  }

  async getAllLeads(): Promise<Array<Lead>> {
    const leads = await callBackend<JsonLead[]>("getAllLeads");
    return leads.map(fromJsonLead);
  }

  async getBrochureDownloads(email: string): Promise<bigint> {
    const count = await callBackend<string>("getBrochureDownloads", [email]);
    return BigInt(count);
  }

  async getLeadsByIntent(intent: Intent): Promise<Array<Lead>> {
    const leads = await callBackend<JsonLead[]>("getLeadsByIntent", [intent]);
    return leads.map(fromJsonLead);
  }

  async getLeadsBySource(source: Source): Promise<Array<Lead>> {
    const leads = await callBackend<JsonLead[]>("getLeadsBySource", [source]);
    return leads.map(fromJsonLead);
  }

  async getTotalLeads(): Promise<bigint> {
    const count = await callBackend<string>("getTotalLeads");
    return BigInt(count);
  }

  async getTotalBrochureRequests(): Promise<bigint> {
    const count = await callBackend<string>("getTotalBrochureRequests");
    return BigInt(count);
  }

  async recordBrochureDownload(email: string): Promise<bigint> {
    const count = await callBackend<string>("recordBrochureDownload", [email]);
    return BigInt(count);
  }

  async getSiteSettings(): Promise<SiteSettings> {
    return callBackend<SiteSettings>("getSiteSettings");
  }

  async saveSiteSettings(settings: SiteSettings): Promise<void> {
    await callBackend<void>("saveSiteSettings", [settings]);
  }

  async getPropertyAvailability(): Promise<Array<[string, string]>> {
    return callBackend<Array<[string, string]>>("getPropertyAvailability");
  }

  async setPropertyAvailability(propId: string, status: string): Promise<void> {
    await callBackend<void>("setPropertyAvailability", [propId, status]);
  }
}

export async function createActorWithConfig(
  _options?: CreateActorOptions,
): Promise<backendInterface> {
  const mock = await maybeLoadMockBackend();
  if (mock) return mock;
  return new VercelBackendClient();
}
