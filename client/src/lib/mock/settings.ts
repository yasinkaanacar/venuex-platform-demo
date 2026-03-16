import type {
  BusinessProfile,
  ActivityFeedEntry,
  ActivityEventType,
  StoreSet,
  DataSourceConnection,
  FieldMapping,
  CompletionChecklistItem,
} from '@/lib/types/settings';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── Business Profile ───────────────────────────────────────────────────────

export const mockBusinessProfile: BusinessProfile = {
  id: 'bp-karaca-001',
  brandName: 'Karaca',
  businessType: 'Ev ve Yaşam',
  description:
    'Türkiye\'nin önde gelen ev ve yaşam markası olarak 1973\'ten bu yana kaliteli ürünler sunuyoruz. 145 mağaza ile Türkiye\'nin her köşesinde hizmet veriyoruz.',
  logoUrl: null,
  categories: {
    google: ['Home & Garden', 'Kitchenware', 'Tableware'],
    meta: ['Home Decor', 'Kitchen & Dining'],
    apple: ['Home & Garden', 'Kitchen & Dining'],
    yandex: ['Ev & Bahçe', 'Mutfak Eşyaları'],
  },
  contactEmail: 'kurumsal@karaca.com.tr',
  contactPhone: '+90 212 444 5 272',
  website: 'https://www.karaca.com.tr',
  socialMedia: {
    facebook: 'https://www.facebook.com/KaracaTurkiye',
    instagram: 'https://www.instagram.com/karacaturkiye',
    x: 'https://twitter.com/KaracaTurkiye',
    tiktok: 'https://www.tiktok.com/@karacaturkiye',
    youtube: 'https://www.youtube.com/@KaracaTurkiye',
    pinterest: 'https://tr.pinterest.com/karacaturkiye',
    linkedin: 'https://www.linkedin.com/company/karacaturkiye',
  },
  locationCount: 145,
  updatedAt: '2026-02-28T14:30:00Z',
};

// ─── Activity Feed ──────────────────────────────────────────────────────────

export const mockActivityFeed: ActivityFeedEntry[] = [
  // February 28, 2026
  {
    id: 'af-001',
    type: 'settings_change',
    actor: 'Ahmet Yılmaz',
    action: 'İşletme profili güncellendi',
    timestamp: '2026-02-28T14:30:00Z',
    details: {
      field: 'contactPhone',
      oldValue: '+90 212 444 4 444',
      newValue: '+90 212 444 5 272',
    },
  },
  {
    id: 'af-002',
    type: 'data_sync',
    actor: 'Sistem',
    action: 'Satış verisi senkronizasyonu tamamlandı',
    timestamp: '2026-02-28T12:00:00Z',
    details: {
      additionalInfo: '24,500 kayıt işlendi',
    },
  },
  {
    id: 'af-003',
    type: 'location_update',
    actor: 'Elif Demir',
    action: 'Mağaza bilgisi güncellendi',
    timestamp: '2026-02-28T10:15:00Z',
    details: {
      locationName: 'Karaca İstinye Park',
      field: 'workingHours',
      oldValue: '10:00 - 22:00',
      newValue: '09:00 - 22:00',
    },
  },
  // February 27, 2026
  {
    id: 'af-004',
    type: 'review_response',
    actor: 'Mehmet Kaya',
    action: 'Olumsuz yoruma yanıt verildi',
    timestamp: '2026-02-27T10:05:00Z',
    details: {
      locationName: 'Karaca Çamlıca Emaar',
      additionalInfo: '2/5 yıldızlı yorum — SLA içinde yanıtlandı',
    },
  },
  {
    id: 'af-005',
    type: 'store_set_change',
    actor: 'Zeynep Arslan',
    action: 'Mağaza seti oluşturuldu',
    timestamp: '2026-02-27T16:20:00Z',
    details: {
      additionalInfo: '"Pilot Mağazalar" seti 8 mağaza ile oluşturuldu',
    },
  },
  {
    id: 'af-006',
    type: 'user_action',
    actor: 'Ahmet Yılmaz',
    action: 'Yeni kullanıcı davet edildi',
    timestamp: '2026-02-27T15:00:00Z',
    details: {
      additionalInfo: 'elif.demir@karaca.com.tr',
    },
  },
];

// ─── Store Sets ─────────────────────────────────────────────────────────────

