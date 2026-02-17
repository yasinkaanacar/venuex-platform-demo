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
        autoSync: false,
        lastPushedAt: '2026-02-10T12:00:00Z',
      },
    ],
    createdAt: '2025-12-15T09:00:00Z',
    updatedAt: '2026-02-14T08:00:00Z',
    lastBuiltAt: '2026-02-14T08:00:00Z',
    createdBy: 'Kaan Acar',
    tags: ['rfm', 'vip'],
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
};
