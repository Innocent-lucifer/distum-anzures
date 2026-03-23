import { kv } from "@vercel/kv";

const DATA_KEY = "distum:backend:v1";

const DEFAULT_DATA = {
  leads: {},
  brochureDownloads: {},
  propertyAvailability: {},
  siteSettings: { defaultLanguage: "spanish" },
};

async function getData() {
  const data = await kv.get(DATA_KEY);
  if (!data) {
    await kv.set(DATA_KEY, DEFAULT_DATA);
    return structuredClone(DEFAULT_DATA);
  }
  return data;
}

async function saveData(data) {
  await kv.set(DATA_KEY, data);
}

function sortByEmail(leads) {
  return leads.sort((a, b) => a.email.localeCompare(b.email));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { method, params = [] } = req.body ?? {};
    const data = await getData();

    switch (method) {
      case "captureLead": {
        const [lead] = params;
        data.leads[lead.email] = lead;
        await saveData(data);
        return res.status(200).json(null);
      }
      case "recordBrochureDownload": {
        const [email] = params;
        const count = (data.brochureDownloads[email] ?? 0) + 1;
        data.brochureDownloads[email] = count;
        await saveData(data);
        return res.status(200).json(String(count));
      }
      case "getAllLeads":
        return res.status(200).json(sortByEmail(Object.values(data.leads)));
      case "getBrochureDownloads": {
        const [email] = params;
        return res.status(200).json(String(data.brochureDownloads[email] ?? 0));
      }
      case "getTotalLeads":
        return res.status(200).json(String(Object.keys(data.leads).length));
      case "getLeadsByIntent": {
        const [intent] = params;
        return res.status(200).json(
          sortByEmail(Object.values(data.leads).filter((lead) => lead.intent === intent)),
        );
      }
      case "getLeadsBySource": {
        const [source] = params;
        return res.status(200).json(
          sortByEmail(Object.values(data.leads).filter((lead) => lead.source === source)),
        );
      }
      case "getTotalBrochureRequests":
        return res.status(200).json(
          String(
            Object.values(data.leads).filter((lead) => lead.source === "brochure")
              .length,
          ),
        );
      case "getSiteSettings":
        return res.status(200).json(data.siteSettings ?? DEFAULT_DATA.siteSettings);
      case "saveSiteSettings": {
        const [settings] = params;
        data.siteSettings = settings;
        await saveData(data);
        return res.status(200).json(null);
      }
      case "getPropertyAvailability":
        return res.status(200).json(Object.entries(data.propertyAvailability ?? {}));
      case "setPropertyAvailability": {
        const [propId, status] = params;
        data.propertyAvailability[propId] = status;
        await saveData(data);
        return res.status(200).json(null);
      }
      default:
        return res.status(400).json({ error: `Unknown method: ${method}` });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";
    return res.status(500).json({ error: message });
  }
}
