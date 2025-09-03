import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Since frontend now uses mock data, these endpoints are simplified
  // They exist to maintain compatibility but return minimal responses
  
  app.get("/api/overview", async (req, res) => {
    // Frontend now uses mock data, so just return a success response
    res.json({ message: "Frontend using mock data" });
  });

  app.get("/api/metrics", async (req, res) => {
    res.json({ message: "Frontend using mock data" });
  });

  app.get("/api/enrichment-suggestions", async (req, res) => {
    res.json({ message: "Frontend using mock data" });
  });

  app.patch("/api/enrichment-suggestions/:id", async (req, res) => {
    res.json({ success: true, message: "Frontend using mock data" });
  });

  app.delete("/api/alerts/:id", async (req, res) => {
    res.json({ success: true, message: "Frontend using mock data" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
