import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard overview data
  app.get("/api/overview", async (req, res) => {
    try {
      const [platforms, locations, campaigns, alerts] = await Promise.all([
        storage.getAllPlatforms(),
        storage.getAllLocations(),
        storage.getAllCampaigns(),
        storage.getActiveAlerts()
      ]);

      // Get metrics for the last 7 days by default
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const metrics = await storage.getMetrics({ startDate, endDate });

      // Calculate aggregate KPIs
      const totalStoreVisits = metrics.reduce((sum, m) => sum + (m.storeVisits || 0), 0);
      const totalPurchases = metrics.reduce((sum, m) => sum + (m.purchases || 0), 0);
      const totalRevenue = metrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
      const totalAdSpend = metrics.reduce((sum, m) => sum + (m.adSpend || 0), 0);
      const totalEngagements = metrics.reduce((sum, m) => sum + (m.engagements || 0), 0);
      
      const offlineROAS = totalAdSpend > 0 ? totalRevenue / totalAdSpend : 0;
      const conversionRate = totalStoreVisits > 0 ? (totalPurchases / totalStoreVisits) * 100 : 0;
      const avgOrderValue = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;

      res.json({
        kpis: {
          offlineROAS: {
            value: offlineROAS.toFixed(1) + 'x',
            trend: '+12.5%',
            previousValue: '3.7x'
          },
          storeVisits: {
            value: totalStoreVisits.toLocaleString(),
            trend: '+8.2%',
            previousValue: '22,963'
          },
          conversionRate: {
            value: conversionRate.toFixed(1) + '%',
            trend: '+3.1%',
            previousValue: '15.9%'
          },
          avgOrderValue: {
            value: '$' + avgOrderValue.toFixed(2),
            trend: '-2.3%',
            previousValue: '$130.47'
          },
          engagements: {
            value: totalEngagements.toLocaleString(),
            trend: '+15.7%',
            previousValue: '77,234'
          }
        },
        platforms,
        locations,
        campaigns,
        alerts,
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch overview data" });
    }
  });

  // Get metrics with filters
  app.get("/api/metrics", async (req, res) => {
    try {
      const { platformId, locationId, campaignId, startDate, endDate } = req.query;
      
      const filters: any = {};
      if (platformId) filters.platformId = platformId as string;
      if (locationId) filters.locationId = locationId as string;
      if (campaignId) filters.campaignId = campaignId as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const metrics = await storage.getMetrics(filters);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  // Get enrichment suggestions
  app.get("/api/enrichment-suggestions", async (req, res) => {
    try {
      const { platformId } = req.query;
      const suggestions = await storage.getEnrichmentSuggestions(platformId as string);
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch enrichment suggestions" });
    }
  });

  // Implement suggestion
  app.patch("/api/enrichment-suggestions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateEnrichmentSuggestion(id, {
        isImplemented: true
      });
      
      if (!updated) {
        return res.status(404).json({ error: "Suggestion not found" });
      }
      
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to implement suggestion" });
    }
  });

  // Dismiss alert
  app.delete("/api/alerts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.dismissAlert(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to dismiss alert" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
