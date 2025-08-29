import { 
  type User, 
  type InsertUser, 
  type Platform, 
  type InsertPlatform,
  type Location,
  type InsertLocation,
  type Campaign,
  type InsertCampaign,
  type Metric,
  type InsertMetric,
  type EnrichmentSuggestion,
  type InsertEnrichmentSuggestion,
  type Alert,
  type InsertAlert
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Platforms
  getAllPlatforms(): Promise<Platform[]>;
  getPlatform(id: string): Promise<Platform | undefined>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  updatePlatform(id: string, platform: Partial<Platform>): Promise<Platform | undefined>;
  
  // Locations
  getAllLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Campaigns
  getAllCampaigns(): Promise<Campaign[]>;
  getCampaignsByPlatform(platformId: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  
  // Metrics
  getMetrics(filters: {
    platformId?: string;
    locationId?: string;
    campaignId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  
  // Enrichment Suggestions
  getEnrichmentSuggestions(platformId?: string): Promise<EnrichmentSuggestion[]>;
  createEnrichmentSuggestion(suggestion: InsertEnrichmentSuggestion): Promise<EnrichmentSuggestion>;
  updateEnrichmentSuggestion(id: string, suggestion: Partial<EnrichmentSuggestion>): Promise<EnrichmentSuggestion | undefined>;
  
  // Alerts
  getActiveAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  dismissAlert(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private platforms: Map<string, Platform>;
  private locations: Map<string, Location>;
  private campaigns: Map<string, Campaign>;
  private metrics: Map<string, Metric>;
  private enrichmentSuggestions: Map<string, EnrichmentSuggestion>;
  private alerts: Map<string, Alert>;

  constructor() {
    this.users = new Map();
    this.platforms = new Map();
    this.locations = new Map();
    this.campaigns = new Map();
    this.metrics = new Map();
    this.enrichmentSuggestions = new Map();
    this.alerts = new Map();
    
    // Initialize with sample data for demonstration
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample platforms
    const googlePlatform = await this.createPlatform({
      name: "Google Ads",
      type: "ads",
      isConnected: true,
      status: "connected"
    });
    
    const metaPlatform = await this.createPlatform({
      name: "Meta Ads", 
      type: "ads",
      isConnected: true,
      status: "connected"
    });
    
    const tiktokPlatform = await this.createPlatform({
      name: "TikTok Ads",
      type: "ads", 
      isConnected: true,
      status: "syncing"
    });
    
    const applePlatform = await this.createPlatform({
      name: "Apple Maps",
      type: "maps",
      isConnected: true,
      status: "connected"
    });

    // Create sample locations
    const manhattanLocation = await this.createLocation({
      name: "Manhattan - 5th Ave",
      address: "123 Fifth Avenue",
      city: "New York",
      state: "NY",
      isActive: true
    });
    
    const beverlyLocation = await this.createLocation({
      name: "Beverly Hills - Rodeo Dr", 
      address: "456 Rodeo Drive",
      city: "Beverly Hills",
      state: "CA",
      isActive: true
    });

    // Create sample campaigns
    await this.createCampaign({
      name: "Holiday Collection 2024",
      platformId: googlePlatform.id,
      isActive: true,
      budget: 50000,
      startDate: new Date("2024-12-01"),
      endDate: new Date("2024-12-31")
    });

    // Create sample enrichment suggestions
    await this.createEnrichmentSuggestion({
      platformId: googlePlatform.id,
      type: "location_extension",
      title: "Add Missing Location Extensions", 
      description: "12 locations missing address extensions. Adding these could increase local clicks by 15-25%.",
      impact: "high",
      estimatedImprovement: "+18% local engagement"
    });

    // Create sample alert
    await this.createAlert({
      type: "warning",
      title: "Data Delay Warning",
      description: "TikTok feed update delayed by 15 minutes",
      platformId: tiktokPlatform.id
    });

    // Create sample metrics for the last 7 days
    const endDate = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      
      // Google Ads metrics
      await this.createMetric({
        platformId: googlePlatform.id,
        locationId: manhattanLocation.id,
        campaignId: null,
        date,
        impressions: Math.floor(Math.random() * 5000) + 8000,
        clicks: Math.floor(Math.random() * 500) + 400,
        storeVisits: Math.floor(Math.random() * 200) + 150,
        purchases: Math.floor(Math.random() * 30) + 25,
        revenue: Math.floor(Math.random() * 3000) + 2500,
        adSpend: Math.floor(Math.random() * 800) + 600,
        avgOrderValue: Math.floor(Math.random() * 50) + 100,
        engagements: Math.floor(Math.random() * 300) + 250
      });

      // Meta Ads metrics
      await this.createMetric({
        platformId: metaPlatform.id,
        locationId: manhattanLocation.id,
        campaignId: null,
        date,
        impressions: Math.floor(Math.random() * 4000) + 6000,
        clicks: Math.floor(Math.random() * 400) + 300,
        storeVisits: Math.floor(Math.random() * 180) + 120,
        purchases: Math.floor(Math.random() * 25) + 20,
        revenue: Math.floor(Math.random() * 2500) + 2000,
        adSpend: Math.floor(Math.random() * 700) + 500,
        avgOrderValue: Math.floor(Math.random() * 40) + 95,
        engagements: Math.floor(Math.random() * 250) + 200
      });

      // TikTok Ads metrics
      await this.createMetric({
        platformId: tiktokPlatform.id,
        locationId: beverlyLocation.id,
        campaignId: null,
        date,
        impressions: Math.floor(Math.random() * 6000) + 4000,
        clicks: Math.floor(Math.random() * 300) + 200,
        storeVisits: Math.floor(Math.random() * 100) + 80,
        purchases: Math.floor(Math.random() * 15) + 12,
        revenue: Math.floor(Math.random() * 1500) + 1200,
        adSpend: Math.floor(Math.random() * 400) + 300,
        avgOrderValue: Math.floor(Math.random() * 30) + 90,
        engagements: Math.floor(Math.random() * 400) + 300
      });

      // Apple Maps metrics
      await this.createMetric({
        platformId: applePlatform.id,
        locationId: beverlyLocation.id,
        campaignId: null,
        date,
        impressions: Math.floor(Math.random() * 2000) + 1500,
        clicks: Math.floor(Math.random() * 150) + 100,
        storeVisits: Math.floor(Math.random() * 80) + 60,
        purchases: Math.floor(Math.random() * 10) + 8,
        revenue: Math.floor(Math.random() * 800) + 600,
        adSpend: Math.floor(Math.random() * 200) + 150,
        avgOrderValue: Math.floor(Math.random() * 25) + 75,
        engagements: Math.floor(Math.random() * 200) + 150
      });
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "user"
    };
    this.users.set(id, user);
    return user;
  }

  async getAllPlatforms(): Promise<Platform[]> {
    return Array.from(this.platforms.values());
  }

  async getPlatform(id: string): Promise<Platform | undefined> {
    return this.platforms.get(id);
  }

  async createPlatform(platform: InsertPlatform): Promise<Platform> {
    const id = randomUUID();
    const newPlatform: Platform = { 
      ...platform, 
      id,
      status: platform.status || "disconnected",
      isConnected: platform.isConnected || false,
      lastSync: new Date()
    };
    this.platforms.set(id, newPlatform);
    return newPlatform;
  }

  async updatePlatform(id: string, platform: Partial<Platform>): Promise<Platform | undefined> {
    const existing = this.platforms.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...platform };
    this.platforms.set(id, updated);
    return updated;
  }

  async getAllLocations(): Promise<Location[]> {
    return Array.from(this.locations.values());
  }

  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async createLocation(location: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const newLocation: Location = { 
      ...location, 
      id,
      isActive: location.isActive !== undefined ? location.isActive : true
    };
    this.locations.set(id, newLocation);
    return newLocation;
  }

  async getAllCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values());
  }

  async getCampaignsByPlatform(platformId: string): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).filter(c => c.platformId === platformId);
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const newCampaign: Campaign = { 
      ...campaign, 
      id,
      isActive: campaign.isActive !== undefined ? campaign.isActive : true,
      platformId: campaign.platformId || null,
      budget: campaign.budget || null,
      startDate: campaign.startDate || null,
      endDate: campaign.endDate || null
    };
    this.campaigns.set(id, newCampaign);
    return newCampaign;
  }

  async getMetrics(filters: {
    platformId?: string;
    locationId?: string;
    campaignId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<Metric[]> {
    let results = Array.from(this.metrics.values());
    
    if (filters.platformId) {
      results = results.filter(m => m.platformId === filters.platformId);
    }
    if (filters.locationId) {
      results = results.filter(m => m.locationId === filters.locationId);
    }
    if (filters.campaignId) {
      results = results.filter(m => m.campaignId === filters.campaignId);
    }
    if (filters.startDate) {
      results = results.filter(m => new Date(m.date) >= filters.startDate!);
    }
    if (filters.endDate) {
      results = results.filter(m => new Date(m.date) <= filters.endDate!);
    }
    
    return results;
  }

  async createMetric(metric: InsertMetric): Promise<Metric> {
    const id = randomUUID();
    const newMetric: Metric = { 
      ...metric, 
      id,
      platformId: metric.platformId || null,
      locationId: metric.locationId || null,
      campaignId: metric.campaignId || null,
      impressions: metric.impressions || null,
      clicks: metric.clicks || null,
      storeVisits: metric.storeVisits || null,
      purchases: metric.purchases || null,
      revenue: metric.revenue || null,
      adSpend: metric.adSpend || null,
      avgOrderValue: metric.avgOrderValue || null,
      engagements: metric.engagements || null
    };
    this.metrics.set(id, newMetric);
    return newMetric;
  }

  async getEnrichmentSuggestions(platformId?: string): Promise<EnrichmentSuggestion[]> {
    let results = Array.from(this.enrichmentSuggestions.values());
    if (platformId) {
      results = results.filter(s => s.platformId === platformId);
    }
    return results;
  }

  async createEnrichmentSuggestion(suggestion: InsertEnrichmentSuggestion): Promise<EnrichmentSuggestion> {
    const id = randomUUID();
    const newSuggestion: EnrichmentSuggestion = { 
      platformId: suggestion.platformId || null,
      type: suggestion.type,
      title: suggestion.title,
      description: suggestion.description,
      impact: suggestion.impact,
      estimatedImprovement: suggestion.estimatedImprovement || null,
      id,
      isImplemented: false,
      createdAt: new Date()
    };
    this.enrichmentSuggestions.set(id, newSuggestion);
    return newSuggestion;
  }

  async updateEnrichmentSuggestion(id: string, suggestion: Partial<EnrichmentSuggestion>): Promise<EnrichmentSuggestion | undefined> {
    const existing = this.enrichmentSuggestions.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...suggestion };
    this.enrichmentSuggestions.set(id, updated);
    return updated;
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values()).filter(a => a.isActive);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const newAlert: Alert = { 
      type: alert.type,
      title: alert.title,
      description: alert.description,
      platformId: alert.platformId || null,
      id,
      isActive: true,
      createdAt: new Date()
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async dismissAlert(id: string): Promise<void> {
    const alert = this.alerts.get(id);
    if (alert) {
      alert.isActive = false;
      this.alerts.set(id, alert);
    }
  }
}

export const storage = new MemStorage();
