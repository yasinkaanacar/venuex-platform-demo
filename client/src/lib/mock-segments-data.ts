import type {
  Segment,
  SegmentPlatformPush,
  PushLogEntry,
  FeedLabel,
  SegmentExport,
  ScheduledExport,
  SegmentSummaryKPIs,
  SegmentFilters,
  AdPlatform,
  SegmentOverlapResult,
  SegmentExclusionRule,
  MergeStrategy,
  SegmentMergeRecord,
  ReachProjection,
  SegmentAutomationRule,
  LookalikeAudience,
  ABTestConfig,
  SegmentAttribution,
  AttributionTimeseriesPoint,
  SegmentPerformanceSummary,
  SegmentPerformanceDetail,
  PlatformPerformance,
  CampaignPerformance,
  PerformanceTimeseriesPoint,
  PerformancePeriod,
  AttributionConfidence,
} from './types/segments';

// ------------------------------------------------------------------
// Helper
// ------------------------------------------------------------------

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------
// Mock Segments (8)
// ------------------------------------------------------------------

export const mockSegments: Segment[] = [
  {
    id: 'seg-001',
    name: 'Yüksek Harcamalı Müşteriler',
    description: 'Sepet tutarı 2,500 TL üstündeki müşteriler',
    type: 'value',
    status: 'active',
    ruleGroups: [
      {
        id: 'rg-001',
        logic: 'AND',
        rules: [
          { id: 'r-001', dimension: 'basket_amount', operator: 'gte', value: 2500 },
        ],
      },
    ],
    groupLogic: 'AND',
    estimatedSize: 45200,
    actualSize: 43800,
    platformPushes: [
      {
        id: 'pp-001',
        segmentId: 'seg-001',
        platform: 'google',
        status: 'synced',
        matchRate: 78,
        matchedIdentifiers: 34164,
        totalIdentifiers: 43800,
        audienceId: 'google-aud-001',
        audienceName: 'VenueX - High Value Customers',
        activeCampaigns: 4,
        autoSync: true,
        lastPushedAt: '2026-02-14T09:30:00Z',
        nextSyncAt: '2026-02-15T09:30:00Z',
      },
      {
        id: 'pp-002',
        segmentId: 'seg-001',
        platform: 'meta',
        status: 'synced',
        matchRate: 82,
        matchedIdentifiers: 35916,
        totalIdentifiers: 43800,
        audienceId: 'meta-aud-001',
        audienceName: 'VenueX - High Value Customers',
        activeCampaigns: 3,
        autoSync: true,
        lastPushedAt: '2026-02-14T09:35:00Z',
        nextSyncAt: '2026-02-15T09:35:00Z',
      },
    ],
    createdAt: '2025-11-15T10:00:00Z',
    updatedAt: '2026-02-14T09:30:00Z',
    lastBuiltAt: '2026-02-14T09:30:00Z',
    createdBy: 'Kaan Acar',
    tags: ['high-value', 'core'],
    automationRules: [
      { id: 'ar-001', segmentId: 'seg-001', trigger: 'schedule', frequency: 'weekly', action: 'rebuild', isActive: true, lastTriggeredAt: '2026-02-14T02:00:00Z', nextScheduledAt: '2026-02-21T02:00:00Z', createdAt: '2025-12-01T10:00:00Z' },
      { id: 'ar-002', segmentId: 'seg-001', trigger: 'size_threshold', sizeOperator: 'below', sizeValue: 30000, action: 'notify', isActive: true, createdAt: '2025-12-10T10:00:00Z' },
    ],
  },
  {
    id: 'seg-002',
    name: 'Denim Kategorisi Alıcıları',
    description: 'Denim ürün kategorisinden alışveriş yapmış müşteriler',
    type: 'category',
    status: 'active',
    ruleGroups: [
      {
        id: 'rg-002',
        logic: 'AND',
        rules: [
          { id: 'r-002', dimension: 'product_category', operator: 'eq', value: 'Denim' },
        ],
      },
    ],
    groupLogic: 'AND',
    estimatedSize: 29100,
    actualSize: 28400,
    platformPushes: [
      {
        id: 'pp-003',
        segmentId: 'seg-002',
        platform: 'google',
        status: 'synced',
        matchRate: 75,
        matchedIdentifiers: 21300,
        totalIdentifiers: 28400,
        audienceId: 'google-aud-002',
        audienceName: 'VenueX - Denim Buyers',
        activeCampaigns: 2,
        autoSync: true,
        lastPushedAt: '2026-02-13T14:00:00Z',
        nextSyncAt: '2026-02-14T14:00:00Z',
      },
      {
        id: 'pp-004',
        segmentId: 'seg-002',
        platform: 'tiktok',
        status: 'synced',
        matchRate: 62,
        matchedIdentifiers: 17608,
        totalIdentifiers: 28400,
        audienceId: 'tt-aud-001',
        audienceName: 'VenueX - Denim Buyers',
        activeCampaigns: 1,
        autoSync: false,
        lastPushedAt: '2026-02-12T10:00:00Z',
      },
    ],
    createdAt: '2025-12-01T14:00:00Z',
    updatedAt: '2026-02-13T14:00:00Z',
    lastBuiltAt: '2026-02-13T14:00:00Z',
    createdBy: 'Kaan Acar',
    tags: ['category', 'fashion'],
  },
  {
    id: 'seg-003',
    name: 'VIP RFM Segmenti',
    description: 'RFM modeline göre Champions seviyesindeki müşteriler',
    type: 'rfm',
    status: 'active',
    ruleGroups: [
      {
        id: 'rg-003',
        logic: 'AND',
        rules: [
          { id: 'r-003', dimension: 'rfm_segment', operator: 'eq', value: 'champions' },
        ],
      },
    ],
    groupLogic: 'AND',
    estimatedSize: 13000,
    actualSize: 12600,
    platformPushes: [
      {
        id: 'pp-005',
        segmentId: 'seg-003',
        platform: 'google',
        status: 'synced',
        matchRate: 81,
        matchedIdentifiers: 10206,
        totalIdentifiers: 12600,
        audienceId: 'google-aud-003',
        audienceName: 'VenueX - VIP Champions',
        activeCampaigns: 5,
        autoSync: true,
        lastPushedAt: '2026-02-14T08:00:00Z',
        nextSyncAt: '2026-02-15T08:00:00Z',
      },
      {
        id: 'pp-006',
        segmentId: 'seg-003',
        platform: 'meta',
        status: 'synced',
        matchRate: 84,
        matchedIdentifiers: 10584,
        totalIdentifiers: 12600,
        audienceId: 'meta-aud-002',
        audienceName: 'VenueX - VIP Champions',
        activeCampaigns: 3,
        autoSync: true,
        lastPushedAt: '2026-02-14T08:05:00Z',
        nextSyncAt: '2026-02-15T08:05:00Z',
      },
      {
        id: 'pp-007',
        segmentId: 'seg-003',
        platform: 'tiktok',
        status: 'synced',
        matchRate: 58,
        matchedIdentifiers: 7308,
        totalIdentifiers: 12600,
        audienceId: 'tt-aud-002',
        audienceName: 'VenueX - VIP Champions',
        activeCampaigns: 1,
        autoSync: false,
        lastPushedAt: '2026-02-10T12:00:00Z',
      },
    ],
    createdAt: '2025-12-15T09:00:00Z',
    updatedAt: '2026-02-14T08:00:00Z',
    lastBuiltAt: '2026-02-14T08:00:00Z',
    createdBy: 'Kaan Acar',
    tags: ['rfm', 'vip'],
    automationRules: [
      { id: 'ar-003', segmentId: 'seg-003', trigger: 'schedule', frequency: 'daily', action: 'push_refresh', isActive: true, lastTriggeredAt: '2026-02-17T02:00:00Z', nextScheduledAt: '2026-02-18T02:00:00Z', createdAt: '2026-01-05T10:00:00Z' },
      { id: 'ar-004', segmentId: 'seg-003', trigger: 'match_rate_drop', matchRateThreshold: 70, action: 'pause', isActive: true, createdAt: '2026-01-10T10:00:00Z' },
    ],
  },
  {
    id: 'seg-004',
    name: 'İstanbul Mağazaları Müşterileri',
    description: 'İstanbul mağazalarından alışveriş yapmış müşteriler',
    type: 'store',
    status: 'active',
    ruleGroups: [
      {
        id: 'rg-004',
        logic: 'AND',
        rules: [
          { id: 'r-004', dimension: 'store_city', operator: 'eq', value: 'İstanbul' },
        ],
      },
    ],
    groupLogic: 'AND',
    estimatedSize: 70000,
    actualSize: 67800,
    platformPushes: [
      {
        id: 'pp-008',
        segmentId: 'seg-004',
        platform: 'google',
        status: 'synced',
        matchRate: 76,
        matchedIdentifiers: 51528,
        totalIdentifiers: 67800,
        audienceId: 'google-aud-004',
        audienceName: 'VenueX - Istanbul Customers',
        activeCampaigns: 6,
        autoSync: true,
        lastPushedAt: '2026-02-14T07:00:00Z',
        nextSyncAt: '2026-02-15T07:00:00Z',
      },
      {
        id: 'pp-009',
        segmentId: 'seg-004',
        platform: 'meta',
        status: 'synced',
        matchRate: 80,
        matchedIdentifiers: 54240,
        totalIdentifiers: 67800,
        audienceId: 'meta-aud-003',
        audienceName: 'VenueX - Istanbul Customers',
        activeCampaigns: 4,
        autoSync: true,
        lastPushedAt: '2026-02-14T07:05:00Z',
        nextSyncAt: '2026-02-15T07:05:00Z',
      },
    ],
    createdAt: '2026-01-05T11:00:00Z',
    updatedAt: '2026-02-14T07:00:00Z',
    lastBuiltAt: '2026-02-14T07:00:00Z',
    createdBy: 'Kaan Acar',
    tags: ['store', 'istanbul'],
    automationRules: [
      { id: 'ar-005', segmentId: 'seg-004', trigger: 'schedule', frequency: 'weekly', action: 'rebuild', isActive: true, lastTriggeredAt: '2026-02-14T03:00:00Z', nextScheduledAt: '2026-02-21T03:00:00Z', createdAt: '2026-01-15T10:00:00Z' },
    ],
  },
  {
    id: 'seg-005',
    name: 'Yüksek Değerli Denim Alıcıları',
    description: 'Sepet tutarı 1,500 TL üstü ve Denim/Outerwear kategorisi müşterileri',
    type: 'combination',
    status: 'active',
    ruleGroups: [
      {
        id: 'rg-005a',
        logic: 'AND',
        rules: [
          { id: 'r-005a', dimension: 'basket_amount', operator: 'gte', value: 1500 },
        ],
      },
      {
        id: 'rg-005b',
        logic: 'AND',
        rules: [
          { id: 'r-005b', dimension: 'product_category', operator: 'in', value: ['Denim', 'Outerwear'] },
        ],
      },
    ],
    groupLogic: 'AND',
    estimatedSize: 9200,
    actualSize: 8900,
    platformPushes: [
      {
        id: 'pp-010',
        segmentId: 'seg-005',
        platform: 'meta',
        status: 'synced',
        matchRate: 79,
        matchedIdentifiers: 7031,
        totalIdentifiers: 8900,
        audienceId: 'meta-aud-004',
        audienceName: 'VenueX - High Value Denim',
        activeCampaigns: 2,
        autoSync: true,
        lastPushedAt: '2026-02-13T16:00:00Z',
        nextSyncAt: '2026-02-14T16:00:00Z',
      },
    ],
    createdAt: '2026-01-10T13:00:00Z',
    updatedAt: '2026-02-13T16:00:00Z',
    lastBuiltAt: '2026-02-13T16:00:00Z',
    createdBy: 'Kaan Acar',
    tags: ['combination', 'high-value', 'fashion'],
  },
  {
    id: 'seg-006',
    name: 'Sık Alım Yapanlar',
    description: 'Son 90 günde 5 ve üzeri alışveriş yapmış müşteriler',
    type: 'rfm',
    status: 'building',
    ruleGroups: [
      {
        id: 'rg-006',
        logic: 'AND',
        rules: [
          { id: 'r-006', dimension: 'purchase_frequency', operator: 'gte', value: 5 },
        ],
      },
    ],
    groupLogic: 'AND',
    estimatedSize: 22100,
    platformPushes: [],
    createdAt: '2026-02-14T15:00:00Z',
    updatedAt: '2026-02-14T15:00:00Z',
    createdBy: 'Kaan Acar',
    tags: ['rfm', 'frequency'],
  },
  {
    id: 'seg-007',
    name: 'Ankara & İzmir Müşterileri',
    description: 'Ankara ve İzmir mağazalarından alışveriş yapmış müşteriler',
    type: 'store',
    status: 'draft',
    ruleGroups: [
      {
        id: 'rg-007',
        logic: 'OR',
        rules: [
          { id: 'r-007a', dimension: 'store_city', operator: 'eq', value: 'Ankara' },
          { id: 'r-007b', dimension: 'store_city', operator: 'eq', value: 'İzmir' },
        ],
      },
    ],
    groupLogic: 'AND',
    estimatedSize: 31500,
    platformPushes: [],
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
    createdBy: 'Kaan Acar',
    tags: ['store', 'regional'],
  },
  {
    id: 'seg-008',
    name: 'Çapraz Satış Adayları',
    description: 'Yüksek parasal değer ve son 30 gün içinde alışveriş yapmış müşteriler',
    type: 'combination',
    status: 'paused',
    ruleGroups: [
      {
        id: 'rg-008a',
        logic: 'AND',
        rules: [
          { id: 'r-008a', dimension: 'monetary_score', operator: 'gte', value: 7 },
        ],
      },
      {
        id: 'rg-008b',
        logic: 'AND',
        rules: [
          { id: 'r-008b', dimension: 'purchase_recency_days', operator: 'lte', value: 30 },
        ],
      },
    ],
    groupLogic: 'AND',
    estimatedSize: 15200,
    actualSize: 14800,
    platformPushes: [
      {
        id: 'pp-011',
        segmentId: 'seg-008',
        platform: 'google',
        status: 'pending',
        matchRate: 0,
        matchedIdentifiers: 0,
        totalIdentifiers: 14800,
        activeCampaigns: 0,
        autoSync: false,
      },
    ],
    createdAt: '2026-01-20T09:00:00Z',
    updatedAt: '2026-02-10T12:00:00Z',
    lastBuiltAt: '2026-02-10T12:00:00Z',
    createdBy: 'Kaan Acar',
    tags: ['combination', 'cross-sell'],
  },
];

