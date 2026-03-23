import { useQuery } from "@tanstack/react-query";
import type { Lead, SiteSettings } from "../backend";
import { Source } from "../backend";
import { useActor } from "./useActor";

export function useGetAllLeads() {
  const { actor, isFetching } = useActor();
  return useQuery<Lead[]>({
    queryKey: ["leads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTotalLeads() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["totalLeads"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalLeads();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBrochureCount() {
  const { actor, isFetching } = useActor();
  return useQuery<number>({
    queryKey: ["brochureCount"],
    queryFn: async () => {
      if (!actor) return 0;
      const n = await (actor as any).getTotalBrochureRequests();
      return Number(n);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return { defaultLanguage: "spanish" } as SiteSettings;
      return (actor as any).getSiteSettings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });
}

export function useGetPropertyAvailability() {
  const { actor, isFetching } = useActor();
  return useQuery<Record<string, string>>({
    queryKey: ["propertyAvailability"],
    queryFn: async () => {
      if (!actor) return {};
      const pairs = await (actor as any).getPropertyAvailability();
      return Object.fromEntries(pairs);
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export { Source };
