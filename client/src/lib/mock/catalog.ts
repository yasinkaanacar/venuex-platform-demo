import type {
  IngestionSource,
  PlatformSyncStatus,
  FeedHygieneIssue,
  CatalogQuickStatsData,
  CatalogProduct,
  SyncTimelineEvent,
} from '../types/catalog';

// ------------------------------------------------------------------
// Quick Stats
// ------------------------------------------------------------------

export const mockCatalogQuickStats: CatalogQuickStatsData = {
  totalSkus: 124_880,
  totalStores: 52,
  syncSuccessRate: 98.4,
  feedFreshnessScore: 100,
};

// ------------------------------------------------------------------
// Ingestion Sources
// ------------------------------------------------------------------

export const mockIngestionSources: IngestionSource[] = [
  {
    id: 'src-1',
    name: 'Primary Product Feed',
    type: 'sftp',
    status: 'connected',
    lastReceivedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(), // 12 min ago
    nextExpectedAt: new Date(Date.now() + 48 * 60 * 1000).toISOString(),
    expectedIntervalMinutes: 60,
    lastBatchSkuCount: 124_880,
    isStale: false,
  },
  {
    id: 'src-2',
    name: 'Inventory Delta',
    type: 'api',
    status: 'connected',
    lastReceivedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 min ago
    nextExpectedAt: null,
    expectedIntervalMinutes: 15,
    lastBatchSkuCount: 342,
    isStale: false,
  },
];

// ------------------------------------------------------------------
// Platform Sync Status
// ------------------------------------------------------------------

export const mockPlatformSyncStatuses: PlatformSyncStatus[] = [
  {
    platform: 'google',
    published: 124_760,
    rejected: 120,
    pending: 0,
    lastSyncAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    syncStatus: 'healthy',
  },
  {
    platform: 'meta',
    published: 124_500,
    rejected: 380,
    pending: 45,
    lastSyncAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    syncStatus: 'warning',
  },
];

// ------------------------------------------------------------------
// Feed Hygiene Issues
// ------------------------------------------------------------------

export const mockFeedHygieneIssues: FeedHygieneIssue[] = [
  {
    id: 'issue-1',
    severity: 'critical',
    type: 'Store code mismatch',
    platform: 'google',
    affectedCount: 45,
    description: '45 products reference store codes not registered on Google Business Profile',
  },
  {
    id: 'issue-2',
    severity: 'warning',
    type: 'Missing GTIN',
    platform: 'google',
    affectedCount: 28,
    description: 'Products without GTIN may have reduced visibility in local search',
  },
  {
    id: 'issue-3',
    severity: 'warning',
    type: 'Cross-platform conflict',
    platform: 'both',
    affectedCount: 12,
    description: 'Same product/store combination shows different availability on Google vs Meta',
  },
  {
    id: 'issue-4',
    severity: 'info',
    type: 'Feed format correction',
    platform: 'meta',
    affectedCount: 3,
    description: 'Non-standard field encoding in 3 rows — auto-corrected during ingestion',
  },
];

// ------------------------------------------------------------------
// Catalog Products (mock subset)
// ------------------------------------------------------------------