// ------------------------------------------------------------------
// Mock Push Log
// ------------------------------------------------------------------

export const mockPushLog: PushLogEntry[] = [
  {
    id: 'pl-001',
    segmentId: 'seg-001',
    segmentName: 'Yüksek Harcamalı Müşteriler',
    platform: 'google',
    action: 'sync',
    status: 'success',
    matchRate: 78,
    identifierCount: 43800,
    timestamp: '2026-02-14T09:30:00Z',
    details: 'Günlük otomatik senkronizasyon tamamlandı',
  },
  {
    id: 'pl-002',
    segmentId: 'seg-001',
    segmentName: 'Yüksek Harcamalı Müşteriler',
    platform: 'meta',
    action: 'sync',
    status: 'success',
    matchRate: 82,
    identifierCount: 43800,
    timestamp: '2026-02-14T09:35:00Z',
    details: 'Günlük otomatik senkronizasyon tamamlandı',
  },
  {
    id: 'pl-003',
    segmentId: 'seg-003',
    segmentName: 'VIP RFM Segmenti',
    platform: 'google',
    action: 'sync',
    status: 'success',
    matchRate: 81,
    identifierCount: 12600,
    timestamp: '2026-02-14T08:00:00Z',
  },
  {
    id: 'pl-004',
    segmentId: 'seg-003',
    segmentName: 'VIP RFM Segmenti',
    platform: 'meta',
    action: 'sync',
    status: 'success',
    matchRate: 84,
    identifierCount: 12600,
    timestamp: '2026-02-14T08:05:00Z',
  },
  {
    id: 'pl-005',
    segmentId: 'seg-004',
    segmentName: 'İstanbul Mağazaları Müşterileri',
    platform: 'google',
    action: 'push',
    status: 'success',
    matchRate: 76,
    identifierCount: 67800,
    timestamp: '2026-02-14T07:00:00Z',
    details: 'İlk audience push işlemi',
  },
  {
    id: 'pl-006',
    segmentId: 'seg-002',
    segmentName: 'Denim Kategorisi Alıcıları',
    platform: 'tiktok',
    action: 'push',
    status: 'partial',
    matchRate: 62,
    identifierCount: 28400,
    timestamp: '2026-02-12T10:00:00Z',
    details: 'Düşük eşleşme oranı — TikTok kullanıcı tabanı sınırlı',
  },
  {
    id: 'pl-007',
    segmentId: 'seg-005',
    segmentName: 'Yüksek Değerli Denim Alıcıları',
    platform: 'meta',
    action: 'sync',
    status: 'success',
    matchRate: 79,
    identifierCount: 8900,
    timestamp: '2026-02-13T16:00:00Z',
  },
  {
    id: 'pl-008',
    segmentId: 'seg-003',
    segmentName: 'VIP RFM Segmenti',
    platform: 'tiktok',
    action: 'push',
    status: 'failed',
    matchRate: 0,
    identifierCount: 12600,
    timestamp: '2026-02-09T14:00:00Z',
    details: 'TikTok API zaman aşımı — yeniden deneme planlandı',
  },
  {
    id: 'pl-009',
    segmentId: 'seg-003',
    segmentName: 'VIP RFM Segmenti',
    platform: 'tiktok',
    action: 'push',
    status: 'success',
    matchRate: 58,
    identifierCount: 12600,
    timestamp: '2026-02-10T12:00:00Z',
    details: 'Yeniden deneme başarılı',
  },
];

