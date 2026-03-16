import { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, Database, MapPin, ShoppingBag, Upload, Clock, FileText, TrendingUp, TrendingDown, Star, DollarSign, Eye } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok, SiApple } from 'react-icons/si';
import { FaApple } from 'react-icons/fa';
import { useTranslation } from '@/contexts/LanguageContext';

type PipelineStatus = 'healthy' | 'warning' | 'error' | 'syncing';

interface PlatformSync {
    name: string;
    status: PipelineStatus;
    lastSync: string;
}

interface FileInfo {
    fileName: string;
    uploadTime: string;
    recordCount: string;
    status: PipelineStatus;
}

interface Pipeline {
    id: string;
    name: string;
    icon: React.ReactNode;
    fileInfo?: FileInfo;
    businessStatus?: PipelineStatus;
    businessLabel?: string;
    businessDetails?: string;
    showBusinessStatus: boolean;
    platforms: PlatformSync[];
}

import type { Metric } from '@/lib/types/common';
import { fNumber, fPercent } from '@/lib/formatters';

interface KpiMetric {
    id: string;
    title: string;
    metric: Metric;
    format: 'multiplier' | 'number' | 'percent' | 'rating';
    icon: React.ReactNode;
    iconBg: string;
    platforms: string[];
}

const mockPipelines: Pipeline[] = [
    {
        id: 'catalog',
        name: 'Katalog',
        icon: <ShoppingBag className="w-5 h-5" />,
        showBusinessStatus: false,
        fileInfo: {
            fileName: 'product_feed_20260127.xml',
            uploadTime: '2 dk önce',
            recordCount: '12,438 ürün',
            status: 'healthy'
        },
        platforms: [
            { name: 'Google', status: 'healthy', lastSync: '2 dk önce' },
            { name: 'Meta', status: 'healthy', lastSync: '5 dk önce' }
        ]
    },
    {
        id: 'offline-conversions',
        name: 'Offline Dönüşümler',
        icon: <Upload className="w-5 h-5" />,
        showBusinessStatus: false,
        fileInfo: {
            fileName: 'boyner_transactions_w04.csv',
            uploadTime: '5 dk önce',
            recordCount: '9,847 Transactions Processed',
            status: 'healthy'
        },
        platforms: [
            { name: 'Google', status: 'healthy', lastSync: '5 dk önce' },
            { name: 'Meta', status: 'syncing', lastSync: 'Senkronize ediliyor...' },
            { name: 'TikTok', status: 'healthy', lastSync: '12 dk önce' }
        ]
    },
    {
        id: 'locations',
        name: 'Lokasyonlar',
        icon: <MapPin className="w-5 h-5" />,
        showBusinessStatus: true,
        businessStatus: 'warning',
        businessLabel: '28/30 aktif',
        businessDetails: '2 lokasyon doğrulama bekliyor',
        platforms: [
            { name: 'Google', status: 'healthy', lastSync: '1 dk önce' },
            { name: 'Meta', status: 'healthy', lastSync: '3 dk önce' },
            { name: 'Apple', status: 'healthy', lastSync: '10 dk önce' }
        ]
    }
];

const formatKpiValue = (metric: Metric, format: KpiMetric['format']): string => {
    switch (format) {
        case 'multiplier':
            return `${metric.value.toFixed(1)}x`;
        case 'number':
            return fNumber(metric.value);
        case 'percent':
            return fPercent(metric.value);
        case 'rating':
            return metric.value.toFixed(1);
    }
};

const formatKpiPastValue = (metric: Metric, format: KpiMetric['format']): string => {
    const pv = metric.past_value ?? 0;
    switch (format) {
        case 'multiplier':
            return `${pv.toFixed(1)}x`;
        case 'number':
            return fNumber(pv);
        case 'percent':
            return fPercent(pv);
        case 'rating':
            return pv.toFixed(1);
    }
};

const kpiMetrics: KpiMetric[] = [
    {
        id: 'offline-roas',
        title: 'Omni-ROAS',
        metric: { value: 4.2, change: 12.5, past_value: 3.7 },
        format: 'multiplier',
        icon: <DollarSign className="w-4 h-4 text-green-600" />,
        iconBg: 'bg-green-100',
        platforms: ['Google', 'Meta', 'TikTok']
    },
    {
        id: 'location-interactions',
        title: 'Location Interactions',
        metric: { value: 23847, change: 10.7, past_value: 20634 },
        format: 'number',
        icon: <MapPin className="w-4 h-4 text-red-600" />,
        iconBg: 'bg-red-100',
        platforms: ['Google', 'Apple']
    },
    {
        id: 'local-inventory',
        title: 'Local Product Impressions',
        metric: { value: 142847, change: 18.3, past_value: 120654 },
        format: 'number',
        icon: <Eye className="w-4 h-4 text-blue-600" />,
        iconBg: 'bg-blue-100',
        platforms: ['Google', 'Meta']
    },
    {
        id: 'average-rating',
        title: 'Average Rating',
        metric: { value: 4.3, change: 4.9, past_value: 4.1 },
        format: 'rating',
        icon: <Star className="w-4 h-4 text-amber-500" />,
        iconBg: 'bg-amber-100',
        platforms: ['Google']
    }
];

