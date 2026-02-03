import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowUp, ArrowDown, Minus } from 'lucide-react';

// Enums and Constants
export enum Provider {
    Google = 'google',
    Meta = 'meta',
    TikTok = 'tiktok',
    Apple = 'apple',
    Yandex = 'yandex',
}

export const ALL_CAMPAIGNS_ID = 'all_campaigns';

// Interfaces
export interface FilterState {
    dateRange: string | { startDate: Date; endDate: Date };
    platforms: string[];
    platform?: string; // For compatibility
    campaigns: string[];
    campaignTypes: string[];
    isAllCampaignsSelected?: boolean;
}

export interface Metric {
    value: number;
    change: number;
    past_value?: number;
}

export interface NormalizedAdMetricsResponse {
    cost: Metric;
    impressions: Metric;
    clicks: Metric;
    onlineOrders: Metric;
    onlineRevenue: Metric;
    onlineROI: Metric;
    onlineAOV: Metric;
    storeVisit: Metric;
    offlineOrders: Metric;
    offlineRevenue: Metric;
    offlineROAS: Metric;
    offlineAOV: Metric;
}

// Real translation hook integration
import { useTranslation } from '@/contexts/LanguageContext';

function getNestedValue(obj: any, path: string): string {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj) || path;
}

export function useLocales() {
    const { t: translations } = useTranslation();
    return {
        t: (key: string) => getNestedValue(translations, key),
        translate: (key: string, options?: any) => {
            let text = getNestedValue(translations, key);
            if (options && typeof text === 'string') {
                Object.keys(options).forEach(k => {
                    text = text.replace(new RegExp(`{{${k}}}|{${k}}`, 'g'), options[k]);
                });
            }
            return text;
        },
        currentLang: { value: 'en' }
    };
}

export function useBrandContext() {
    return { brandId: 'mock-brand-id' };
}

export function useAuthContext() {
    return { isSuperUser: false };
}

export function useSetup() {
    return {
        isGoogleAdsEnabled: true,
        isMetaConversionsConnected: true,
        isMetaAdAccountEnabled: true,
        isTiktokEventsConnected: true,
    };
}

// Mock Data Hook
export function useApiProviderMetrics(params: any) {
    const [data, setData] = useState<NormalizedAdMetricsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setData({
                cost: { value: 12500, change: 12.5, past_value: 11000 },
                impressions: { value: 1250000, change: 15.5, past_value: 1050000 },
                clicks: { value: 45000, change: 8.4, past_value: 41000 },
                onlineOrders: { value: 1200, change: 5.2, past_value: 1140 },
                onlineRevenue: { value: 85000, change: 15.3, past_value: 73000 },
                onlineROI: { value: 6.8, change: 2.1, past_value: 6.6 },
                onlineAOV: { value: 70.8, change: 1.5, past_value: 69.7 },
                storeVisit: { value: 15000, change: 10.2, past_value: 13500 },
                offlineOrders: { value: 450, change: 18.5, past_value: 380 },
                offlineRevenue: { value: 42000, change: 22.1, past_value: 34000 },
                offlineROAS: { value: 3.4, change: 4.5, past_value: 3.2 },
                offlineAOV: { value: 93.3, change: 3.2, past_value: 90.1 },
            });
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [params.provider]);

    return { data, isLoading };
}

// Mock Utils
export function fShortenNumber(num: number) {
    if (num === 0) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
}

export function fPercentChangeCustom(num: number | string, format?: string) {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    return `${n > 0 ? '+' : ''}${n}%`;
}

export function calculatePercentageChange(current: number, past: number) {
    if (!past) return 0;
    return ((current - past) / past) * 100;
}

export function fCapitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Mock Components
export function Iconify({ icon, color, sx }: any) {
    // Simple mapping for common icons
    const style = { color, ...sx, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };

    if (icon === 'ic:round-arrow-right') {
        return <span style={style}><ArrowRight size={16} /></span>;
    }
    return <span style={style}>•</span>;
}

export function TrendInfo({ trendDirection, value, showZero }: any) {
    const color = trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-600' : 'text-gray-500';
    const Icon = trendDirection === 'up' ? ArrowUp : trendDirection === 'down' ? ArrowDown : Minus;

    return (
        <div className={`flex items-center text-xs font-medium ${color}`}>
            <Icon className="w-3 h-3 mr-0.5" />
            {value}
        </div>
    );
}

export function formatDate(date: any) {
    if (typeof date === 'string') return date;
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return '';
}
