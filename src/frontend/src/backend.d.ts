import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Lead {
    source: Source;
    name: string;
    email: string;
    language: Language;
    intent: Intent;
    timestamp: Time;
    phone: string;
}
export interface SiteSettings {
    defaultLanguage: Language;
}
export type Time = bigint;
export enum Intent {
    investment = "investment",
    living = "living"
}
export enum Language {
    spanish = "spanish",
    english = "english"
}
export enum Source {
    brochure = "brochure",
    whatsapp = "whatsapp",
    property = "property"
}
export interface backendInterface {
    captureLead(lead: Lead): Promise<void>;
    getAllLeads(): Promise<Array<Lead>>;
    getBrochureDownloads(email: string): Promise<bigint>;
    getLeadsByIntent(intent: Intent): Promise<Array<Lead>>;
    getLeadsBySource(source: Source): Promise<Array<Lead>>;
    getTotalLeads(): Promise<bigint>;
    getTotalBrochureRequests(): Promise<bigint>;
    recordBrochureDownload(email: string): Promise<bigint>;
    getSiteSettings(): Promise<SiteSettings>;
    saveSiteSettings(settings: SiteSettings): Promise<void>;
    getPropertyAvailability(): Promise<Array<[string, string]>>;
    setPropertyAvailability(propId: string, status: string): Promise<void>;
}
