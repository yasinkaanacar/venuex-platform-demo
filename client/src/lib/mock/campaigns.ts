// Mock data for Campaign Performance Table
// This follows the PRD structure with proper typing
// Uses Turkish market data per design environment rules

export type Platform = 'google' | 'meta' | 'tiktok';
export type TrendDirection = 'up' | 'down' | 'stable';
export type CampaignStatus = 'active' | 'paused' | 'ended';
export type AdType = 'image' | 'video' | 'carousel' | 'text';

// Campaign types per platform (matches page-level filter values)
export type CampaignType =
    // Google
    | 'SEARCH' | 'SHOPPING' | 'DISPLAY' | 'VIDEO' | 'PERFORMANCE_MAX' | 'DEMAND_GEN' | 'APP'
    // Meta
    | 'AWARENESS' | 'TRAFFIC' | 'ENGAGEMENT' | 'LEADS' | 'APP_PROMOTION' | 'SALES'
    // TikTok
    | 'REACH' | 'VIDEO_VIEWS' | 'COMMUNITY_INTERACTION' | 'LEAD_GENERATION' | 'CONVERSIONS' | 'PRODUCT_SALES';

// Ad Level
export interface Ad {
    id: string;
    name: string;
    type: AdType;
    dimensions?: string; // e.g., "1080x1080"
    thumbnailUrl?: string;
    spend: number;
    offlineConversions: number;
    offlineRevenue: number;
    // Secondary
    onlineConversions: number;
    clicks: number;
    impressions: number;
}

// Ad Set Level
export interface AdSet {
    id: string;
    name: string;
    spend: number;
    offlineConversions: number;
    offlineRevenue: number;
    // Secondary
    onlineConversions: number;
    onlineRevenue: number;
    impressions: number;
    frequency: number;
    clicks: number;
    // Nested Ads
    ads: Ad[];
}

// Google Ads accounts (MCC sub-accounts)
export interface GoogleAdsAccount {
    id: string;
    name: string;
    customerId: string; // Google Ads Customer ID (xxx-xxx-xxxx)
}

export const googleAdsAccounts: GoogleAdsAccount[] = [
    { id: 'acc-search', name: 'Search', customerId: '912-442-4083' },
    { id: 'acc-shopping', name: 'Shopping', customerId: '936-270-8361' },
    { id: 'acc-display', name: 'Display', customerId: '478-472-5222' },
    { id: 'acc-pmax', name: 'Performance Max', customerId: '359-648-5860' },
    { id: 'acc-video', name: 'Video', customerId: '726-081-5460' },
];

// Campaign Level
export interface Campaign {
    id: string;
    name: string;
    platform: Platform;
    campaignType: CampaignType;
    status: CampaignStatus;
    // Primary
    spend: number;
    offlineConversions: number;
    offlineRevenue: number;
    // Secondary
    onlineConversions: number;
    onlineRevenue: number;
    impressions: number;
    clicks: number;
    // Diagnostic
    matchRate: number;
    // Platform-specific
    storeVisits?: number;
    accountId?: string; // Google Ads account (MCC sub-account)
    // Trend
    roasTrend: TrendDirection;
    lastUpdated: Date;
    // Nested Ad Sets
    adSets: AdSet[];
}

// Calculate derived metrics - Campaign level
export const calcOfflineROAS = (c: { spend: number; offlineRevenue: number }) =>
    c.spend > 0 ? c.offlineRevenue / c.spend : 0;

export const calcCostPerConversion = (c: { spend: number; offlineConversions: number }) =>
    c.offlineConversions > 0 ? c.spend / c.offlineConversions : 0;

export const calcOnlineCostPerConversion = (c: { spend: number; onlineConversions?: number }) =>
    c.onlineConversions && c.onlineConversions > 0 ? c.spend / c.onlineConversions : 0;

export const calcOnlineROAS = (c: { spend: number; onlineRevenue?: number }) =>
    c.spend > 0 && c.onlineRevenue ? c.onlineRevenue / c.spend : 0;