const getStatusIcon = (status: PipelineStatus, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
    switch (status) {
        case 'healthy':
            return <CheckCircle className={`${sizeClass} text-emerald-500`} />;
        case 'warning':
            return <AlertTriangle className={`${sizeClass} text-amber-500`} />;
        case 'error':
            return <XCircle className={`${sizeClass} text-red-500`} />;
        case 'syncing':
            return <RefreshCw className={`${sizeClass} text-blue-500 animate-spin`} />;
    }
};

const getStatusBg = (status: PipelineStatus) => {
    switch (status) {
        case 'healthy':
            return 'bg-emerald-50 border-emerald-200';
        case 'warning':
            return 'bg-amber-50 border-amber-200';
        case 'error':
            return 'bg-red-50 border-red-200';
        case 'syncing':
            return 'bg-blue-50 border-blue-200';
    }
};

const getPlatformIcon = (platform: string, size: 'sm' | 'md' = 'md') => {
    const sizeClass = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
    switch (platform.toLowerCase()) {
        case 'google':
            return <SiGoogle className={`${sizeClass} text-[#4285F4]`} />;
        case 'meta':
            return <SiMeta className={`${sizeClass} text-[#0081FB]`} />;
        case 'apple':
            return <FaApple className={`${sizeClass} text-gray-800`} />;
        case 'tiktok':
            return <SiTiktok className={`${sizeClass} text-gray-900`} />;
        case 'yandex':
            return <span className={`${size === 'sm' ? 'text-[8px]' : 'text-[10px]'} font-bold text-red-600`}>Y</span>;
        default:
            return null;
    }
};