// ------------------------------------------------------------------
// Mock Feed Labels (4)
// ------------------------------------------------------------------

export const mockFeedLabels: FeedLabel[] = [
  {
    id: 'fl-001',
    name: 'Offline Bestseller',
    labelKey: 'custom_label_0',
    type: 'offline_bestseller',
    description: 'Son 30 günde en çok offline satış yapan ürünler',
    segmentIds: ['seg-001', 'seg-003'],
    channels: ['gmc', 'meta_catalog'],
    affectedProductCount: 1240,
    totalProductCount: 8500,
    isActive: true,
    gmcSlotIndex: 0,
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-02-14T02:00:00Z',
  },
  {
    id: 'fl-002',
    name: 'High Value Category',
    labelKey: 'custom_label_1',
    type: 'high_value_category',
    description: 'Yüksek sepet ortalamasına sahip kategorideki ürünler',
    segmentIds: ['seg-002'],
    channels: ['gmc'],
    affectedProductCount: 680,
    totalProductCount: 8500,
    isActive: true,
    gmcSlotIndex: 1,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-02-14T02:00:00Z',
  },
  {
    id: 'fl-003',
    name: 'Store Performer',
    labelKey: 'custom_label_2',
    type: 'store_performer',
    description: 'Belirli mağazalarda ortalamanın üstünde satan ürünler',
    segmentIds: ['seg-004'],
    channels: ['gmc', 'meta_catalog'],
    affectedProductCount: 2100,
    totalProductCount: 8500,
    isActive: true,
    gmcSlotIndex: 2,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-02-14T02:00:00Z',
  },
  {
    id: 'fl-004',
    name: 'Cross-Sell Candidate',
    labelKey: 'custom_label_3',
    type: 'cross_sell_candidate',
    description: 'Yüksek değerli sepetlerde sıkça birlikte alınan ürünler',
    segmentIds: ['seg-008'],
    channels: ['meta_catalog'],
    affectedProductCount: 420,
    totalProductCount: 8500,
    isActive: false,
    gmcSlotIndex: 3,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-10T02:00:00Z',
  },
];

// ------------------------------------------------------------------
// Mock Exports (3)
// ------------------------------------------------------------------

export const mockExports: SegmentExport[] = [
  {
    id: 'exp-001',
    name: 'Yüksek Değerli Müşteriler Export',
    segmentIds: ['seg-001'],
    segmentNames: ['Yüksek Harcamalı Müşteriler'],
    format: 'csv',
    status: 'completed',
    recordCount: 43800,
    fileSize: '12.4 MB',
    downloadUrl: '#',
    createdAt: '2026-02-14T10:00:00Z',
    completedAt: '2026-02-14T10:02:15Z',
  },
  {
    id: 'exp-002',
    name: 'VIP + Denim Kombine Export',
    segmentIds: ['seg-003', 'seg-002'],
    segmentNames: ['VIP RFM Segmenti', 'Denim Kategorisi Alıcıları'],
    format: 'csv',
    status: 'completed',
    recordCount: 39400,
    fileSize: '10.8 MB',
    downloadUrl: '#',
    createdAt: '2026-02-12T14:00:00Z',
    completedAt: '2026-02-12T14:01:45Z',
  },
  {
    id: 'exp-003',
    name: 'İstanbul Mağaza Müşterileri Export',
    segmentIds: ['seg-004'],
    segmentNames: ['İstanbul Mağazaları Müşterileri'],
    format: 'csv',
    status: 'completed',
    recordCount: 67800,
    fileSize: '18.2 MB',
    downloadUrl: '#',
    createdAt: '2026-02-10T09:00:00Z',
    completedAt: '2026-02-10T09:03:30Z',
  },
];

// ------------------------------------------------------------------
// Mock Scheduled Exports (1)
// ------------------------------------------------------------------

export const mockScheduledExports: ScheduledExport[] = [
  {
    id: 'sexp-001',
    name: 'Haftalık Tam Segment Export',
    segmentIds: ['seg-001', 'seg-002', 'seg-003'],
    segmentNames: [
      'Yüksek Harcamalı Müşteriler',
      'Denim Kategorisi Alıcıları',
      'VIP RFM Segmenti',
    ],
    format: 'csv',
    frequency: 'weekly',
    destination: {
      type: 'sftp',
      host: 'sftp.client-data.com',
      port: 22,
      username: 'venuex_export',
      remotePath: '/data/segments/',
    },
    isActive: true,
    lastRunAt: '2026-02-10T02:00:00Z',
    nextRunAt: '2026-02-17T02:00:00Z',
    createdAt: '2026-01-15T10:00:00Z',
  },
];