export const mockCatalogProducts: CatalogProduct[] = [
  {
    id: 'prod-1',
    sku: 'SKU-08841',
    name: 'Kadife Yastık Kılıfı',
    category: 'Ev Tekstili',
    thumbnail: null,
    gtin: '8690123456789',
    brand: 'HomeStyle',
    storeCoverage: { available: 48, total: 52 },
    availabilityBreakdown: { inStock: 45, outOfStock: 3, limited: 4 },
    platforms: { google: 'published', meta: 'published' },
    feedFreshness: 'fresh',
    labels: [],
    issueCount: 0,
  },
  {
    id: 'prod-2',
    sku: 'SKU-12903',
    name: 'Seramik Kahve Fincanı',
    category: 'Mutfak',
    thumbnail: null,
    gtin: '8690123456790',
    brand: 'CeramArt',
    storeCoverage: { available: 52, total: 52 },
    availabilityBreakdown: { inStock: 52, outOfStock: 0, limited: 0 },
    platforms: { google: 'published', meta: 'rejected' },
    feedFreshness: 'fresh',
    labels: [],
    issueCount: 1,
  },
  {
    id: 'prod-3',
    sku: 'SKU-04217',
    name: 'Bambu Servis Tepsisi',
    category: 'Mutfak',
    thumbnail: null,
    gtin: null,
    brand: 'NaturalHome',
    storeCoverage: { available: 30, total: 52 },
    availabilityBreakdown: { inStock: 22, outOfStock: 22, limited: 8 },
    platforms: { google: 'pending', meta: 'published' },
    feedFreshness: 'degraded',
    labels: [],
    issueCount: 2,
  },
  {
    id: 'prod-4',
    sku: 'SKU-19832',
    name: 'Pamuklu Nevresim Takımı',
    category: 'Ev Tekstili',
    thumbnail: null,
    gtin: '8690123456791',
    brand: 'HomeStyle',
    storeCoverage: { available: 50, total: 52 },
    availabilityBreakdown: { inStock: 48, outOfStock: 2, limited: 2 },
    platforms: { google: 'published', meta: 'published' },
    feedFreshness: 'fresh',
    labels: [],
    issueCount: 0,
  },
  {
    id: 'prod-5',
    sku: 'SKU-07721',
    name: 'Cam Vazo Set',
    category: 'Dekorasyon',
    thumbnail: null,
    gtin: '8690123456792',
    brand: 'GlassWorks',
    storeCoverage: { available: 52, total: 52 },
    availabilityBreakdown: { inStock: 50, outOfStock: 0, limited: 2 },
    platforms: { google: 'published', meta: 'published' },
    feedFreshness: 'fresh',
    labels: [],
    issueCount: 0,
  },
  {
    id: 'prod-6',
    sku: 'SKU-33410',
    name: 'Ahşap Kitaplık Raf',
    category: 'Mobilya',
    thumbnail: null,
    gtin: null,
    brand: 'WoodCraft',
    storeCoverage: { available: 18, total: 52 },
    availabilityBreakdown: { inStock: 12, outOfStock: 34, limited: 6 },
    platforms: { google: 'rejected', meta: 'rejected' },
    feedFreshness: 'stale',
    labels: [],
    issueCount: 3,
  },
  {
    id: 'prod-7',
    sku: 'SKU-55102',
    name: 'Paslanmaz Çelik Tencere',
    category: 'Mutfak',
    thumbnail: null,
    gtin: '8690123456793',
    brand: 'SteelPro',
    storeCoverage: { available: 44, total: 52 },
    availabilityBreakdown: { inStock: 40, outOfStock: 8, limited: 4 },
    platforms: { google: 'published', meta: 'pending' },
    feedFreshness: 'fresh',
    labels: [],
    issueCount: 0,
  },
  {
    id: 'prod-8',
    sku: 'SKU-88234',
    name: 'Dekoratif Mum Seti',
    category: 'Dekorasyon',
    thumbnail: null,
    gtin: '8690123456794',
    brand: 'CandleArt',
    storeCoverage: { available: 51, total: 52 },
    availabilityBreakdown: { inStock: 49, outOfStock: 1, limited: 2 },
    platforms: { google: 'published', meta: 'published' },
    feedFreshness: 'fresh',
    labels: [],
    issueCount: 0,
  },
  {
    id: 'prod-9',
    sku: 'SKU-42019',
    name: 'Organik Pamuk Havlu',
    category: 'Banyo',
    thumbnail: null,
    gtin: '8690123456795',
    brand: 'PureCotton',
    storeCoverage: { available: 46, total: 52 },
    availabilityBreakdown: { inStock: 42, outOfStock: 6, limited: 4 },
    platforms: { google: 'published', meta: 'published' },
    feedFreshness: 'fresh',
    labels: [],
    issueCount: 0,
  },
  {
    id: 'prod-10',
    sku: 'SKU-61478',
    name: 'LED Masa Lambası',
    category: 'Aydınlatma',
    thumbnail: null,
    gtin: '8690123456796',
    brand: 'LightUp',
    storeCoverage: { available: 38, total: 52 },
    availabilityBreakdown: { inStock: 30, outOfStock: 14, limited: 8 },
    platforms: { google: 'published', meta: 'not_submitted' },
    feedFreshness: 'degraded',
    labels: [],
    issueCount: 1,
  },
];

// ------------------------------------------------------------------
// Sync Timeline Events (for Feed Activity tab)
// ------------------------------------------------------------------

export const mockSyncTimelineEvents: SyncTimelineEvent[] = [
  {
    id: 1,
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    batchId: 'BATCH-2026-0310-001',
    title: 'Source ingestion completed',
    subtitle: '124,880 SKUs processed from primary feed',
    status: 'success',
    platform: 'source',
  },
  {
    id: 2,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    batchId: 'BATCH-2026-0310-001',
    title: 'Google LIA feed sync',
    subtitle: '124,760 published, 120 rejected',
    status: 'warning',
    platform: 'google',
  },
  {
    id: 3,
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    batchId: 'BATCH-2026-0310-001',
    title: 'Meta Local Inventory sync',
    subtitle: '124,500 published, 380 rejected, 45 pending',
    status: 'warning',
    platform: 'meta',
  },
  {
    id: 4,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    batchId: 'BATCH-2026-0310-002',
    title: 'API delta ingestion',
    subtitle: '342 SKU updates processed',
    status: 'success',
    platform: 'source',
  },
  {
    id: 5,
    timestamp: new Date(Date.now() - 62 * 60 * 1000).toISOString(),
    batchId: 'BATCH-2026-0309-014',
    title: 'Source ingestion completed',
    subtitle: '124,875 SKUs processed from primary feed',
    status: 'success',
    platform: 'source',
  },
  {
    id: 6,
    timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    batchId: 'BATCH-2026-0309-014',
    title: 'Google LIA feed sync',
    subtitle: '124,755 published, 120 rejected',
    status: 'success',
    platform: 'google',
  },
  {
    id: 7,
    timestamp: new Date(Date.now() - 68 * 60 * 1000).toISOString(),
    batchId: 'BATCH-2026-0309-014',
    title: 'Meta Local Inventory sync',
    subtitle: '124,495 published, 380 rejected',
    status: 'success',
    platform: 'meta',
  },
];
