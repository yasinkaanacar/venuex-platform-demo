import { OverviewData } from '@/lib/types/overview';
import { EnrichmentSuggestion } from '@/../../shared/schema';

// Mock overview data
export const mockOverviewData: OverviewData = {
  kpis: {
    o2oAttribution: {
      value: 4.2,
      change: 12.5,
      past_value: 3.7
    },
    locationListings: {
      value: 23847,
      change: 15.7,
      past_value: 20634
    },
    localInventory: {
      value: 87.5,
      change: 5.3,
      past_value: 82.2
    },
    reviewManagement: {
      value: 4.3,
      change: 4.9, // (4.3 - 4.1) / 4.1 ≈ 4.9%
      past_value: 4.1
    }
  },
  platforms: [
    {
      id: 'google-platform',
      name: 'Google',
      type: 'location',
      status: 'connected',
      lastSync: new Date('2024-03-15T10:30:00Z'),
      accountId: 'google-account-123',
      isActive: true
    },
    {
      id: 'meta-platform',
      name: 'Meta',
      type: 'advertising',
      status: 'connected',
      lastSync: new Date('2024-03-15T10:25:00Z'),
      accountId: 'meta-account-456',
      isActive: true
    },
    {
      id: 'tiktok-platform',
      name: 'TikTok',
      type: 'advertising',
      status: 'connected',
      lastSync: new Date('2024-03-15T10:20:00Z'),
      accountId: 'tiktok-account-789',
      isActive: true
    }
  ],
  locations: [
    {
      id: 'location-1',
      name: 'Istanbul - Beyoğlu',
      address: 'İstiklal Caddesi 125, Beyoğlu, Istanbul',
      platformId: 'google-platform',
      isActive: true,
      coordinates: { lat: 41.0369, lng: 28.9784 }
    },
    {
      id: 'location-2',
      name: 'Ankara - Çankaya',
      address: 'Tunalı Hilmi Caddesi 89, Çankaya, Ankara',
      platformId: 'google-platform',
      isActive: true,
      coordinates: { lat: 39.9208, lng: 32.8541 }
    },
    {
      id: 'location-3',
      name: 'İzmir - Alsancak',
      address: 'Kordon Caddesi 67, Konak, İzmir',
      platformId: 'google-platform',
      isActive: true,
      coordinates: { lat: 38.4361, lng: 27.1518 }
    }
  ],
  campaigns: [
    {
      id: 'campaign-1',
      name: 'Summer Sale 2024',
      platformId: 'google-platform',
      type: 'search',
      status: 'active',
      budget: 15000,
      spent: 12340,
      isActive: true
    },
    {
      id: 'campaign-2',
      name: 'Local Store Promo',
      platformId: 'meta-platform',
      type: 'traffic',
      status: 'active',
      budget: 8000,
      spent: 6750,
      isActive: true
    },
    {
      id: 'campaign-3',
      name: 'Gen Z Store Discovery',
      platformId: 'tiktok-platform',
      type: 'awareness',
      status: 'active',
      budget: 5000,
      spent: 3200,
      isActive: true
    }
  ],
  topLocations: [
    {
      id: 'top-loc-1',
      name: 'Istanbul - Beyoğlu',
      address: 'İstiklal Caddesi 125',
      impressions: 89420,
      directionRequests: 549,
      calls: 276,
      trend: 'up'
    },
    {
      id: 'top-loc-2',
      name: 'Antalya - Muratpaşa',
      address: 'Lara Caddesi 112',
      impressions: 94672,
      directionRequests: 627,
      calls: 298,
      trend: 'up'
    },
    {
      id: 'top-loc-3',
      name: 'İzmir - Alsancak',
      address: 'Kordon Caddesi 67',
      impressions: 82155,
      directionRequests: 559,
      calls: 267,
      trend: 'up'
    },
    {
      id: 'top-loc-4',
      name: 'Ankara - Çankaya',
      address: 'Tunalı Hilmi Caddesi 89',
      impressions: 76230,
      directionRequests: 514,
      calls: 242,
      trend: 'down'
    },
    {
      id: 'top-loc-5',
      name: 'Bursa - Nilüfer',
      address: 'Görükle Mahallesi 45',
      impressions: 71845,
      directionRequests: 486,
      calls: 231,
      trend: 'up'
    }
  ],
  topCampaigns: [
    {
      id: 'top-camp-1',
      name: 'Summer Sale 2024',
      platform: 'google',
      spend: 16350,
      impressions: 142580,
      cr: 3.4,
      omniRoas: 4.2
    },
    {
      id: 'top-camp-2',
      name: 'Local Store Promo',
      platform: 'meta',
      spend: 12840,
      impressions: 89670,
      cr: 4.1,
      omniRoas: 5.1
    },
    {
      id: 'top-camp-3',
      name: 'Store Visit Drive',
      platform: 'meta',
      spend: 18960,
      impressions: 135240,
      cr: 3.7,
      omniRoas: 3.6
    },
    {
      id: 'top-camp-4',
      name: 'Local Shopping Campaign',
      platform: 'google',
      spend: 15420,
      impressions: 118420,
      cr: 2.9,
      omniRoas: 3.8
    },
    {
      id: 'top-camp-5',
      name: 'Gen Z Store Discovery',
      platform: 'tiktok',
      spend: 8920,
      impressions: 78950,
      cr: 2.8,
      omniRoas: 2.9
    }
  ],
  alerts: [
    {
      id: 'alert-1',
      type: 'error',
      title: 'Inventory Sync Failed',
      message: 'Last inventory sync failed 2 hours ago. Store data may be outdated.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      severity: 'high',
      module: '/catalog'
    },
    {
      id: 'alert-2',
      type: 'warning',
      title: 'Campaign Budget Alert',
      message: 'Summer Sale campaign is 85% through daily budget with 6 hours remaining.',
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      isRead: false,
      severity: 'medium',
      module: '/offline-conversions'
    },
    {
      id: 'alert-3',
      type: 'info',
      title: 'New Review Received',
      message: 'Your İzmir location received a 5-star review mentioning excellent customer service.',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isRead: false,
      severity: 'low',
      module: '/reviews'
    }
  ],
  lastSync: new Date().toISOString()
};