// ------------------------------------------------------------------
// Helpers: Filter & Paginate
// ------------------------------------------------------------------

export function filterSegments(
  segments: Segment[],
  filters: SegmentFilters,
): Segment[] {
  let result = [...segments];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q),
    );
  }

  if (filters.types.length > 0) {
    result = result.filter((s) => filters.types.includes(s.type));
  }

  if (filters.statuses.length > 0) {
    result = result.filter((s) => filters.statuses.includes(s.status));
  }

  if (filters.platforms.length > 0) {
    result = result.filter((s) =>
      s.platformPushes.some((pp) => filters.platforms.includes(pp.platform)),
    );
  }

  return result;
}

export function calcSegmentSummary(segments: Segment[]): SegmentSummaryKPIs {
  const activeSegments = segments.filter((s) => s.status === 'active');
  const allPushes = segments.flatMap((s) => s.platformPushes);
  const syncedPushes = allPushes.filter((p) => p.status === 'synced');

  return {
    totalSegments: segments.length,
    totalAudienceSize: segments.reduce(
      (acc, s) => acc + (s.actualSize ?? s.estimatedSize),
      0,
    ),
    activePlatformPushes: syncedPushes.length,
    activeLabels: mockFeedLabels.filter((l) => l.isActive).length,
    avgMatchRate:
      syncedPushes.length > 0
        ? Math.round(
            syncedPushes.reduce((acc, p) => acc + p.matchRate, 0) /
              syncedPushes.length,
          )
        : 0,
  };
}

// ------------------------------------------------------------------
// Mock Data Service
// ------------------------------------------------------------------