export const mockStoreSets: StoreSet[] = [
  {
    id: 'ss-001',
    name: 'İstanbul Avrupa',
    description: 'Avrupa yakasındaki tüm İstanbul mağazaları',
    locationCount: 38,
    locationIds: Array.from({ length: 38 }, (_, i) => `loc-eu-${String(i + 1).padStart(3, '0')}`),
    createdAt: '2025-11-15T09:00:00Z',
    updatedAt: '2026-02-25T17:00:00Z',
  },
  {
    id: 'ss-002',
    name: 'İstanbul Anadolu',
    description: 'Anadolu yakasındaki tüm İstanbul mağazaları',
    locationCount: 24,
    locationIds: Array.from({ length: 24 }, (_, i) => `loc-as-${String(i + 1).padStart(3, '0')}`),
    createdAt: '2025-11-15T09:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z',
  },
  {
    id: 'ss-003',
    name: 'Ankara Mağazaları',
    description: 'Ankara\'daki tüm mağazalar (AVM ve cadde mağazaları dahil)',
    locationCount: 12,
    locationIds: Array.from({ length: 12 }, (_, i) => `loc-ank-${String(i + 1).padStart(3, '0')}`),
    createdAt: '2026-02-24T16:00:00Z',
    updatedAt: '2026-02-24T16:00:00Z',
  },
  {
    id: 'ss-004',
    name: 'AVM Mağazaları',
    description: 'Alışveriş merkezlerindeki tüm mağazalar — yüksek trafik noktaları',
    locationCount: 42,
    locationIds: Array.from({ length: 42 }, (_, i) => `loc-avm-${String(i + 1).padStart(3, '0')}`),
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2026-01-20T11:30:00Z',
  },
  {
    id: 'ss-005',
    name: 'Pilot Mağazalar',
    description: 'Yeni özelliklerin ve kampanyaların test edildiği pilot mağazalar',
    locationCount: 8,
    locationIds: Array.from({ length: 8 }, (_, i) => `loc-pilot-${String(i + 1).padStart(3, '0')}`),
    createdAt: '2026-02-27T16:20:00Z',
    updatedAt: '2026-02-27T16:20:00Z',
  },
];

// ─── Data Sources ────────────────────────────────────────────────────────────

const salesSftpMappings: FieldMapping[] = [
  { id: 'fm-s1-01', sourceColumn: 'transaction_id', venueXField: 'Transaction ID', sampleValue: 'TXN-20260228-00142', mapped: true },
  { id: 'fm-s1-02', sourceColumn: 'store_code', venueXField: 'Store Code', sampleValue: 'IST-AVRP-031', mapped: true },
  { id: 'fm-s1-03', sourceColumn: 'sale_amount', venueXField: 'Sale Amount', sampleValue: '1250.00', mapped: true },
  { id: 'fm-s1-04', sourceColumn: 'sale_date', venueXField: 'Transaction Date', sampleValue: '2026-02-28', mapped: true },
  { id: 'fm-s1-05', sourceColumn: 'product_sku', venueXField: 'Product SKU', sampleValue: 'KRC-CHF-042', mapped: true },
  { id: 'fm-s1-06', sourceColumn: 'quantity', venueXField: 'Quantity', sampleValue: '2', mapped: true },
];

const salesApiMappings: FieldMapping[] = [
  { id: 'fm-s2-01', sourceColumn: 'order_id', venueXField: 'Transaction ID', sampleValue: 'ORD-2026-00891', mapped: true },
  { id: 'fm-s2-02', sourceColumn: 'branch_id', venueXField: 'Store Code', sampleValue: 'ANK-CANK-005', mapped: true },
  { id: 'fm-s2-03', sourceColumn: 'total_price', venueXField: 'Sale Amount', sampleValue: '3400.00', mapped: true },
  { id: 'fm-s2-04', sourceColumn: 'order_datetime', venueXField: 'Transaction Date', sampleValue: '2026-02-27T18:22:00Z', mapped: true },
  { id: 'fm-s2-05', sourceColumn: 'item_code', venueXField: 'Product SKU', sampleValue: 'KRC-PLT-118', mapped: false },
];

const inventorySftpMappings: FieldMapping[] = [
  { id: 'fm-i1-01', sourceColumn: 'store_id', venueXField: 'Store Code', sampleValue: '', mapped: false },
  { id: 'fm-i1-02', sourceColumn: 'product_barcode', venueXField: 'Product SKU', sampleValue: '', mapped: false },
  { id: 'fm-i1-03', sourceColumn: 'stock_qty', venueXField: 'Available Quantity', sampleValue: '', mapped: false },
];

