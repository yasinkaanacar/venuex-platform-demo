import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  name: text("name").notNull(),
});

export const platforms = pgTable("platforms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'ads', 'maps', 'social'
  isConnected: boolean("is_connected").notNull().default(false),
  lastSync: timestamp("last_sync"),
  status: text("status").notNull().default("disconnected"), // 'connected', 'syncing', 'error', 'disconnected'
});

export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const campaigns = pgTable("campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  platformId: varchar("platform_id").references(() => platforms.id),
  isActive: boolean("is_active").notNull().default(true),
  budget: real("budget"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});

export const metrics = pgTable("metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platformId: varchar("platform_id").references(() => platforms.id),
  locationId: varchar("location_id").references(() => locations.id),
  campaignId: varchar("campaign_id").references(() => campaigns.id),
  date: timestamp("date").notNull(),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  storeVisits: integer("store_visits").default(0),
  purchases: integer("purchases").default(0),
  revenue: real("revenue").default(0),
  adSpend: real("ad_spend").default(0),
  avgOrderValue: real("avg_order_value").default(0),
  engagements: integer("engagements").default(0),
});

export const enrichmentSuggestions = pgTable("enrichment_suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platformId: varchar("platform_id").references(() => platforms.id),
  type: text("type").notNull(), // 'location_extension', 'image_optimization', 'hours_update', etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  impact: text("impact").notNull(), // 'high', 'medium', 'low'
  estimatedImprovement: text("estimated_improvement"),
  isImplemented: boolean("is_implemented").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // 'warning', 'error', 'info'
  title: text("title").notNull(),
  description: text("description").notNull(),
  platformId: varchar("platform_id").references(() => platforms.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  category: text("category").notNull(), // 'platform' | 'user' | 'import' | 'export' | 'reviews' | 'locations' | 'catalog' | 'offline_conversions'
  severity: text("severity").notNull(), // 'info' | 'success' | 'warning' | 'error'
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  actionUrl: text("action_url"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
});

export const insertPlatformSchema = createInsertSchema(platforms).pick({
  name: true,
  type: true,
  isConnected: true,
  status: true,
});

export const insertLocationSchema = createInsertSchema(locations).pick({
  name: true,
  address: true,
  city: true,
  state: true,
  isActive: true,
});

export const insertCampaignSchema = createInsertSchema(campaigns).pick({
  name: true,
  platformId: true,
  isActive: true,
  budget: true,
  startDate: true,
  endDate: true,
});

export const insertMetricSchema = createInsertSchema(metrics).pick({
  platformId: true,
  locationId: true,
  campaignId: true,
  date: true,
  impressions: true,
  clicks: true,
  storeVisits: true,
  purchases: true,
  revenue: true,
  adSpend: true,
  avgOrderValue: true,
  engagements: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPlatform = z.infer<typeof insertPlatformSchema>;
export type Platform = typeof platforms.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof campaigns.$inferSelect;

export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type Metric = typeof metrics.$inferSelect;

export const insertEnrichmentSuggestionSchema = createInsertSchema(enrichmentSuggestions).pick({
  platformId: true,
  type: true,
  title: true,
  description: true,
  impact: true,
  estimatedImprovement: true,
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  type: true,
  title: true,
  description: true,
  platformId: true,
});

export type InsertEnrichmentSuggestion = z.infer<typeof insertEnrichmentSuggestionSchema>;
export type EnrichmentSuggestion = typeof enrichmentSuggestions.$inferSelect;

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  category: true,
  severity: true,
  title: true,
  message: true,
  actionUrl: true,
  metadata: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type NotificationRecord = typeof notifications.$inferSelect;
