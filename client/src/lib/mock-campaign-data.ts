// Mock data for Campaign Performance Table
// This follows the PRD structure with proper typing

export type Platform = 'google' | 'meta' | 'tiktok';
export type TrendDirection = 'up' | 'down' | 'stable';
export type CampaignStatus = 'active' | 'paused' | 'ended';
export type AdType = 'image' | 'video' | 'carousel' | 'text';

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
    frequency: number;
    clicks: number;
    // Nested Ads
    ads: Ad[];
}

// Campaign Level
export interface Campaign {
    id: string;
    name: string;
    platform: Platform;
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

export const calcOnlineROAS = (c: { spend: number; onlineRevenue?: number }) =>
    c.spend > 0 && c.onlineRevenue ? c.onlineRevenue / c.spend : 0;

export const calcOmniROAS = (c: { spend: number; offlineRevenue: number; onlineRevenue?: number }) =>
    c.spend > 0 ? (c.offlineRevenue + (c.onlineRevenue || 0)) / c.spend : 0;

export const calcAvgBasketSize = (c: { offlineConversions: number; offlineRevenue: number }) =>
    c.offlineConversions > 0 ? c.offlineRevenue / c.offlineConversions : 0;

export const calcConversionRate = (c: { offlineConversions: number; clicks: number }) =>
    c.clicks > 0 ? (c.offlineConversions / c.clicks) * 100 : 0;

// Mock data with nested Ad Sets and Ads
export const mockCampaigns: Campaign[] = [
    {
        id: 'c1',
        name: 'Summer Collection Launch',
        platform: 'google',
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
                name: 'Women 25-34 - Fashion Interest',
                spend: 45000,
                offlineConversions: 720,
                offlineRevenue: 360000,
                onlineConversions: 280,
                frequency: 2.8,
                clicks: 32000,
                ads: [
                    { id: 'ad1-1-1', name: 'Summer Dress - Lifestyle', type: 'image', dimensions: '1080x1080', spend: 18000, offlineConversions: 320, offlineRevenue: 160000, onlineConversions: 120, clicks: 14000, impressions: 420000 },
                    { id: 'ad1-1-2', name: 'Beach Collection Video', type: 'video', dimensions: '1920x1080', spend: 15000, offlineConversions: 240, offlineRevenue: 120000, onlineConversions: 95, clicks: 11000, impressions: 380000 },
                    { id: 'ad1-1-3', name: 'Summer Carousel - Tops', type: 'carousel', spend: 12000, offlineConversions: 160, offlineRevenue: 80000, onlineConversions: 65, clicks: 7000, impressions: 280000 }
                ]
            },
            {
                id: 'as1-2',
                name: 'Women 35-44 - Premium',
                spend: 42000,
                offlineConversions: 580,
                offlineRevenue: 348000,
                onlineConversions: 180,
                frequency: 3.2,
                clicks: 28000,
                ads: [
                    { id: 'ad1-2-1', name: 'Linen Collection', type: 'image', dimensions: '1080x1350', spend: 22000, offlineConversions: 340, offlineRevenue: 204000, onlineConversions: 110, clicks: 16000, impressions: 520000 },
                    { id: 'ad1-2-2', name: 'Resort Wear Promo', type: 'video', dimensions: '1080x1920', spend: 20000, offlineConversions: 240, offlineRevenue: 144000, onlineConversions: 70, clicks: 12000, impressions: 440000 }
                ]
            },
            {
                id: 'as1-3',
                name: 'Men 25-44 - Casual',
                spend: 38000,
                offlineConversions: 540,
                offlineRevenue: 184000,
                onlineConversions: 160,
                frequency: 2.4,
                clicks: 24000,
                ads: [
                    { id: 'ad1-3-1', name: 'Summer Shorts Collection', type: 'image', dimensions: '1080x1080', spend: 20000, offlineConversions: 300, offlineRevenue: 102000, onlineConversions: 90, clicks: 14000, impressions: 380000 },
                    { id: 'ad1-3-2', name: 'Beach Vibes Video', type: 'video', dimensions: '1920x1080', spend: 18000, offlineConversions: 240, offlineRevenue: 82000, onlineConversions: 70, clicks: 10000, impressions: 320000 }
                ]
            }
        ]
    },
    {
        id: 'c3',
        name: 'Retargeting - Website Visitors',
        platform: 'meta',
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
                name: 'Viewed Product - 7 Days',
                spend: 32000,
                offlineConversions: 580,
                offlineRevenue: 278400,
                onlineConversions: 420,
                frequency: 4.2,
                clicks: 28000,
                ads: [
                    { id: 'ad3-1-1', name: 'Dynamic Product - Carousel', type: 'carousel', spend: 18000, offlineConversions: 340, offlineRevenue: 163200, onlineConversions: 260, clicks: 16000, impressions: 680000 },
                    { id: 'ad3-1-2', name: 'Flash Sale Banner', type: 'image', dimensions: '1200x628', spend: 14000, offlineConversions: 240, offlineRevenue: 115200, onlineConversions: 160, clicks: 12000, impressions: 520000 }
                ]
            },
            {
                id: 'as3-2',
                name: 'Added to Cart - 14 Days',
                spend: 36000,
                offlineConversions: 540,
                offlineRevenue: 236800,
                onlineConversions: 470,
                frequency: 5.8,
                clicks: 35000,
                ads: [
                    { id: 'ad3-2-1', name: 'Complete Your Purchase', type: 'image', dimensions: '1080x1080', spend: 20000, offlineConversions: 320, offlineRevenue: 140800, onlineConversions: 280, clicks: 20000, impressions: 720000 },
                    { id: 'ad3-2-2', name: 'Limited Stock Alert', type: 'video', dimensions: '1080x1080', spend: 16000, offlineConversions: 220, offlineRevenue: 96000, onlineConversions: 190, clicks: 15000, impressions: 580000 }
                ]
            }
        ]
    },
    {
        id: 'c4',
        name: 'Lookalike - High Value Customers',
        platform: 'meta',
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
                name: 'LAL 1% - Top Spenders',
                spend: 38000,
                offlineConversions: 680,
                offlineRevenue: 340000,
                onlineConversions: 320,
                frequency: 3.1,
                clicks: 28000,
                ads: [
                    { id: 'ad4-1-1', name: 'Premium Collection', type: 'video', dimensions: '1080x1350', spend: 22000, offlineConversions: 420, offlineRevenue: 210000, onlineConversions: 200, clicks: 17000, impressions: 680000 },
                    { id: 'ad4-1-2', name: 'Exclusive Offer', type: 'image', dimensions: '1080x1080', spend: 16000, offlineConversions: 260, offlineRevenue: 130000, onlineConversions: 120, clicks: 11000, impressions: 480000 }
                ]
            },
            {
                id: 'as4-2',
                name: 'LAL 3% - Frequent Buyers',
                spend: 32000,
                offlineConversions: 520,
                offlineRevenue: 218400,
                onlineConversions: 240,
                frequency: 2.8,
                clicks: 24000,
                ads: [
                    { id: 'ad4-2-1', name: 'New Arrivals', type: 'carousel', spend: 18000, offlineConversions: 300, offlineRevenue: 126000, onlineConversions: 140, clicks: 14000, impressions: 540000 },
                    { id: 'ad4-2-2', name: 'Store Locator CTA', type: 'image', dimensions: '1200x628', spend: 14000, offlineConversions: 220, offlineRevenue: 92400, onlineConversions: 100, clicks: 10000, impressions: 420000 }
                ]
            },
            {
                id: 'as4-3',
                name: 'LAL 5% - All Customers',
                spend: 24000,
                offlineConversions: 360,
                offlineRevenue: 143600,
                onlineConversions: 160,
                frequency: 2.4,
                clicks: 16000,
                ads: [
                    { id: 'ad4-3-1', name: 'Brand Story Video', type: 'video', dimensions: '1920x1080', spend: 14000, offlineConversions: 200, offlineRevenue: 80000, onlineConversions: 90, clicks: 9000, impressions: 380000 },
                    { id: 'ad4-3-2', name: 'Shop Now Banner', type: 'image', dimensions: '1080x1080', spend: 10000, offlineConversions: 160, offlineRevenue: 63600, onlineConversions: 70, clicks: 7000, impressions: 280000 }
                ]
            }
        ]
    },
    {
        id: 'c6',
        name: 'Video Campaign - Gen Z',
        platform: 'tiktok',
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
                name: 'Interest - Fashion & Style',
                spend: 25000,
                offlineConversions: 420,
                offlineRevenue: 168000,
                onlineConversions: 320,
                frequency: 2.1,
                clicks: 82000,
                ads: [
                    { id: 'ad6-1-1', name: 'OOTD Challenge', type: 'video', dimensions: '1080x1920', spend: 15000, offlineConversions: 280, offlineRevenue: 112000, onlineConversions: 220, clicks: 52000, impressions: 2400000 },
                    { id: 'ad6-1-2', name: 'Try-On Haul', type: 'video', dimensions: '1080x1920', spend: 10000, offlineConversions: 140, offlineRevenue: 56000, onlineConversions: 100, clicks: 30000, impressions: 1600000 }
                ]
            },
            {
                id: 'as6-2',
                name: 'Behavior - Shoppers',
                spend: 20000,
                offlineConversions: 260,
                offlineRevenue: 104000,
                onlineConversions: 200,
                frequency: 1.8,
                clicks: 54000,
                ads: [
                    { id: 'ad6-2-1', name: 'Trending Fits', type: 'video', dimensions: '1080x1920', spend: 12000, offlineConversions: 160, offlineRevenue: 64000, onlineConversions: 130, clicks: 34000, impressions: 1800000 },
                    { id: 'ad6-2-2', name: 'Unboxing Experience', type: 'video', dimensions: '1080x1920', spend: 8000, offlineConversions: 100, offlineRevenue: 40000, onlineConversions: 70, clicks: 20000, impressions: 1000000 }
                ]
            }
        ]
    },
    {
        id: 'c8',
        name: 'Spring Sale Promo',
        platform: 'google',
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
                name: 'Search - Brand Terms',
                spend: 42000,
                offlineConversions: 620,
                offlineRevenue: 310000,
                onlineConversions: 280,
                frequency: 1.2,
                clicks: 38000,
                ads: [
                    { id: 'ad8-1-1', name: 'Brand + Sale', type: 'text', spend: 24000, offlineConversions: 380, offlineRevenue: 190000, onlineConversions: 180, clicks: 24000, impressions: 480000 },
                    { id: 'ad8-1-2', name: 'Brand + Store', type: 'text', spend: 18000, offlineConversions: 240, offlineRevenue: 120000, onlineConversions: 100, clicks: 14000, impressions: 320000 }
                ]
            },
            {
                id: 'as8-2',
                name: 'Search - Generic Terms',
                spend: 58000,
                offlineConversions: 780,
                offlineRevenue: 358800,
                onlineConversions: 340,
                frequency: 1.4,
                clicks: 42000,
                ads: [
                    { id: 'ad8-2-1', name: 'Spring Fashion Sale', type: 'text', spend: 32000, offlineConversions: 460, offlineRevenue: 211600, onlineConversions: 200, clicks: 26000, impressions: 680000 },
                    { id: 'ad8-2-2', name: 'New Collection 2025', type: 'text', spend: 26000, offlineConversions: 320, offlineRevenue: 147200, onlineConversions: 140, clicks: 16000, impressions: 520000 }
                ]
            },
            {
                id: 'as8-3',
                name: 'Display - Remarketing',
                spend: 56000,
                offlineConversions: 700,
                offlineRevenue: 339200,
                onlineConversions: 220,
                frequency: 4.8,
                clicks: 32000,
                ads: [
                    { id: 'ad8-3-1', name: 'Spring Banner - Desktop', type: 'image', dimensions: '728x90', spend: 28000, offlineConversions: 380, offlineRevenue: 184160, onlineConversions: 120, clicks: 18000, impressions: 1200000 },
                    { id: 'ad8-3-2', name: 'Spring Banner - Mobile', type: 'image', dimensions: '320x50', spend: 28000, offlineConversions: 320, offlineRevenue: 155040, onlineConversions: 100, clicks: 14000, impressions: 980000 }
                ]
            }
        ]
    },
    // Campaigns without ad sets for simpler display
    {
        id: 'c2',
        name: 'Brand Awareness - Q1',
        platform: 'google',
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
        name: 'Dynamic Product Ads',
        platform: 'meta',
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
        name: 'Influencer Collaboration',
        platform: 'tiktok',
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
        name: 'Remarketing - Cart Abandoners',
        platform: 'meta',
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
        name: 'Product Launch - Denim',
        platform: 'tiktok',
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