export default function DataPipelineStatus() {
    const { t, language } = useTranslation();
    const [selectedPlatforms, setSelectedPlatforms] = useState<Record<string, string>>({
        'offline-roas': 'Google',
        'location-interactions': 'Google',
        'local-inventory': 'Google',
        'average-rating': 'Google'
    });

    // Dynamic translations for mock data
    const getPipelineTranslations = () => [
        {
            id: 'catalog',
            name: t.dashboard.catalog,
            icon: <ShoppingBag className="w-5 h-5" />,
            showBusinessStatus: false,
            fileInfo: {
                fileName: 'product_feed_20260127.xml',
                uploadTime: language === 'en' ? '2 min ago' : '2 dk önce',
                recordCount: language === 'en' ? '12,438 products' : '12,438 ürün',
                status: 'healthy' as PipelineStatus
            },
            platforms: [
                { name: 'Google', status: 'healthy' as PipelineStatus, lastSync: language === 'en' ? '2 min ago' : '2 dk önce' },
                { name: 'Meta', status: 'healthy' as PipelineStatus, lastSync: language === 'en' ? '5 min ago' : '5 dk önce' }
            ]
        },
        {
            id: 'offline-conversions',
            name: t.dashboard.offlineConversions,
            icon: <Upload className="w-5 h-5" />,
            showBusinessStatus: false,
            fileInfo: {
                fileName: 'boyner_transactions_w04.csv',
                uploadTime: language === 'en' ? '5 min ago' : '5 dk önce',
                recordCount: language === 'en' ? '9,847 Transactions Processed' : '9,847 İşlem Eşleşti',
                status: 'healthy' as PipelineStatus
            },
            platforms: [
                { name: 'Google', status: 'healthy' as PipelineStatus, lastSync: language === 'en' ? '5 min ago' : '5 dk önce' },
                { name: 'Meta', status: 'syncing' as PipelineStatus, lastSync: language === 'en' ? 'Syncing...' : 'Senkronize ediliyor...' },
                { name: 'TikTok', status: 'healthy' as PipelineStatus, lastSync: language === 'en' ? '12 min ago' : '12 dk önce' }
            ]
        },
        {
            id: 'locations',
            name: t.dashboard.locations,
            icon: <MapPin className="w-5 h-5" />,
            showBusinessStatus: true,
            businessStatus: 'warning' as PipelineStatus,
            businessLabel: language === 'en' ? '28/30 active' : '28/30 aktif',
            businessDetails: language === 'en' ? '2 locations awaiting verification' : '2 lokasyon doğrulama bekliyor',
            platforms: [
                { name: 'Google', status: 'healthy' as PipelineStatus, lastSync: language === 'en' ? '1 min ago' : '1 dk önce' },
                { name: 'Meta', status: 'healthy' as PipelineStatus, lastSync: language === 'en' ? '3 min ago' : '3 dk önce' },
                { name: 'Apple', status: 'healthy' as PipelineStatus, lastSync: language === 'en' ? '10 min ago' : '10 dk önce' }
            ]
        }
    ];

    const pipelines = getPipelineTranslations();

    const handlePlatformChange = (kpiId: string, platform: string) => {
        setSelectedPlatforms(prev => ({ ...prev, [kpiId]: platform }));
    };

    return (
        <div className="vx-card">
            {/* Header */}
            <div className="vx-card-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-gray-500" />
                        <h3 className="text-base font-semibold text-gray-900">{t.dashboard.dataStreams}</h3>
                        <span className="text-xs text-gray-400 ml-2">• {t.common.last30days}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t.common.lastUpdate}: {t.common.now}</span>
                    </div>
                </div>
            </div>

            {/* Pipeline Cards Grid */}
            <div className="vx-card-body">
                <div className="grid grid-cols-3 gap-6 mb-6">
                    {pipelines.map((pipeline) => (
                        <div key={pipeline.id} className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                            {/* Pipeline Header */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 bg-white rounded-md border border-gray-200">
                                    <span className="text-gray-600">{pipeline.icon}</span>
                                </div>
                                <span className="font-medium text-gray-900">{pipeline.name}</span>
                            </div>

                            {/* File Info - for Catalog and Offline Conversions */}
                            {pipeline.fileInfo && (
                                <div className={`rounded-lg border p-3 mb-3 ${getStatusBg(pipeline.fileInfo.status)}`}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <FileText className="w-3.5 h-3.5 text-gray-500" />
                                            <span className="text-xs font-medium text-gray-600 truncate max-w-[140px]" title={pipeline.fileInfo.fileName}>
                                                {pipeline.fileInfo.fileName}
                                            </span>
                                        </div>
                                        {getStatusIcon(pipeline.fileInfo.status)}
                                    </div>
                                    <div className="text-sm font-semibold text-gray-900">{pipeline.fileInfo.recordCount}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">{pipeline.fileInfo.uploadTime} {t.dashboard.uploaded}</div>
                                </div>
                            )}

                            {/* İşletme Durumu - Only for Lokasyonlar */}
                            {pipeline.showBusinessStatus && pipeline.businessStatus && (
                                <div className={`rounded-lg border p-3 mb-3 ${getStatusBg(pipeline.businessStatus)}`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-medium text-gray-600">{t.dashboard.businessStatus}</span>
                                        {getStatusIcon(pipeline.businessStatus)}
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900">{pipeline.businessLabel}</div>
                                    {pipeline.businessDetails && (
                                        <div className="text-xs text-gray-500 mt-0.5">{pipeline.businessDetails}</div>
                                    )}
                                </div>
                            )}

                            {/* Platform Senkronizasyonu */}
                            <div className="space-y-2">
                                <span className="text-xs font-medium text-gray-600">{t.dashboard.platformSync}</span>
                                {pipeline.platforms.map((platform) => (
                                    <div key={platform.name} className="flex items-center justify-between py-1.5 px-2 bg-white rounded-md border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            {getPlatformIcon(platform.name)}
                                            <span className="text-sm text-gray-700">{platform.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{platform.lastSync}</span>
                                            {getStatusIcon(platform.status, 'sm')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* KPI Metrics Row */}
                <div className="grid grid-cols-4 gap-6">
                    {kpiMetrics.map((kpi) => (
                        <div key={kpi.id} className="bg-gray-50 rounded-lg border border-gray-100 p-3">
                            {/* Header with Platform Selector */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                    <div className={`p-1 ${kpi.iconBg} rounded`}>
                                        {kpi.icon}
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">{kpi.title}</span>
                                </div>
                                {/* Platform Selector Buttons */}
                                <div className="flex items-center gap-0.5 bg-white rounded-md border border-gray-200 p-0.5">
                                    {kpi.platforms.map((platform) => (
                                        <button
                                            key={platform}
                                            onClick={() => handlePlatformChange(kpi.id, platform)}
                                            className={`p-1 rounded transition-all ${selectedPlatforms[kpi.id] === platform
                                                ? 'bg-gray-100 shadow-sm'
                                                : 'hover:bg-gray-50'
                                                }`}
                                            title={platform}
                                        >
                                            {getPlatformIcon(platform, 'sm')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {/* Value and Trend */}
                            <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-gray-900">
                                    {formatKpiValue(kpi.metric, kpi.format)}
                                    {kpi.id === 'average-rating' && <span className="text-amber-500 ml-1">⭐</span>}
                                </span>
                                <div className="flex items-center gap-1">
                                    {kpi.metric.change >= 0 ? (
                                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                                    )}
                                    <span className={`text-xs font-medium ${kpi.metric.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {kpi.metric.change >= 0 ? '+' : ''}{fPercent(Math.abs(kpi.metric.change))}
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">vs {formatKpiPastValue(kpi.metric, kpi.format)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