export const segmentDataService = {
  async getSegments(filters?: SegmentFilters): Promise<Segment[]> {
    await delay(150);
    if (filters) return filterSegments(mockSegments, filters);
    return mockSegments;
  },

  async getSegmentById(id: string): Promise<Segment | undefined> {
    await delay(100);
    return mockSegments.find((s) => s.id === id);
  },

  async createSegment(data: Partial<Segment>): Promise<Segment> {
    await delay(200);
    const newSegment: Segment = {
      id: `seg-${String(mockSegments.length + 1).padStart(3, '0')}`,
      name: data.name ?? 'New Segment',
      description: data.description ?? '',
      type: data.type ?? 'value',
      status: 'building',
      ruleGroups: data.ruleGroups ?? [],
      groupLogic: data.groupLogic ?? 'AND',
      estimatedSize: data.estimatedSize ?? 0,
      platformPushes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Kaan Acar',
      tags: data.tags ?? [],
    };
    mockSegments.push(newSegment);
    return newSegment;
  },

  async updateSegment(
    id: string,
    updates: Partial<Segment>,
  ): Promise<Segment> {
    await delay(150);
    const segment = mockSegments.find((s) => s.id === id);
    if (!segment) throw new Error('Segment not found');
    Object.assign(segment, updates, { updatedAt: new Date().toISOString() });
    return segment;
  },

  async deleteSegment(id: string): Promise<{ success: boolean }> {
    await delay(100);
    const idx = mockSegments.findIndex((s) => s.id === id);
    if (idx >= 0) mockSegments.splice(idx, 1);
    return { success: true };
  },

  async getSegmentSummary(): Promise<SegmentSummaryKPIs> {
    await delay(100);
    return calcSegmentSummary(mockSegments);
  },

  async pushSegmentToPlatform(
    segmentId: string,
    platform: AdPlatform,
  ): Promise<SegmentPlatformPush> {
    await delay(300);
    const segment = mockSegments.find((s) => s.id === segmentId);
    if (!segment) throw new Error('Segment not found');

    const matchRates: Record<AdPlatform, number> = {
      google: 76,
      meta: 81,
      tiktok: 61,
    };

    const size = segment.actualSize ?? segment.estimatedSize;
    const matchRate = matchRates[platform];
    const push: SegmentPlatformPush = {
      id: `pp-${Date.now()}`,
      segmentId,
      platform,
      status: 'synced',
      matchRate,
      matchedIdentifiers: Math.round(size * (matchRate / 100)),
      totalIdentifiers: size,
      audienceId: `${platform}-aud-${Date.now()}`,
      audienceName: `VenueX - ${segment.name}`,
      activeCampaigns: 0,
      autoSync: false,
      lastPushedAt: new Date().toISOString(),
    };

    segment.platformPushes.push(push);
    return push;
  },

  async getPushLog(): Promise<PushLogEntry[]> {
    await delay(100);
    return mockPushLog;
  },

  async getFeedLabels(): Promise<FeedLabel[]> {
    await delay(100);
    return mockFeedLabels;
  },

  async createFeedLabel(data: Partial<FeedLabel>): Promise<FeedLabel> {
    await delay(150);
    const label: FeedLabel = {
      id: `fl-${String(mockFeedLabels.length + 1).padStart(3, '0')}`,
      name: data.name ?? 'New Label',
      labelKey: data.labelKey ?? `custom_label_${mockFeedLabels.length}`,
      type: data.type ?? 'custom',
      description: data.description ?? '',
      segmentIds: data.segmentIds ?? [],
      channels: data.channels ?? ['gmc'],
      affectedProductCount: data.affectedProductCount ?? 0,
      totalProductCount: 8500,
      isActive: true,
      gmcSlotIndex: data.gmcSlotIndex,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockFeedLabels.push(label);
    return label;
  },

  async updateFeedLabel(
    id: string,
    updates: Partial<FeedLabel>,
  ): Promise<FeedLabel> {
    await delay(100);
    const label = mockFeedLabels.find((l) => l.id === id);
    if (!label) throw new Error('Feed label not found');
    Object.assign(label, updates, { updatedAt: new Date().toISOString() });
    return label;
  },

  async getExports(): Promise<SegmentExport[]> {
    await delay(100);
    return mockExports;
  },

  async createExport(
    data: Partial<SegmentExport>,
  ): Promise<SegmentExport> {
    await delay(200);
    const exp: SegmentExport = {
      id: `exp-${String(mockExports.length + 1).padStart(3, '0')}`,
      name: data.name ?? 'New Export',
      segmentIds: data.segmentIds ?? [],
      segmentNames: data.segmentNames ?? [],
      format: data.format ?? 'csv',
      status: 'completed',
      recordCount: data.recordCount ?? 0,
      fileSize: data.fileSize ?? '0 MB',
      downloadUrl: '#',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    mockExports.push(exp);
    return exp;
  },

  async getScheduledExports(): Promise<ScheduledExport[]> {
    await delay(100);
    return mockScheduledExports;
  },

  async createScheduledExport(
    data: Partial<ScheduledExport>,
  ): Promise<ScheduledExport> {
    await delay(150);
    const sexp: ScheduledExport = {
      id: `sexp-${String(mockScheduledExports.length + 1).padStart(3, '0')}`,
      name: data.name ?? 'New Scheduled Export',
      segmentIds: data.segmentIds ?? [],
      segmentNames: data.segmentNames ?? [],
      format: data.format ?? 'csv',
      frequency: data.frequency ?? 'weekly',
      destination: data.destination ?? {
        type: 'sftp',
        host: '',
        port: 22,
        username: '',
        remotePath: '/',
      },
      isActive: true,
      nextRunAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      createdAt: new Date().toISOString(),
    };
    mockScheduledExports.push(sexp);
    return sexp;
  },

  async updateScheduledExport(
    id: string,
    data: Partial<ScheduledExport>,
  ): Promise<ScheduledExport> {
    await delay(150);
    const index = mockScheduledExports.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Scheduled export not found');
    const existing = mockScheduledExports[index];
    const updated: ScheduledExport = {
      ...existing,
      name: data.name ?? existing.name,
      segmentIds: data.segmentIds ?? existing.segmentIds,
      segmentNames: data.segmentNames ?? existing.segmentNames,
      format: data.format ?? existing.format,
      frequency: data.frequency ?? existing.frequency,
      destination: data.destination ?? existing.destination,
      isActive: data.isActive ?? existing.isActive,
    };
    mockScheduledExports[index] = updated;
    return updated;
  },

  async deleteScheduledExport(id: string): Promise<void> {
    await delay(100);
    const index = mockScheduledExports.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockScheduledExports.splice(index, 1);
    }
  },

  // ----------------------------------------------------------------
  // Feature 1: Overlap Analysis
  // ----------------------------------------------------------------

  async getTopOverlaps(): Promise<SegmentOverlapResult[]> {
    await delay(200);
    return mockOverlaps;
  },

  // ----------------------------------------------------------------
  // Feature 2: Reach / Cost Projection
  // ----------------------------------------------------------------

  async getReachProjection(
    segmentId: string,
    platform: AdPlatform,
  ): Promise<ReachProjection> {
    await delay(100);
    const segment = mockSegments.find((s) => s.id === segmentId);
    if (!segment) throw new Error('Segment not found');

    const size = segment.actualSize ?? segment.estimatedSize;
    const matchRates: Record<AdPlatform, number> = { google: 76, meta: 81, tiktok: 61 };
    const cpms: Record<AdPlatform, number> = { google: 52, meta: 42, tiktok: 31 };

    const existingPush = segment.platformPushes.find((p) => p.platform === platform);
    const matchRate = existingPush?.matchRate ?? matchRates[platform];
    const reach = Math.round(size * (matchRate / 100));
    const impressions = reach * 3.5;
    const monthlySpend = Math.round((impressions / 1000) * cpms[platform]);

    return {
      platform,
      segmentSize: size,
      estimatedMatchRate: matchRate,
      estimatedReach: reach,
      estimatedCPM: cpms[platform],
      estimatedMonthlySpend: monthlySpend,
      confidenceLevel: existingPush ? 'high' : 'medium',
    };
  },

  // ----------------------------------------------------------------
  // Feature 3: Lifecycle Automation
  // ----------------------------------------------------------------

  async getAutomationRules(segmentId: string): Promise<SegmentAutomationRule[]> {
    await delay(100);
    const segment = mockSegments.find((s) => s.id === segmentId);
    return segment?.automationRules ?? [];
  },

  async createAutomationRule(
    segmentId: string,
    data: Partial<SegmentAutomationRule>,
  ): Promise<SegmentAutomationRule> {
    await delay(150);
    const segment = mockSegments.find((s) => s.id === segmentId);
    if (!segment) throw new Error('Segment not found');

    const rule: SegmentAutomationRule = {
      id: `ar-${Date.now()}`,
      segmentId,
      trigger: data.trigger ?? 'schedule',
      frequency: data.frequency,
      sizeOperator: data.sizeOperator,
      sizeValue: data.sizeValue,
      matchRateThreshold: data.matchRateThreshold,
      action: data.action ?? 'rebuild',
      isActive: true,
      nextScheduledAt: data.trigger === 'schedule'
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        : undefined,
      createdAt: new Date().toISOString(),
    };

    if (!segment.automationRules) segment.automationRules = [];
    segment.automationRules.push(rule);
    return rule;
  },

  async toggleAutomationRule(
    segmentId: string,
    ruleId: string,
    isActive: boolean,
  ): Promise<SegmentAutomationRule> {
    await delay(100);
    const segment = mockSegments.find((s) => s.id === segmentId);
    const rule = segment?.automationRules?.find((r) => r.id === ruleId);
    if (!rule) throw new Error('Rule not found');
    rule.isActive = isActive;
    return rule;
  },

  // ----------------------------------------------------------------
  // Feature 4: Lookalike & A/B
  // ----------------------------------------------------------------

  async getLookalikeAudiences(): Promise<LookalikeAudience[]> {
    await delay(100);
    return mockLookalikes;
  },

  async createLookalikeAudience(data: Partial<LookalikeAudience>): Promise<LookalikeAudience> {
    await delay(250);
    const la: LookalikeAudience = {
      id: `la-${Date.now()}`,
      sourceSegmentId: data.sourceSegmentId ?? '',
      sourceSegmentName: data.sourceSegmentName ?? '',
      platform: data.platform ?? 'google',
      name: data.name ?? `Lookalike - ${data.sourceSegmentName}`,
      expansionPercent: data.expansionPercent ?? 3,
      estimatedSize: data.estimatedSize ?? 1000000,
      status: 'building',
      createdAt: new Date().toISOString(),
    };
    mockLookalikes.push(la);
    return la;
  },

  async getABTests(): Promise<ABTestConfig[]> {
    await delay(100);
    return mockABTests;
  },

  async createABTest(data: Partial<ABTestConfig>): Promise<ABTestConfig> {
    await delay(200);
    const test: ABTestConfig = {
      id: `ab-${Date.now()}`,
      name: data.name ?? 'New A/B Test',
      sourceSegmentId: data.sourceSegmentId ?? '',
      sourceSegmentName: data.sourceSegmentName ?? '',
      platform: data.platform ?? 'google',
      splitPercentage: data.splitPercentage ?? 50,
      groupA: data.groupA ?? { name: 'Control', size: 0 },
      groupB: data.groupB ?? { name: 'Test', size: 0 },
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    mockABTests.push(test);
    return test;
  },

  // ----------------------------------------------------------------
  // Feature 5: ROI Attribution
  // ----------------------------------------------------------------

  async getSegmentAttributions(): Promise<SegmentAttribution[]> {
    await delay(200);
    return mockAttributions;
  },

  async getAttributionTimeseries(segmentId: string): Promise<AttributionTimeseriesPoint[]> {
    await delay(150);
    return mockAttributionTimeseries[segmentId] ?? [];
  },

  // ----------------------------------------------------------------
  // Feature 6: Performance Tracking
  // ----------------------------------------------------------------

  async getPerformanceSummaries(): Promise<SegmentPerformanceSummary[]> {
    await delay(100);
    return mockPerformanceSummaries;
  },

  async getPerformanceDetail(segmentId: string, period: PerformancePeriod): Promise<SegmentPerformanceDetail | null> {
    await delay(200);
    return buildPerformanceDetail(segmentId, period);
  },

  // ----------------------------------------------------------------
  // Insights Actions: Exclude & Merge
  // ----------------------------------------------------------------

  async createExclusionRule(data: {
    sourceSegmentId: string;
    sourceSegmentName: string;
    excludedSegmentId: string;
    excludedSegmentName: string;
    platforms: AdPlatform[];
    overlapCount: number;
    estimatedSavings: number;
  }): Promise<SegmentExclusionRule> {
    await delay(300);
    const rule: SegmentExclusionRule = {
      id: `excl-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    mockExclusionRules.push(rule);
    return rule;
  },

  async mergeSegments(data: {
    segmentAId: string;
    segmentAName: string;
    segmentBId: string;
    segmentBName: string;
    strategy: MergeStrategy;
    newSegmentName: string;
    pauseOriginals: boolean;
    overlapCount: number;
    sizeA: number;
    sizeB: number;
  }): Promise<{ mergeRecord: SegmentMergeRecord; newSegment: Segment }> {
    await delay(400);

    const resultingSize =
      data.strategy === 'union'
        ? data.sizeA + data.sizeB - data.overlapCount
        : data.overlapCount;

    const newSegment = await this.createSegment({
      name: data.newSegmentName,
      description: `Merged from ${data.segmentAName} & ${data.segmentBName} (${data.strategy})`,
      type: 'value',
      estimatedSize: resultingSize,
      tags: ['merged'],
    });

    if (data.pauseOriginals) {
      await this.updateSegment(data.segmentAId, { status: 'paused' });
      await this.updateSegment(data.segmentBId, { status: 'paused' });
    }

    const record: SegmentMergeRecord = {
      id: `merge-${Date.now()}`,
      sourceSegmentAId: data.segmentAId,
      sourceSegmentAName: data.segmentAName,
      sourceSegmentBId: data.segmentBId,
      sourceSegmentBName: data.segmentBName,
      strategy: data.strategy,
      newSegmentId: newSegment.id,
      newSegmentName: newSegment.name,
      resultingSize,
      pausedOriginals: data.pauseOriginals,
      createdAt: new Date().toISOString(),
    };
    mockMergeRecords.push(record);

    return { mergeRecord: record, newSegment };
  },
};

// ------------------------------------------------------------------
// Mock Overlap Data (Feature 1)
// ------------------------------------------------------------------

export const mockOverlaps: SegmentOverlapResult[] = [
  {
    segmentA: { id: 'seg-001', name: 'Yüksek Harcamalı Müşteriler', size: 43800 },
    segmentB: { id: 'seg-003', name: 'VIP RFM Segmenti', size: 12600 },
    overlapCount: 9800,
    overlapPercent: 21,
    onlyA: 34000,
    onlyB: 2800,
    unionSize: 46600,
    jaccardIndex: 0.21,
    recommendation: 'exclude',
    wastedSpendEstimate: 28400,
  },
  {
    segmentA: { id: 'seg-001', name: 'Yüksek Harcamalı Müşteriler', size: 43800 },
    segmentB: { id: 'seg-005', name: 'Yüksek Değerli Denim Alıcıları', size: 8900 },
    overlapCount: 7200,
    overlapPercent: 16,
    onlyA: 36600,
    onlyB: 1700,
    unionSize: 45500,
    jaccardIndex: 0.16,
    recommendation: 'merge',
    wastedSpendEstimate: 21100,
  },
  {
    segmentA: { id: 'seg-002', name: 'Denim Kategorisi Alıcıları', size: 28400 },
    segmentB: { id: 'seg-005', name: 'Yüksek Değerli Denim Alıcıları', size: 8900 },
    overlapCount: 6100,
    overlapPercent: 20,
    onlyA: 22300,
    onlyB: 2800,
    unionSize: 31200,
    jaccardIndex: 0.20,
    recommendation: 'exclude',
    wastedSpendEstimate: 18200,
  },
  {
    segmentA: { id: 'seg-001', name: 'Yüksek Harcamalı Müşteriler', size: 43800 },
    segmentB: { id: 'seg-004', name: 'İstanbul Mağazaları Müşterileri', size: 67800 },
    overlapCount: 18400,
    overlapPercent: 20,
    onlyA: 25400,
    onlyB: 49400,
    unionSize: 93200,
    jaccardIndex: 0.20,
    recommendation: 'ok',
    wastedSpendEstimate: 12800,
  },
  {
    segmentA: { id: 'seg-003', name: 'VIP RFM Segmenti', size: 12600 },
    segmentB: { id: 'seg-004', name: 'İstanbul Mağazaları Müşterileri', size: 67800 },
    overlapCount: 8900,
    overlapPercent: 12,
    onlyA: 3700,
    onlyB: 58900,
    unionSize: 71500,
    jaccardIndex: 0.12,
    recommendation: 'ok',
    wastedSpendEstimate: 8100,
  },
];

// ------------------------------------------------------------------
// In-memory stores for Exclude & Merge actions
// ------------------------------------------------------------------

const mockExclusionRules: SegmentExclusionRule[] = [];
const mockMergeRecords: SegmentMergeRecord[] = [];

// ------------------------------------------------------------------
// Mock Lookalike Audiences (Feature 4)
// ------------------------------------------------------------------

export const mockLookalikes: LookalikeAudience[] = [
  { id: 'la-001', sourceSegmentId: 'seg-001', sourceSegmentName: 'Yüksek Harcamalı Müşteriler', platform: 'google', name: 'Lookalike - Yüksek Harcamalı - Google 3%', expansionPercent: 3, estimatedSize: 1200000, status: 'active', createdAt: '2026-01-20T10:00:00Z' },
  { id: 'la-002', sourceSegmentId: 'seg-001', sourceSegmentName: 'Yüksek Harcamalı Müşteriler', platform: 'meta', name: 'Lookalike - Yüksek Harcamalı - Meta 5%', expansionPercent: 5, estimatedSize: 2100000, status: 'active', createdAt: '2026-01-22T10:00:00Z' },
  { id: 'la-003', sourceSegmentId: 'seg-003', sourceSegmentName: 'VIP RFM Segmenti', platform: 'google', name: 'Lookalike - VIP RFM - Google 2%', expansionPercent: 2, estimatedSize: 850000, status: 'building', createdAt: '2026-02-15T10:00:00Z' },
  { id: 'la-004', sourceSegmentId: 'seg-003', sourceSegmentName: 'VIP RFM Segmenti', platform: 'meta', name: 'Lookalike - VIP RFM - Meta 3%', expansionPercent: 3, estimatedSize: 1400000, status: 'active', createdAt: '2026-02-01T10:00:00Z' },
  { id: 'la-005', sourceSegmentId: 'seg-002', sourceSegmentName: 'Denim Kategorisi Alıcıları', platform: 'tiktok', name: 'Lookalike - Denim Alıcıları - TikTok 5%', expansionPercent: 5, estimatedSize: 1800000, status: 'active', createdAt: '2026-02-05T10:00:00Z' },
];

// ------------------------------------------------------------------
// Mock A/B Tests (Feature 4)
// ------------------------------------------------------------------

export const mockABTests: ABTestConfig[] = [
  {
    id: 'ab-001',
    name: 'Yüksek Harcamalı - Reklam Testi',
    sourceSegmentId: 'seg-001',
    sourceSegmentName: 'Yüksek Harcamalı Müşteriler',
    platform: 'google',
    splitPercentage: 50,
    groupA: { name: 'Kontrol', size: 21900 },
    groupB: { name: 'Test Varyantı', size: 21900 },
    status: 'active',
    createdAt: '2026-02-10T10:00:00Z',
  },
];

// ------------------------------------------------------------------
// Mock Attribution Data (Feature 5)
// ------------------------------------------------------------------

export const mockAttributions: SegmentAttribution[] = [
  {
    segmentId: 'seg-001',
    segmentName: 'Yüksek Harcamalı Müşteriler',
    segmentSize: 43800,
    platforms: [
      { platform: 'google', adSpend: 98000, offlineRevenue: 485000, onlineRevenue: 168000, offlineConversions: 1120, matchRate: 78, offlineROAS: 4.95, campaigns: 4 },
      { platform: 'meta', adSpend: 87000, offlineRevenue: 407000, onlineRevenue: 144000, offlineConversions: 940, matchRate: 82, offlineROAS: 4.68, campaigns: 3 },
    ],
    totals: { adSpend: 185000, offlineRevenue: 892000, onlineRevenue: 312000, totalRevenue: 1204000, offlineConversions: 2060, totalConversions: 2840, offlineROAS: 4.82, omniROAS: 6.51, costPerConversion: 65 },
    trend: { revenueChange: 12.4, roasChange: 5.2, conversionsChange: 8.7 },
  },
  {
    segmentId: 'seg-002',
    segmentName: 'Denim Kategorisi Alıcıları',
    segmentSize: 28400,
    platforms: [
      { platform: 'google', adSpend: 62000, offlineRevenue: 268000, onlineRevenue: 118000, offlineConversions: 720, matchRate: 75, offlineROAS: 4.32, campaigns: 2 },
      { platform: 'tiktok', adSpend: 36000, offlineRevenue: 157000, onlineRevenue: 68000, offlineConversions: 380, matchRate: 62, offlineROAS: 4.36, campaigns: 1 },
    ],
    totals: { adSpend: 98000, offlineRevenue: 425000, onlineRevenue: 186000, totalRevenue: 611000, offlineConversions: 1100, totalConversions: 1520, offlineROAS: 4.34, omniROAS: 6.23, costPerConversion: 64 },
    trend: { revenueChange: 8.1, roasChange: 3.4, conversionsChange: 6.2 },
  },
  {
    segmentId: 'seg-003',
    segmentName: 'VIP RFM Segmenti',
    segmentSize: 12600,
    platforms: [
      { platform: 'google', adSpend: 78000, offlineRevenue: 680000, onlineRevenue: 228000, offlineConversions: 890, matchRate: 81, offlineROAS: 8.72, campaigns: 5 },
      { platform: 'meta', adSpend: 52000, offlineRevenue: 420000, onlineRevenue: 148000, offlineConversions: 560, matchRate: 84, offlineROAS: 8.08, campaigns: 3 },
      { platform: 'tiktok', adSpend: 15000, offlineRevenue: 140000, onlineRevenue: 42000, offlineConversions: 180, matchRate: 58, offlineROAS: 9.33, campaigns: 1 },
    ],
    totals: { adSpend: 145000, offlineRevenue: 1240000, onlineRevenue: 418000, totalRevenue: 1658000, offlineConversions: 1630, totalConversions: 2180, offlineROAS: 8.55, omniROAS: 11.43, costPerConversion: 67 },
    trend: { revenueChange: 18.6, roasChange: 9.1, conversionsChange: 14.3 },
  },
  {
    segmentId: 'seg-004',
    segmentName: 'İstanbul Mağazaları Müşterileri',
    segmentSize: 67800,
    platforms: [
      { platform: 'google', adSpend: 125000, offlineRevenue: 448000, onlineRevenue: 172000, offlineConversions: 1380, matchRate: 76, offlineROAS: 3.58, campaigns: 6 },
      { platform: 'meta', adSpend: 85000, offlineRevenue: 300000, onlineRevenue: 112000, offlineConversions: 920, matchRate: 80, offlineROAS: 3.53, campaigns: 4 },
    ],
    totals: { adSpend: 210000, offlineRevenue: 748000, onlineRevenue: 284000, totalRevenue: 1032000, offlineConversions: 2300, totalConversions: 3100, offlineROAS: 3.56, omniROAS: 4.91, costPerConversion: 68 },
    trend: { revenueChange: 6.3, roasChange: -1.2, conversionsChange: 4.8 },
  },
  {
    segmentId: 'seg-005',
    segmentName: 'Yüksek Değerli Denim Alıcıları',
    segmentSize: 8900,
    platforms: [
      { platform: 'meta', adSpend: 62000, offlineRevenue: 345000, onlineRevenue: 128000, offlineConversions: 780, matchRate: 79, offlineROAS: 5.56, campaigns: 2 },
    ],
    totals: { adSpend: 62000, offlineRevenue: 345000, onlineRevenue: 128000, totalRevenue: 473000, offlineConversions: 780, totalConversions: 1060, offlineROAS: 5.56, omniROAS: 7.63, costPerConversion: 58 },
    trend: { revenueChange: 15.2, roasChange: 7.8, conversionsChange: 11.4 },
  },
];

// ------------------------------------------------------------------
// Mock Attribution Timeseries (Feature 5) — 30 days per segment
// ------------------------------------------------------------------

function generateTimeseries(
  baseSpend: number,
  baseOfflineRev: number,
  baseOnlineRev: number,
  baseConv: number,
): AttributionTimeseriesPoint[] {
  const points: AttributionTimeseriesPoint[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(2026, 1, i + 1);
    const dayOfWeek = date.getDay();
    // Weekdays are higher, weekends lower
    const weekdayMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.1;
    // Slight upward trend
    const trendMultiplier = 1 + (i * 0.005);
    // Random jitter ±15%
    const jitter = () => 0.85 + Math.random() * 0.3;

    const dailySpend = Math.round((baseSpend / 30) * weekdayMultiplier * trendMultiplier * jitter());
    const dailyOffRev = Math.round((baseOfflineRev / 30) * weekdayMultiplier * trendMultiplier * jitter());
    const dailyOnRev = Math.round((baseOnlineRev / 30) * weekdayMultiplier * trendMultiplier * jitter());
    const dailyConv = Math.round((baseConv / 30) * weekdayMultiplier * trendMultiplier * jitter());

    points.push({
      date: `2026-02-${String(i + 1).padStart(2, '0')}`,
      adSpend: dailySpend,
      offlineRevenue: dailyOffRev,
      onlineRevenue: dailyOnRev,
      conversions: dailyConv,
    });
  }
  return points;
}

export const mockAttributionTimeseries: Record<string, AttributionTimeseriesPoint[]> = {
  'seg-001': generateTimeseries(185000, 892000, 312000, 2840),
  'seg-002': generateTimeseries(98000, 425000, 186000, 1520),
  'seg-003': generateTimeseries(145000, 1240000, 418000, 2180),
  'seg-004': generateTimeseries(210000, 748000, 284000, 3100),
  'seg-005': generateTimeseries(62000, 345000, 128000, 1060),
};

// ------------------------------------------------------------------
// Mock Performance Summaries (Feature 6)
// ------------------------------------------------------------------

export const mockPerformanceSummaries: SegmentPerformanceSummary[] = [
  { segmentId: 'seg-001', totalSpend: 185000, conversions: 2840, roas: 6.51, confidence: 'direct' },
  { segmentId: 'seg-002', totalSpend: 98000, conversions: 1520, roas: 6.23, confidence: 'estimated' },
  { segmentId: 'seg-003', totalSpend: 145000, conversions: 2180, roas: 11.43, confidence: 'direct' },
  { segmentId: 'seg-004', totalSpend: 210000, conversions: 3100, roas: 4.91, confidence: 'estimated' },
  { segmentId: 'seg-005', totalSpend: 62000, conversions: 1060, roas: 7.63, confidence: 'direct' },
];

// ------------------------------------------------------------------
// Mock Campaigns by Segment (Feature 6)
// ------------------------------------------------------------------

const mockCampaignsBySegment: Record<string, CampaignPerformance[]> = {
  'seg-001': [
    { id: 'cp-001', platform: 'google', campaignName: 'Yüksek Değer - Arama', entityType: 'campaign', spend: 42000, conversions: 680, roas: 7.2, confidence: 'direct' },
    { id: 'cp-002', platform: 'google', campaignName: 'Yüksek Değer - PMax', entityType: 'campaign', spend: 56000, conversions: 840, roas: 6.1, confidence: 'direct' },
    { id: 'cp-003', platform: 'meta', campaignName: 'Retargeting - Yüksek Sepet', entityType: 'ad_set', spend: 38000, conversions: 520, roas: 5.8, confidence: 'estimated' },
    { id: 'cp-004', platform: 'meta', campaignName: 'Lookalike - VIP Müşteriler', entityType: 'ad_set', spend: 49000, conversions: 800, roas: 6.9, confidence: 'estimated' },
  ],
  'seg-002': [
    { id: 'cp-005', platform: 'google', campaignName: 'Denim Koleksiyon - Arama', entityType: 'campaign', spend: 62000, conversions: 720, roas: 6.2, confidence: 'direct' },
    { id: 'cp-006', platform: 'tiktok', campaignName: 'Retargeting - Denim', entityType: 'ad_group', spend: 36000, conversions: 380, roas: 6.3, confidence: 'estimated' },
  ],
  'seg-003': [
    { id: 'cp-007', platform: 'google', campaignName: 'VIP Champions - Arama', entityType: 'campaign', spend: 32000, conversions: 380, roas: 10.2, confidence: 'direct' },
    { id: 'cp-008', platform: 'google', campaignName: 'VIP Champions - Alışveriş', entityType: 'campaign', spend: 28000, conversions: 310, roas: 9.8, confidence: 'direct' },
    { id: 'cp-009', platform: 'google', campaignName: 'VIP Champions - PMax', entityType: 'campaign', spend: 18000, conversions: 200, roas: 8.4, confidence: 'direct' },
    { id: 'cp-010', platform: 'meta', campaignName: 'VIP Retargeting - DPA', entityType: 'ad_set', spend: 28000, conversions: 320, roas: 9.1, confidence: 'estimated' },
    { id: 'cp-011', platform: 'meta', campaignName: 'VIP Lookalike - Geniş', entityType: 'ad_set', spend: 24000, conversions: 240, roas: 7.2, confidence: 'estimated' },
    { id: 'cp-012', platform: 'tiktok', campaignName: 'VIP Tanıtım - TikTok', entityType: 'ad_group', spend: 15000, conversions: 180, roas: 12.1, confidence: 'estimated' },
  ],
  'seg-004': [
    { id: 'cp-013', platform: 'google', campaignName: 'İstanbul - Yerel Arama', entityType: 'campaign', spend: 65000, conversions: 780, roas: 3.8, confidence: 'direct' },
    { id: 'cp-014', platform: 'google', campaignName: 'İstanbul - Yerel PMax', entityType: 'campaign', spend: 60000, conversions: 600, roas: 3.3, confidence: 'estimated' },
    { id: 'cp-015', platform: 'meta', campaignName: 'İstanbul - Mağaza Trafiği', entityType: 'ad_set', spend: 50000, conversions: 540, roas: 3.6, confidence: 'estimated' },
    { id: 'cp-016', platform: 'meta', campaignName: 'İstanbul - Retargeting', entityType: 'ad_set', spend: 35000, conversions: 380, roas: 3.5, confidence: 'estimated' },
  ],
  'seg-005': [
    { id: 'cp-017', platform: 'meta', campaignName: 'Denim Premium - DPA', entityType: 'ad_set', spend: 34000, conversions: 440, roas: 8.1, confidence: 'direct' },
    { id: 'cp-018', platform: 'meta', campaignName: 'Denim Premium - Retargeting', entityType: 'ad_set', spend: 28000, conversions: 340, roas: 7.0, confidence: 'estimated' },
  ],
};

// ------------------------------------------------------------------
// Performance Timeseries Generator (Feature 6)
// ------------------------------------------------------------------

function generatePerformanceTimeseries(
  platforms: AdPlatform[],
  baseSpends: Record<string, number>,
  baseConversions: Record<string, number>,
  days: number,
): PerformanceTimeseriesPoint[] {
  const points: PerformanceTimeseriesPoint[] = [];
  const today = new Date(2026, 1, 23);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const weekdayMult = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1.1;
    const trendMult = 1 + ((days - i) * 0.003);
    const jitter = () => 0.85 + Math.random() * 0.3;

    let totalSpend = 0;
    let totalConv = 0;
    let totalRevenue = 0;
    const platformData: Record<string, { spend: number; conversions: number; roas: number }> = {};

    for (const p of platforms) {
      const dailySpend = Math.round((baseSpends[p] / days) * weekdayMult * trendMult * jitter());
      const dailyConv = Math.round((baseConversions[p] / days) * weekdayMult * trendMult * jitter());
      const dailyRev = Math.round(dailySpend * (3.5 + Math.random() * 2));
      totalSpend += dailySpend;
      totalConv += dailyConv;
      totalRevenue += dailyRev;
      platformData[p] = {
        spend: dailySpend,
        conversions: dailyConv,
        roas: dailySpend > 0 ? +(dailyRev / dailySpend).toFixed(2) : 0,
      };
    }

    points.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      spend: totalSpend,
      conversions: totalConv,
      roas: totalSpend > 0 ? +(totalRevenue / totalSpend).toFixed(2) : 0,
      ...(platformData.google ? { google: platformData.google } : {}),
      ...(platformData.meta ? { meta: platformData.meta } : {}),
      ...(platformData.tiktok ? { tiktok: platformData.tiktok } : {}),
    });
  }
  return points;
}

function buildPerformanceDetail(segmentId: string, period: PerformancePeriod): SegmentPerformanceDetail | null {
  const attribution = mockAttributions.find(a => a.segmentId === segmentId);
  if (!attribution) return null;

  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const periodMultiplier = days / 30;

  const platforms: PlatformPerformance[] = attribution.platforms.map(p => ({
    platform: p.platform,
    spend: Math.round(p.adSpend * periodMultiplier),
    conversions: Math.round(p.offlineConversions * periodMultiplier),
    revenue: Math.round((p.offlineRevenue + p.onlineRevenue) * periodMultiplier),
    roas: p.offlineROAS,
    matchRate: p.matchRate,
    confidence: (p.platform === 'google' ? 'direct' : 'estimated') as AttributionConfidence,
    trend: {
      spendChange: +(Math.random() * 10 - 2).toFixed(1),
      conversionsChange: +(Math.random() * 12 - 1).toFixed(1),
      roasChange: +(Math.random() * 8 - 2).toFixed(1),
    },
  }));

  const campaignsRaw = mockCampaignsBySegment[segmentId] ?? [];
  const campaigns: CampaignPerformance[] = campaignsRaw.map(c => ({
    ...c,
    spend: Math.round(c.spend * periodMultiplier),
    conversions: Math.round(c.conversions * periodMultiplier),
  }));

  const baseSpends: Record<string, number> = {};
  const baseConversions: Record<string, number> = {};
  for (const p of attribution.platforms) {
    baseSpends[p.platform] = Math.round(p.adSpend * periodMultiplier);
    baseConversions[p.platform] = Math.round(p.offlineConversions * periodMultiplier);
  }

  const timeseries = generatePerformanceTimeseries(
    attribution.platforms.map(p => p.platform),
    baseSpends,
    baseConversions,
    days,
  );

  return { segmentId, period, platforms, campaigns, timeseries };
}