export const calcOmniROAS = (c: { spend: number; offlineRevenue: number; onlineRevenue?: number }) =>
    c.spend > 0 ? (c.offlineRevenue + (c.onlineRevenue || 0)) / c.spend : 0;

export const calcAvgBasketSize = (c: { offlineConversions: number; offlineRevenue: number }) =>
    c.offlineConversions > 0 ? c.offlineRevenue / c.offlineConversions : 0;

export const calcConversionRate = (c: { offlineConversions: number; clicks: number }) =>
    c.clicks > 0 ? (c.offlineConversions / c.clicks) * 100 : 0;

export const calcCTR = (c: { clicks: number; impressions: number }) =>
    c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0;

export const calcCPC = (c: { spend: number; clicks: number }) =>
    c.clicks > 0 ? c.spend / c.clicks : 0;

export const calcCPM = (c: { spend: number; impressions: number }) =>
    c.impressions > 0 ? (c.spend / c.impressions) * 1000 : 0;

export const calcTotalRevenue = (c: { offlineRevenue: number; onlineRevenue?: number }) =>
    c.offlineRevenue + (c.onlineRevenue || 0);

// Campaign type display labels (platform-standard terms, not translated)
export const CAMPAIGN_TYPE_LABELS: Record<string, string> = {
    SEARCH: 'Search',
    SHOPPING: 'Shopping',
    DISPLAY: 'Display',
    VIDEO: 'Video',
    PERFORMANCE_MAX: 'PMax',
    DEMAND_GEN: 'Demand Gen',
    APP: 'App',
    AWARENESS: 'Awareness',
    TRAFFIC: 'Traffic',
    ENGAGEMENT: 'Engagement',
    LEADS: 'Leads',
    APP_PROMOTION: 'App Promo',
    SALES: 'Sales',
    REACH: 'Reach',
    VIDEO_VIEWS: 'Video Views',
    COMMUNITY_INTERACTION: 'Community',
    LEAD_GENERATION: 'Lead Gen',
    CONVERSIONS: 'Conversions',
    PRODUCT_SALES: 'Product Sales',
};

