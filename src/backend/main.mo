import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Language = {
    #english;
    #spanish;
  };

  type Intent = {
    #living;
    #investment;
  };

  type Source = {
    #brochure;
    #property;
    #whatsapp;
  };

  type Lead = {
    name : Text;
    email : Text;
    phone : Text;
    language : Language;
    intent : Intent;
    source : Source;
    timestamp : Time.Time;
  };

  type SiteSettings = {
    defaultLanguage : Language;
  };

  module Lead {
    public func compare(lead1 : Lead, lead2 : Lead) : Order.Order {
      Text.compare(lead1.email, lead2.email);
    };
  };

  let leads = Map.empty<Text, Lead>();
  let brochureDownloads = Map.empty<Text, Nat>();
  let propertyAvailability = Map.empty<Text, Text>();
  var siteSettings : SiteSettings = { defaultLanguage = #spanish };

  public shared ({ caller }) func captureLead(lead : Lead) : async () {
    leads.add(lead.email, lead);
  };

  public shared ({ caller }) func recordBrochureDownload(email : Text) : async Nat {
    let currentCount = switch (brochureDownloads.get(email)) {
      case (null) { 0 };
      case (?count) { count };
    };
    let newCount = currentCount + 1;
    brochureDownloads.add(email, newCount);
    newCount;
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    leads.values().toArray().sort();
  };

  public query ({ caller }) func getBrochureDownloads(email : Text) : async Nat {
    switch (brochureDownloads.get(email)) {
      case (null) { 0 };
      case (?count) { count };
    };
  };

  public query ({ caller }) func getTotalLeads() : async Nat {
    leads.size();
  };

  public query ({ caller }) func getLeadsByIntent(intent : Intent) : async [Lead] {
    leads.values().toArray().filter(
      func(lead) {
        lead.intent == intent;
      }
    );
  };

  public query ({ caller }) func getLeadsBySource(source : Source) : async [Lead] {
    leads.values().toArray().filter(
      func(lead) {
        lead.source == source;
      }
    );
  };

  public query ({ caller }) func getTotalBrochureRequests() : async Nat {
    leads.values().toArray().filter(
      func(lead) {
        lead.source == #brochure;
      }
    ).size();
  };

  public query ({ caller }) func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  public shared ({ caller }) func saveSiteSettings(settings : SiteSettings) : async () {
    siteSettings := settings;
  };

  public query ({ caller }) func getPropertyAvailability() : async [(Text, Text)] {
    propertyAvailability.entries().toArray();
  };

  public shared ({ caller }) func setPropertyAvailability(propId : Text, status : Text) : async () {
    propertyAvailability.add(propId, status);
  };
};