// Mock enrichment suggestions
export const mockEnrichmentSuggestions: EnrichmentSuggestion[] = [
  {
    id: 'suggestion-1',
    platformId: 'google-platform',
    type: 'location-data',
    title: 'Add Business Hours',
    description: 'Complete business hours for 3 locations to improve visibility in local search results.',
    impact: 'high',
    estimatedImprovement: '+15% local visibility',
    isImplemented: false,
    createdAt: new Date('2024-03-15T09:00:00Z')
  },
  {
    id: 'suggestion-2',
    platformId: 'meta-platform',
    type: 'audience',
    title: 'Lookalike Audience',
    description: 'Create lookalike audiences based on your high-value store visitors for better targeting.',
    impact: 'high',
    estimatedImprovement: '+22% conversion rate',
    isImplemented: false,
    createdAt: new Date('2024-03-15T08:30:00Z')
  },
  {
    id: 'suggestion-3',
    platformId: 'google-platform',
    type: 'keywords',
    title: 'Local Inventory Ads',
    description: 'Enable local inventory ads to show product availability at nearby stores.',
    impact: 'medium',
    estimatedImprovement: '+12% store visits',
    isImplemented: false,
    createdAt: new Date('2024-03-15T08:00:00Z')
  },
  {
    id: 'suggestion-4',
    platformId: 'tiktok-platform',
    type: 'content',
    title: 'Store Location Videos',
    description: 'Create short videos showcasing each store location to increase local engagement.',
    impact: 'medium',
    estimatedImprovement: '+8% brand awareness',
    isImplemented: true,
    createdAt: new Date('2024-03-14T16:00:00Z')
  }
];

// Simulate API delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Overview-specific data service methods
export const overviewDataService = {
  async getOverviewData(): Promise<OverviewData> {
    await delay(200);
    return mockOverviewData;
  },

  async getEnrichmentSuggestions(platformId?: string): Promise<EnrichmentSuggestion[]> {
    await delay(150);
    if (platformId) {
      return mockEnrichmentSuggestions.filter(s => s.platformId === platformId);
    }
    return mockEnrichmentSuggestions;
  },

  async updateEnrichmentSuggestion(id: string, updates: Partial<EnrichmentSuggestion>): Promise<EnrichmentSuggestion> {
    await delay(100);
    const suggestion = mockEnrichmentSuggestions.find(s => s.id === id);
    if (!suggestion) {
      throw new Error('Suggestion not found');
    }
    Object.assign(suggestion, updates);
    return suggestion;
  },

  async dismissAlert(id: string): Promise<{ success: boolean }> {
    await delay(100);
    const alert = mockOverviewData.alerts.find(a => a.id === id);
    if (alert) {
      alert.isRead = true;
    }
    return { success: true };
  },
};
