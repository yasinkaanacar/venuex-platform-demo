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
        errorType: 'Invalid store code',
        errorCode: 'invalid_store_code',
        count: 72,
        description: 'Store codes in your local product inventory feed appear to be invalid. Review both your local product inventory data and your Business Profiles.',
      },
      {
        id: 'g-r2',
        errorType: 'Offer does not exist',
        errorCode: 'offer_does_not_exist',
        count: 34,
        description: 'Product ID in the local inventory feed has no matching offer in the primary product data feed.',
      },
      {
        id: 'g-r3',
        errorType: 'Missing product availability',
        errorCode: 'missing_availability',
        count: 14,
        description: 'The required availability attribute is missing from your local product inventory feed.',
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