// Mock data with nested Ad Sets and Ads — Turkish market (multi-location retail brand context)
export const mockCampaigns: Campaign[] = [
    {
        id: 'c1',
        name: 'Yaz Koleksiyonu Lansmanı',
        platform: 'google',
        campaignType: 'PERFORMANCE_MAX',
        accountId: 'acc-pmax',
        status: 'active',
        spend: 125000,
        offlineConversions: 1840,
        offlineRevenue: 892000,
        onlineConversions: 620,
        onlineRevenue: 186000,
        impressions: 4200000,
        clicks: 84000,
        matchRate: 78,
        storeVisits: 12400,
        roasTrend: 'up',
        lastUpdated: new Date('2025-02-09T10:00:00'),
        adSets: [
            {
                id: 'as1-1',
                name: 'Kadın 25-34 - Moda İlgi Alanı',
                spend: 45000,
                offlineConversions: 720,
                offlineRevenue: 360000,
                onlineConversions: 280,
                onlineRevenue: 84000,
                impressions: 1080000,
                frequency: 2.8,
                clicks: 32000,
                ads: [
                    { id: 'ad1-1-1', name: 'Yaz Elbise - Yaşam Tarzı', type: 'image', dimensions: '1080x1080', spend: 18000, offlineConversions: 320, offlineRevenue: 160000, onlineConversions: 120, clicks: 14000, impressions: 420000 },
                    { id: 'ad1-1-2', name: 'Plaj Koleksiyonu Video', type: 'video', dimensions: '1920x1080', spend: 15000, offlineConversions: 240, offlineRevenue: 120000, onlineConversions: 95, clicks: 11000, impressions: 380000 },
                    { id: 'ad1-1-3', name: 'Yaz Üstler Carousel', type: 'carousel', spend: 12000, offlineConversions: 160, offlineRevenue: 80000, onlineConversions: 65, clicks: 7000, impressions: 280000 }
                ]
            },
            {
                id: 'as1-2',
                name: 'Kadın 35-44 - Premium Segment',
                spend: 42000,
                offlineConversions: 580,
                offlineRevenue: 348000,
                onlineConversions: 180,
                onlineRevenue: 54000,
                impressions: 960000,
                frequency: 3.2,
                clicks: 28000,
                ads: [
                    { id: 'ad1-2-1', name: 'Keten Koleksiyonu', type: 'image', dimensions: '1080x1350', spend: 22000, offlineConversions: 340, offlineRevenue: 204000, onlineConversions: 110, clicks: 16000, impressions: 520000 },
                    { id: 'ad1-2-2', name: 'Tatil Giyim Promosyon', type: 'video', dimensions: '1080x1920', spend: 20000, offlineConversions: 240, offlineRevenue: 144000, onlineConversions: 70, clicks: 12000, impressions: 440000 }
                ]
            },
            {
                id: 'as1-3',
                name: 'Erkek 25-44 - Günlük Giyim',
                spend: 38000,
                offlineConversions: 540,
                offlineRevenue: 184000,
                onlineConversions: 160,
                onlineRevenue: 48000,
                impressions: 700000,
                frequency: 2.4,
                clicks: 24000,
                ads: [
                    { id: 'ad1-3-1', name: 'Yaz Şort Koleksiyonu', type: 'image', dimensions: '1080x1080', spend: 20000, offlineConversions: 300, offlineRevenue: 102000, onlineConversions: 90, clicks: 14000, impressions: 380000 },
                    { id: 'ad1-3-2', name: 'Plaj Havası Video', type: 'video', dimensions: '1920x1080', spend: 18000, offlineConversions: 240, offlineRevenue: 82000, onlineConversions: 70, clicks: 10000, impressions: 320000 }
                ]
            }
        ]
    },
    {
        id: 'c3',
        name: 'Yeniden Hedefleme - Site Ziyaretçileri',
        platform: 'meta',
        campaignType: 'SALES',
        status: 'active',
        spend: 68000,
        offlineConversions: 1120,
        offlineRevenue: 515200,
        onlineConversions: 890,
        onlineRevenue: 222500,
        impressions: 2100000,
        clicks: 63000,
        matchRate: 82,
        roasTrend: 'up',
        lastUpdated: new Date('2025-02-09T09:15:00'),
        adSets: [
            {
                id: 'as3-1',
                name: 'Ürün Görüntüleyenler - 7 Gün',
                spend: 32000,
                offlineConversions: 580,
                offlineRevenue: 278400,
                onlineConversions: 420,
                onlineRevenue: 105000,
                impressions: 1200000,
                frequency: 4.2,
                clicks: 28000,
                ads: [
                    { id: 'ad3-1-1', name: 'Dinamik Ürün - Carousel', type: 'carousel', spend: 18000, offlineConversions: 340, offlineRevenue: 163200, onlineConversions: 260, clicks: 16000, impressions: 680000 },
                    { id: 'ad3-1-2', name: 'Flaş İndirim Banner', type: 'image', dimensions: '1200x628', spend: 14000, offlineConversions: 240, offlineRevenue: 115200, onlineConversions: 160, clicks: 12000, impressions: 520000 }
                ]
            },
            {
                id: 'as3-2',
                name: 'Sepete Ekleyenler - 14 Gün',
                spend: 36000,
                offlineConversions: 540,
                offlineRevenue: 236800,
                onlineConversions: 470,
                onlineRevenue: 117500,
                impressions: 1300000,
                frequency: 5.8,
                clicks: 35000,
                ads: [
                    { id: 'ad3-2-1', name: 'Alışverişini Tamamla', type: 'image', dimensions: '1080x1080', spend: 20000, offlineConversions: 320, offlineRevenue: 140800, onlineConversions: 280, clicks: 20000, impressions: 720000 },
                    { id: 'ad3-2-2', name: 'Sınırlı Stok Uyarısı', type: 'video', dimensions: '1080x1080', spend: 16000, offlineConversions: 220, offlineRevenue: 96000, onlineConversions: 190, clicks: 15000, impressions: 580000 }
                ]
            }
        ]
    },
    {
        id: 'c4',
        name: 'Benzer Kitle - Yüksek Değerli Müşteriler',
        platform: 'meta',
        campaignType: 'SALES',
        status: 'active',
        spend: 94000,
        offlineConversions: 1560,
        offlineRevenue: 702000,
        onlineConversions: 720,
        onlineRevenue: 180000,
        impressions: 3400000,
        clicks: 68000,
        matchRate: 75,
        roasTrend: 'up',
        lastUpdated: new Date('2025-02-09T11:00:00'),
        adSets: [
            {
                id: 'as4-1',
                name: 'Benzer %1 - En Çok Harcayanlar',
                spend: 38000,
                offlineConversions: 680,
                offlineRevenue: 340000,
                onlineConversions: 320,
                onlineRevenue: 80000,
                impressions: 1160000,
                frequency: 3.1,
                clicks: 28000,
                ads: [
                    { id: 'ad4-1-1', name: 'Premium Koleksiyon', type: 'video', dimensions: '1080x1350', spend: 22000, offlineConversions: 420, offlineRevenue: 210000, onlineConversions: 200, clicks: 17000, impressions: 680000 },
                    { id: 'ad4-1-2', name: 'Özel Teklif', type: 'image', dimensions: '1080x1080', spend: 16000, offlineConversions: 260, offlineRevenue: 130000, onlineConversions: 120, clicks: 11000, impressions: 480000 }
                ]
            },
            {
                id: 'as4-2',
                name: 'Benzer %3 - Sık Alışveriş',
                spend: 32000,
                offlineConversions: 520,
                offlineRevenue: 218400,
                onlineConversions: 240,
                onlineRevenue: 60000,
                impressions: 960000,
                frequency: 2.8,
                clicks: 24000,
                ads: [
                    { id: 'ad4-2-1', name: 'Yeni Gelenler', type: 'carousel', spend: 18000, offlineConversions: 300, offlineRevenue: 126000, onlineConversions: 140, clicks: 14000, impressions: 540000 },
                    { id: 'ad4-2-2', name: 'Mağaza Bulucu CTA', type: 'image', dimensions: '1200x628', spend: 14000, offlineConversions: 220, offlineRevenue: 92400, onlineConversions: 100, clicks: 10000, impressions: 420000 }
                ]
            },
            {
                id: 'as4-3',
                name: 'Benzer %5 - Tüm Müşteriler',
                spend: 24000,
                offlineConversions: 360,
                offlineRevenue: 143600,
                onlineConversions: 160,
                onlineRevenue: 40000,
                impressions: 660000,
                frequency: 2.4,
                clicks: 16000,
                ads: [
                    { id: 'ad4-3-1', name: 'Marka Hikayesi Video', type: 'video', dimensions: '1920x1080', spend: 14000, offlineConversions: 200, offlineRevenue: 80000, onlineConversions: 90, clicks: 9000, impressions: 380000 },
                    { id: 'ad4-3-2', name: 'Hemen Al Banner', type: 'image', dimensions: '1080x1080', spend: 10000, offlineConversions: 160, offlineRevenue: 63600, onlineConversions: 70, clicks: 7000, impressions: 280000 }
                ]
            }
        ]
    },
    {
        id: 'c6',
        name: 'Video Kampanyası - Z Kuşağı',
        platform: 'tiktok',
        campaignType: 'VIDEO_VIEWS',
        status: 'active',
        spend: 45000,
        offlineConversions: 680,
        offlineRevenue: 272000,
        onlineConversions: 520,
        onlineRevenue: 104000,
        impressions: 6800000,
        clicks: 136000,
        matchRate: 64,
        roasTrend: 'up',
        lastUpdated: new Date('2025-02-09T10:30:00'),
        adSets: [
            {
                id: 'as6-1',
                name: 'İlgi Alanı - Moda & Stil',
                spend: 25000,
                offlineConversions: 420,
                offlineRevenue: 168000,
                onlineConversions: 320,
                onlineRevenue: 64000,
                impressions: 4000000,
                frequency: 2.1,
                clicks: 82000,
                ads: [
                    { id: 'ad6-1-1', name: 'OOTD Challenge', type: 'video', dimensions: '1080x1920', spend: 15000, offlineConversions: 280, offlineRevenue: 112000, onlineConversions: 220, clicks: 52000, impressions: 2400000 },
                    { id: 'ad6-1-2', name: 'Deneme Haul Video', type: 'video', dimensions: '1080x1920', spend: 10000, offlineConversions: 140, offlineRevenue: 56000, onlineConversions: 100, clicks: 30000, impressions: 1600000 }
                ]
            },
            {
                id: 'as6-2',
                name: 'Davranış - Alışverişçiler',
                spend: 20000,
                offlineConversions: 260,
                offlineRevenue: 104000,
                onlineConversions: 200,
                onlineRevenue: 40000,
                impressions: 2800000,
                frequency: 1.8,
                clicks: 54000,
                ads: [
                    { id: 'ad6-2-1', name: 'Trend Kombinler', type: 'video', dimensions: '1080x1920', spend: 12000, offlineConversions: 160, offlineRevenue: 64000, onlineConversions: 130, clicks: 34000, impressions: 1800000 },
                    { id: 'ad6-2-2', name: 'Kutu Açılışı Deneyimi', type: 'video', dimensions: '1080x1920', spend: 8000, offlineConversions: 100, offlineRevenue: 40000, onlineConversions: 70, clicks: 20000, impressions: 1000000 }
                ]
            }
        ]
    },
    {
        id: 'c8',
        name: 'Bahar İndirimi Promosyon',
        platform: 'google',
        campaignType: 'SEARCH',
        accountId: 'acc-search',
        status: 'active',
        spend: 156000,
        offlineConversions: 2100,
        offlineRevenue: 1008000,
        onlineConversions: 840,
        onlineRevenue: 252000,
        impressions: 5600000,
        clicks: 112000,
        matchRate: 81,
        storeVisits: 15600,
        roasTrend: 'up',
        lastUpdated: new Date('2025-02-09T11:30:00'),
        adSets: [
            {
                id: 'as8-1',
                name: 'Arama - Marka Terimleri',
                spend: 42000,
                offlineConversions: 620,
                offlineRevenue: 310000,
                onlineConversions: 280,
                onlineRevenue: 84000,
                impressions: 800000,
                frequency: 1.2,
                clicks: 38000,
                ads: [
                    { id: 'ad8-1-1', name: 'Marka + İndirim', type: 'text', spend: 24000, offlineConversions: 380, offlineRevenue: 190000, onlineConversions: 180, clicks: 24000, impressions: 480000 },
                    { id: 'ad8-1-2', name: 'Marka + Mağaza', type: 'text', spend: 18000, offlineConversions: 240, offlineRevenue: 120000, onlineConversions: 100, clicks: 14000, impressions: 320000 }
                ]
            },
            {
                id: 'as8-2',
                name: 'Arama - Genel Terimler',
                spend: 58000,
                offlineConversions: 780,
                offlineRevenue: 358800,
                onlineConversions: 340,
                onlineRevenue: 102000,
                impressions: 1200000,
                frequency: 1.4,
                clicks: 42000,
                ads: [
                    { id: 'ad8-2-1', name: 'Bahar Moda İndirim', type: 'text', spend: 32000, offlineConversions: 460, offlineRevenue: 211600, onlineConversions: 200, clicks: 26000, impressions: 680000 },
                    { id: 'ad8-2-2', name: '2025 Yeni Koleksiyon', type: 'text', spend: 26000, offlineConversions: 320, offlineRevenue: 147200, onlineConversions: 140, clicks: 16000, impressions: 520000 }
                ]
            },
            {
                id: 'as8-3',
                name: 'Display - Remarketing',
                spend: 56000,
                offlineConversions: 700,
                offlineRevenue: 339200,
                onlineConversions: 220,
                onlineRevenue: 66000,
                impressions: 2180000,
                frequency: 4.8,
                clicks: 32000,
                ads: [
                    { id: 'ad8-3-1', name: 'Bahar Banner - Masaüstü', type: 'image', dimensions: '728x90', spend: 28000, offlineConversions: 380, offlineRevenue: 184160, onlineConversions: 120, clicks: 18000, impressions: 1200000 },
                    { id: 'ad8-3-2', name: 'Bahar Banner - Mobil', type: 'image', dimensions: '320x50', spend: 28000, offlineConversions: 320, offlineRevenue: 155040, onlineConversions: 100, clicks: 14000, impressions: 980000 }
                ]
            }
        ]
    },
    // Campaigns without ad sets for simpler display
    {
        id: 'c2',
        name: 'Marka Bilinirliği - Q1',
        platform: 'google',
        campaignType: 'VIDEO',
        accountId: 'acc-video',
        status: 'active',
        spend: 85000,
        offlineConversions: 420,
        offlineRevenue: 168000,
        onlineConversions: 380,
        onlineRevenue: 114000,
        impressions: 8900000,
        clicks: 44500,
        matchRate: 72,
        storeVisits: 8200,
        roasTrend: 'stable',
        lastUpdated: new Date('2025-02-09T08:30:00'),
        adSets: []
    },
    {
        id: 'c5',
        name: 'Dinamik Ürün Reklamları',
        platform: 'meta',
        campaignType: 'SALES',
        status: 'paused',
        spend: 52000,
        offlineConversions: 380,
        offlineRevenue: 133000,
        onlineConversions: 420,
        onlineRevenue: 105000,
        impressions: 1800000,
        clicks: 36000,
        matchRate: 68,
        roasTrend: 'down',
        lastUpdated: new Date('2025-02-08T16:00:00'),
        adSets: []
    },
    {
        id: 'c7',
        name: 'Influencer İş Birliği',
        platform: 'tiktok',
        campaignType: 'TRAFFIC',
        status: 'active',
        spend: 38000,
        offlineConversions: 520,
        offlineRevenue: 187200,
        onlineConversions: 380,
        onlineRevenue: 76000,
        impressions: 4200000,
        clicks: 84000,
        matchRate: 58,
        roasTrend: 'stable',
        lastUpdated: new Date('2025-02-09T07:45:00'),
        adSets: []
    },
    {
        id: 'c9',
        name: 'Sepet Terk Edenler - Remarketing',
        platform: 'meta',
        campaignType: 'SALES',
        status: 'active',
        spend: 28000,
        offlineConversions: 240,
        offlineRevenue: 76800,
        onlineConversions: 320,
        onlineRevenue: 80000,
        impressions: 890000,
        clicks: 17800,
        matchRate: 71,
        roasTrend: 'down',
        lastUpdated: new Date('2025-02-09T09:00:00'),
        adSets: []
    },
    {
        id: 'c10',
        name: 'Ürün Lansmanı - Denim',
        platform: 'tiktok',
        campaignType: 'CONVERSIONS',
        status: 'active',
        spend: 62000,
        offlineConversions: 920,
        offlineRevenue: 368000,
        onlineConversions: 480,
        onlineRevenue: 96000,
        impressions: 7200000,
        clicks: 144000,
        matchRate: 62,
        roasTrend: 'up',
        lastUpdated: new Date('2025-02-09T10:00:00'),
        adSets: []
    }
];
