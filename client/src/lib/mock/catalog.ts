import type {
  PlatformSyncStatus,
  CatalogPipelineData,
} from '../types/catalog';

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
    rejectionReasons: [
      {
        id: 'g-r1',
        errorType: 'Geçersiz mağaza kodu',
        errorCode: 'invalid_store_code',
        count: 72,
        description: 'Yerel ürün envanter verinizdeki mağaza kodları geçersiz görünüyor. Hem yerel ürün envanter verilerinizi hem de İşletme Profillerinizi inceleyin.',
      },
      {
        id: 'g-r2',
        errorType: 'Teklif mevcut değil',
        errorCode: 'offer_does_not_exist',
        count: 34,
        description: 'Yerel envanter verisindeki ürün kimliğinin birincil ürün veri akışında eşleşen bir teklifi yok.',
      },
      {
        id: 'g-r3',
        errorType: 'Ürün stok durumu eksik',
        errorCode: 'missing_availability',
        count: 14,
        description: 'Yerel ürün envanter verinizde zorunlu stok durumu özelliği eksik.',
      },
    ],
  },
  {
    platform: 'meta',
    published: 0,
    rejected: 0,
    pending: 0,
    lastSyncAt: '',
    syncStatus: 'setup_required',
    rejectionReasons: [],
  },
];

// ------------------------------------------------------------------
// Catalog Data Service
// ------------------------------------------------------------------

export const catalogDataService = {
  getPipelineData(): CatalogPipelineData {
    return {
      ingestion: {
        connected: true,
        lastReceivedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        itemCount: 124_880,
      },
      statuses: mockPlatformSyncStatuses,
    };
  },
};