export const mockDataSources: DataSourceConnection[] = [
  {
    id: 'ds-sales-sftp',
    name: 'SFTP',
    type: 'sftp',
    category: 'sales',
    status: 'connected',
    lastSyncAt: '2026-02-28T12:00:00Z',
    recordCount: 24500,
    errorMessage: null,
    fieldMappings: salesSftpMappings,
  },
  {
    id: 'ds-sales-api',
    name: 'API',
    type: 'api',
    category: 'sales',
    status: 'connected',
    lastSyncAt: '2026-02-28T11:45:00Z',
    recordCount: 18200,
    errorMessage: null,
    fieldMappings: salesApiMappings,
  },
  {
    id: 'ds-inventory-sftp',
    name: 'SFTP',
    type: 'sftp',
    category: 'inventory',
    status: 'error',
    lastSyncAt: null,
    recordCount: 0,
    errorMessage: 'Bağlantı zaman aşımı — SFTP sunucusuna ulaşılamadı (timeout after 30s)',
    fieldMappings: inventorySftpMappings,
  },
  {
    id: 'ds-inventory-api',
    name: 'API',
    type: 'api',
    category: 'inventory',
    status: 'pending',
    lastSyncAt: null,
    recordCount: 0,
    errorMessage: null,
    fieldMappings: [],
  },
];

// ─── Completion Checklist ────────────────────────────────────────────────────

export const mockCompletionChecklist: CompletionChecklistItem[] = [
  {
    id: 'cc-01',
    label: 'Temel Bilgiler',
    completed: 5,
    total: 7,
    isComplete: false,
  },
  {
    id: 'cc-02',
    label: 'Sosyal Medya',
    completed: 7,
    total: 7,
    isComplete: true,
  },
  {
    id: 'cc-03',
    label: 'Otomatik Yanıt Şablonları',
    completed: 0,
    total: 5,
    isComplete: false,
  },
];

// ─── Settings Data Service ───────────────────────────────────────────────────

export const settingsDataService = {
  async getBusinessProfile(): Promise<BusinessProfile> {
    await delay(150);
    return { ...mockBusinessProfile };
  },

  async updateBusinessProfile(updates: Partial<BusinessProfile>): Promise<BusinessProfile> {
    await delay(200);
    Object.assign(mockBusinessProfile, updates, { updatedAt: new Date().toISOString() });
    return { ...mockBusinessProfile };
  },

  async getActivityFeed(
    filters?: { type?: ActivityEventType; startDate?: string; endDate?: string }
  ): Promise<ActivityFeedEntry[]> {
    await delay(150);
    let result = [...mockActivityFeed];
    if (filters?.type) {
      result = result.filter((e) => e.type === filters.type);
    }
    if (filters?.startDate) {
      result = result.filter((e) => e.timestamp >= filters.startDate!);
    }
    if (filters?.endDate) {
      result = result.filter((e) => e.timestamp <= filters.endDate!);
    }
    return result;
  },

  async getStoreSets(): Promise<StoreSet[]> {
    await delay(100);
    return [...mockStoreSets];
  },

  async createStoreSet(data: {
    name: string;
    description: string;
    locationIds: string[];
  }): Promise<StoreSet> {
    await delay(200);
    const newSet: StoreSet = {
      id: `ss-${Date.now()}`,
      name: data.name,
      description: data.description,
      locationCount: data.locationIds.length,
      locationIds: data.locationIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockStoreSets.push(newSet);
    return newSet;
  },

  async updateStoreSet(id: string, updates: Partial<StoreSet>): Promise<StoreSet> {
    await delay(200);
    const set = mockStoreSets.find((s) => s.id === id);
    if (!set) throw new Error(`StoreSet ${id} not found`);
    Object.assign(set, updates, { updatedAt: new Date().toISOString() });
    return { ...set };
  },

  async deleteStoreSet(id: string): Promise<{ success: boolean }> {
    await delay(150);
    const index = mockStoreSets.findIndex((s) => s.id === id);
    if (index !== -1) mockStoreSets.splice(index, 1);
    return { success: true };
  },

  async getDataSources(): Promise<DataSourceConnection[]> {
    await delay(100);
    return [...mockDataSources];
  },

  async updateFieldMapping(
    sourceId: string,
    mappingId: string,
    updates: Partial<FieldMapping>
  ): Promise<FieldMapping> {
    await delay(200);
    const source = mockDataSources.find((s) => s.id === sourceId);
    if (!source) throw new Error(`DataSource ${sourceId} not found`);
    const mapping = source.fieldMappings.find((m) => m.id === mappingId);
    if (!mapping) throw new Error(`FieldMapping ${mappingId} not found`);
    Object.assign(mapping, updates);
    return { ...mapping };
  },

  async getCompletionChecklist(): Promise<CompletionChecklistItem[]> {
    await delay(100);
    return [...mockCompletionChecklist];
  },
};
