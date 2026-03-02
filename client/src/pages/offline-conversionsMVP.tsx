import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Filter, X, Search, ChevronDown, Check, Calendar, Info } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import OfflineSummary from '../components/offline-conversions/OfflineSummary';
import PerformanceChart from '../components/offline-conversions/performance-chart';
import CampaignTable from '../components/offline-conversions/CampaignTable';
import DataPipelineStatus from '../components/offline-conversions/DataPipelineStatus';
import PipelineHealthSummary from '../components/offline-conversions/PipelineHealthSummary';
import UploadHistoryTable from '../components/offline-conversions/UploadHistoryTable';
import ActiveIssuesPanel from '../components/offline-conversions/ActiveIssuesPanel';
import { mockPipelineHealth, mockUploadBatches, mockIngestionJobs, mockActiveIssues } from '@/lib/mock-pipeline-data';
import PerformanceKPISummary from '../components/offline-conversions/PerformanceKPISummary';
import RevenueTrendChart from '../components/offline-conversions/RevenueTrendChart';
import PlatformComparison from '../components/offline-conversions/PlatformComparison';

import TopCampaignsQuickList from '../components/offline-conversions/TopCampaignsQuickList';
import GeographicPerformance from '../components/offline-conversions/GeographicPerformance';
import { useFilteredCampaigns } from '@/hooks/useFilteredCampaigns';
import { mockCampaigns, googleAdsAccounts } from '@/lib/mock-campaign-data';
import { useTranslation } from '@/contexts/LanguageContext';

// --- Filter Options ---

const dateRangeOptions = [
  { value: "7d", label: { en: "Last 7 Days", tr: "Son 7 Gün" } },
  { value: "30d", label: { en: "Last 30 Days", tr: "Son 30 Gün" } },
  { value: "thisMonth", label: { en: "This Month", tr: "Bu Ay" } },
  { value: "lastMonth", label: { en: "Last Month", tr: "Geçen Ay" } },
  { value: "qtd", label: { en: "Quarter to Date", tr: "Çeyrek Başından Bugüne" } },
  { value: "90d", label: { en: "Last 90 Days", tr: "Son 90 Gün" } },
];

// Derive campaign lists and status from mockCampaigns (single source of truth)
const campaignsByPlatform: Record<string, string[]> = {};
const campaignStatusMap: Record<string, 'active' | 'paused'> = {};
mockCampaigns.forEach(c => {
  (campaignsByPlatform[c.platform] ??= []).push(c.name);
  campaignStatusMap[c.name] = c.status as 'active' | 'paused';
});

// Campaign types per platform — real values from Google Ads, Meta Ads, TikTok Ads
const campaignTypesByPlatform: Record<string, { value: string; label: string }[]> = {
  google: [
    { value: "SEARCH", label: "Search" },
    { value: "SHOPPING", label: "Shopping" },
    { value: "DISPLAY", label: "Display" },
    { value: "VIDEO", label: "Video" },
    { value: "PERFORMANCE_MAX", label: "Performance Max" },
    { value: "DEMAND_GEN", label: "Demand Gen" },
    { value: "APP", label: "App" },
  ],
  meta: [
    { value: "AWARENESS", label: "Awareness" },
    { value: "TRAFFIC", label: "Traffic" },
    { value: "ENGAGEMENT", label: "Engagement" },
    { value: "LEADS", label: "Leads" },
    { value: "APP_PROMOTION", label: "App Promotion" },
    { value: "SALES", label: "Sales" },
  ],
  tiktok: [
    { value: "REACH", label: "Reach" },
    { value: "TRAFFIC", label: "Traffic" },
    { value: "VIDEO_VIEWS", label: "Video Views" },
    { value: "COMMUNITY_INTERACTION", label: "Community Interaction" },
    { value: "APP_PROMOTION", label: "App Promotion" },
    { value: "LEAD_GENERATION", label: "Lead Generation" },
    { value: "CONVERSIONS", label: "Conversions" },
    { value: "PRODUCT_SALES", label: "Product Sales" },
  ],
};

// --- Types ---

export interface PageFilterState {
  dateRange: string;
  platforms: string[];
  platform?: string;
  campaigns: string[];
  campaignTypes: string[];
  accounts: string[];
  isAllCampaignsSelected?: boolean;
  compareMode: boolean;
  activeOnly: boolean;
}

type TabKey = 'ozet' | 'performans' | 'kampanyalar' | 'veri_baglantisi';

// --- Component ---

export default function OfflineConversionsMVP() {
  const [filters, setFilters] = useState<PageFilterState>({
    dateRange: "30d",
    platforms: [],
    campaigns: [],
    campaignTypes: [],
    accounts: [],
    compareMode: false,
    activeOnly: false
  });

  const [mainTab, setMainTab] = useState<TabKey>('ozet');
  const { t, language } = useTranslation();
  const lang = language as 'en' | 'tr';

  const [campaignSearch, setCampaignSearch] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showDeduplicationTooltip, setShowDeduplicationTooltip] = useState(false);
  const deduplicationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleDeduplicationEnter = useCallback(() => {
    if (deduplicationTimeoutRef.current) clearTimeout(deduplicationTimeoutRef.current);
    setShowDeduplicationTooltip(true);
  }, []);
  const handleDeduplicationLeave = useCallback(() => {
    deduplicationTimeoutRef.current = setTimeout(() => setShowDeduplicationTooltip(false), 500);
  }, []);

  // Data Connection tab state
  const [activeIssues, setActiveIssues] = useState(mockActiveIssues);
  const handleDismissIssue = (id: string) => setActiveIssues((prev) => prev.filter((i) => i.id !== id));
  const handleRetryIssue = (id: string) => {
    setActiveIssues((prev) =>
      prev.map((i) => (i.id === id ? { ...i, title: 'Retrying...', description: 'Attempting to resolve...' } : i))
    );
    setTimeout(() => {
      setActiveIssues((prev) => prev.filter((i) => i.id !== id));
    }, 2000);
  };

  // Filtered campaign data for Performance tab components
  const { campaigns: filteredCampaigns, totals, derived, byPlatform } = useFilteredCampaigns(filters);

  const dateRangeDropdownRef = useRef<HTMLDivElement>(null);
  const platformDropdownRef = useRef<HTMLDivElement>(null);
  const campaignDropdownRef = useRef<HTMLDivElement>(null);
  const campaignTypeDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [dateRangeDropdownRef, platformDropdownRef, campaignDropdownRef, campaignTypeDropdownRef, accountDropdownRef];
      const clickedInside = refs.some(ref => ref.current?.contains(event.target as Node));
      if (!clickedInside) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get available campaign types based on selected platforms
  const availableCampaignTypes = useMemo(() => {
    if (filters.platforms.length === 0) {
      // All platforms — show deduplicated union of all types
      const allTypes = Object.values(campaignTypesByPlatform).flat();
      const seen = new Map<string, { value: string; label: string }>();
      for (const t of allTypes) {
        if (!seen.has(t.value)) seen.set(t.value, t);
      }
      return Array.from(seen.values());
    }
    const types = filters.platforms.flatMap(p => campaignTypesByPlatform[p] || []);
    const seen = new Map<string, { value: string; label: string }>();
    for (const t of types) {
      if (!seen.has(t.value)) seen.set(t.value, t);
    }
    return Array.from(seen.values());
  }, [filters.platforms]);

  // Get available campaigns based on selected platforms
  const getAvailableCampaigns = () => {
    if (filters.platforms.length === 0) {
      return Object.values(campaignsByPlatform).flat();
    }
    return filters.platforms.flatMap(p => campaignsByPlatform[p] || []);
  };

  const getFilteredCampaigns = () => {
    let available = getAvailableCampaigns();
    if (filters.activeOnly) {
      available = available.filter(c => campaignStatusMap[c] === 'active');
    }
    if (!campaignSearch) return available;
    return available.filter(c => c.toLowerCase().includes(campaignSearch.toLowerCase()));
  };

  // Filter handlers
  const handlePlatformToggle = (platform: string) => {
    setFilters(prev => {
      const newPlatforms = prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform];
      // Prune campaigns that are no longer available
      const availableCampaigns = newPlatforms.length === 0
        ? Object.values(campaignsByPlatform).flat()
        : newPlatforms.flatMap(p => campaignsByPlatform[p] || []);
      const newCampaigns = prev.campaigns.filter(c => availableCampaigns.includes(c));
      // Prune campaign types that are no longer available
      const availableTypeValues = new Set(
        (newPlatforms.length === 0 ? Object.values(campaignTypesByPlatform).flat() : newPlatforms.flatMap(p => campaignTypesByPlatform[p] || []))
          .map(t => t.value)
      );
      const newCampaignTypes = prev.campaignTypes.filter(ct => availableTypeValues.has(ct));
      // Clear accounts if Google is no longer selected
      const googleSelected = newPlatforms.length === 0 || newPlatforms.includes('google');
      const newAccounts = googleSelected ? prev.accounts : [];
      return { ...prev, platforms: newPlatforms, campaigns: newCampaigns, campaignTypes: newCampaignTypes, accounts: newAccounts };
    });
  };

  const handleAccountToggle = (accountId: string) => {
    setFilters(prev => ({
      ...prev,
      accounts: prev.accounts.includes(accountId)
        ? prev.accounts.filter(a => a !== accountId)
        : [...prev.accounts, accountId]
    }));
  };

  const handleCampaignToggle = (campaign: string) => {
    setFilters(prev => ({
      ...prev,
      campaigns: prev.campaigns.includes(campaign)
        ? prev.campaigns.filter(c => c !== campaign)
        : [...prev.campaigns, campaign]
    }));
  };

  const handleCampaignTypeToggle = (type: string) => {
    setFilters(prev => ({
      ...prev,
      campaignTypes: prev.campaignTypes.includes(type)
        ? prev.campaignTypes.filter(t => t !== type)
        : [...prev.campaignTypes, type]
    }));
  };

  const handleSelectAllCampaigns = () => {
    const filtered = getFilteredCampaigns();
    setFilters(prev => ({ ...prev, campaigns: Array.from(new Set([...prev.campaigns, ...filtered])) }));
  };

  const handleDeselectAllCampaigns = () => {
    const filtered = getFilteredCampaigns();
    setFilters(prev => ({ ...prev, campaigns: prev.campaigns.filter(c => !filtered.includes(c)) }));
  };

  const handleSelectAllCampaignTypes = () => {
    const allValues = availableCampaignTypes.map(t => t.value);
    setFilters(prev => ({
      ...prev,
      campaignTypes: Array.from(new Set([...prev.campaignTypes, ...allValues]))
    }));
  };

  const handleDeselectAllCampaignTypes = () => {
    setFilters(prev => ({ ...prev, campaignTypes: [] }));
  };

  const resetFilters = () => {
    setFilters(prev => ({ ...prev, dateRange: "30d", platforms: [], campaigns: [], campaignTypes: [], accounts: [], activeOnly: false }));
    setCampaignSearch("");
    setOpenDropdown(null);
  };

  const hasActiveFilters = filters.platforms.length > 0 || filters.campaignTypes.length > 0 || filters.campaigns.length > 0 || filters.accounts.length > 0 || filters.dateRange !== "30d" || filters.activeOnly;

  const showFilterBar = mainTab !== 'veri_baglantisi';
  const showAttributionNotice = showFilterBar && (filters.platforms.length === 0 || filters.platforms.length > 1);

  // --- Tab config ---
  const tabs: { key: TabKey; label: string; testId: string }[] = [
    { key: 'ozet', label: t.offlineConversions?.summary || (lang === 'en' ? 'Summary' : 'Özet'), testId: 'tab-ozet' },
    { key: 'performans', label: t.offlineConversions?.performance || (lang === 'en' ? 'Performance' : 'Performans'), testId: 'tab-performans' },
    { key: 'kampanyalar', label: t.offlineConversions?.campaigns || (lang === 'en' ? 'Campaigns' : 'Kampanyalar'), testId: 'tab-kampanyalar' },
    { key: 'veri_baglantisi', label: t.offlineConversions?.dataConnection || (lang === 'en' ? 'Data Connection' : 'Veri Bağlantısı'), testId: 'tab-veri-baglantisi' },
  ];

  return (
    <div className="vx-page">
      {/* Tab Navigation + Filter Bar + Attribution Strip — single sticky block */}
      <div className="sticky top-0 z-40">
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-3">
            <div className="vx-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setMainTab(tab.key)}
                  className={`vx-tab ${mainTab === tab.key ? 'vx-tab-active' : ''}`}
                  data-testid={tab.testId}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Shared Filter Bar — Summary, Performance, Campaigns tabs */}
        {showFilterBar && (
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <div className="vx-filter-row">
            {/* Date Range Filter */}
            <div className="relative" ref={dateRangeDropdownRef}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'dateRange' ? null : 'dateRange')}
                className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${filters.dateRange !== '30d' ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
              >
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{dateRangeOptions.find(o => o.value === filters.dateRange)?.label[lang] || (lang === 'en' ? 'Last 30 Days' : 'Son 30 Gün')}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {openDropdown === 'dateRange' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {dateRangeOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setFilters(prev => ({ ...prev, dateRange: option.value }));
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 ${filters.dateRange === option.value ? 'bg-gray-50' : ''}`}
                      >
                        <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${filters.dateRange === option.value ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                          {filters.dateRange === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-gray-700">{option.label[lang]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Platform Filter */}
            <div className="relative" ref={platformDropdownRef}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'platform' ? null : 'platform')}
                className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${filters.platforms.length > 0 ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
              >
                <Filter className="w-4 h-4 text-gray-400" />
                <span>{filters.platforms.length > 0 ? `Platform (${filters.platforms.length})` : 'Platform'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {openDropdown === 'platform' && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    {/* All Platforms */}
                    <button
                      onClick={() => { setFilters(prev => ({ ...prev, platforms: [] })); setOpenDropdown(null); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 ${filters.platforms.length === 0 ? 'bg-gray-50' : ''}`}
                    >
                      <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${filters.platforms.length === 0 ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                        {filters.platforms.length === 0 && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-600">All</span>
                      </div>
                      <span className="text-gray-700">{lang === 'en' ? 'All Platforms' : 'Tüm Platformlar'}</span>
                      <div
                        className="relative ml-auto"
                        onMouseEnter={handleDeduplicationEnter}
                        onMouseLeave={handleDeduplicationLeave}
                      >
                        <button type="button" onClick={(e) => e.stopPropagation()} className="p-0.5 rounded hover:bg-gray-100">
                          <Info className="w-3.5 h-3.5 text-amber-500 cursor-help" />
                        </button>
                        <div className={`absolute right-0 top-full mt-1 px-3 py-2.5 bg-gray-900 text-white text-xs rounded-lg transition-all duration-200 w-64 z-[9999] ${showDeduplicationTooltip ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                          <div className="font-semibold text-amber-400 mb-1">Deduplication Notice</div>
                          <div className="leading-relaxed">When viewing all platforms, there may be duplications as platforms sometimes attribute the same sales at the same time. For accurate attribution, view individual platform data.</div>
                        </div>
                      </div>
                    </button>

                    <div className="border-t border-gray-100 my-1" />

                    {([
                      { value: 'google', label: 'Google Ads', icon: SiGoogle, color: 'bg-[#EA4335]' },
                      { value: 'meta', label: 'Meta Ads', icon: SiMeta, color: 'bg-[#1877F2]' },
                      { value: 'tiktok', label: 'TikTok Ads', icon: SiTiktok, color: 'bg-black' },
                    ] as const).map(p => (
                      <button key={p.value} onClick={() => handlePlatformToggle(p.value)} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50">
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${filters.platforms.includes(p.value) ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                          {filters.platforms.includes(p.value) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <div className={`w-6 h-6 ${p.color} rounded flex items-center justify-center`}>
                          <p.icon className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-gray-700">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Account Filter — visible when Google is selected */}
            {(filters.platforms.length === 0 || filters.platforms.includes('google')) && (
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'account' ? null : 'account')}
                  className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${filters.accounts.length > 0 ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
                >
                  <SiGoogle className="w-3.5 h-3.5 text-gray-400" />
                  <span>{filters.accounts.length > 0 ? `${lang === 'en' ? 'Account' : 'Hesap'} (${filters.accounts.length})` : (lang === 'en' ? 'Account' : 'Hesap')}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {openDropdown === 'account' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      {googleAdsAccounts.map(account => (
                        <button
                          key={account.id}
                          onClick={() => handleAccountToggle(account.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50"
                        >
                          <div className={`w-4 h-4 border rounded flex items-center justify-center ${filters.accounts.includes(account.id) ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                            {filters.accounts.includes(account.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-gray-700">{account.name}</span>
                            <span className="text-[10px] text-gray-400">{account.customerId}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Campaign Type Filter — platform-aware */}
            <div className="relative" ref={campaignTypeDropdownRef}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'campaignType' ? null : 'campaignType')}
                className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${filters.campaignTypes.length > 0 ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
              >
                <span>{filters.campaignTypes.length > 0 ? `${lang === 'en' ? 'Campaign Type' : 'Kampanya Tipi'} (${filters.campaignTypes.length})` : (lang === 'en' ? 'Campaign Type' : 'Kampanya Tipi')}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {openDropdown === 'campaignType' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex gap-2">
                      <button onClick={handleSelectAllCampaignTypes} className="flex-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded">{lang === 'en' ? 'Select All' : 'Tümünü Seç'}</button>
                      <button onClick={handleDeselectAllCampaignTypes} className="flex-1 text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-2 py-1.5 rounded">{lang === 'en' ? 'Clear' : 'Temizle'}</button>
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {filters.platforms.length === 0 ? (
                      // Show all types grouped by platform
                      <>
                        {(['google', 'meta', 'tiktok'] as const).map(platform => (
                          <div key={platform}>
                            <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                              {platform === 'google' ? 'Google Ads' : platform === 'meta' ? 'Meta Ads' : 'TikTok Ads'}
                            </div>
                            {campaignTypesByPlatform[platform].map((type) => (
                              <button key={`${platform}-${type.value}`} onClick={() => handleCampaignTypeToggle(type.value)} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${filters.campaignTypes.includes(type.value) ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                                  {filters.campaignTypes.includes(type.value) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-gray-700">{type.label}</span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </>
                    ) : (
                      // Show types for selected platforms, grouped
                      <>
                        {filters.platforms.map(platform => (
                          <div key={platform}>
                            {filters.platforms.length > 1 && (
                              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                {platform === 'google' ? 'Google Ads' : platform === 'meta' ? 'Meta Ads' : 'TikTok Ads'}
                              </div>
                            )}
                            {(campaignTypesByPlatform[platform] || []).map((type) => (
                              <button key={`${platform}-${type.value}`} onClick={() => handleCampaignTypeToggle(type.value)} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50">
                                <div className={`w-4 h-4 border rounded flex items-center justify-center ${filters.campaignTypes.includes(type.value) ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                                  {filters.campaignTypes.includes(type.value) && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <span className="text-gray-700">{type.label}</span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Filter */}
            <div className="relative" ref={campaignDropdownRef}>
              <button
                onClick={() => setOpenDropdown(openDropdown === 'campaign' ? null : 'campaign')}
                className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${filters.campaigns.length > 0 ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
              >
                <span>{filters.campaigns.length > 0 ? `${lang === 'en' ? 'Campaign' : 'Kampanya'} (${filters.campaigns.length})` : (lang === 'en' ? 'Campaign' : 'Kampanya')}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {openDropdown === 'campaign' && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-2 border-b border-gray-100">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder={lang === 'en' ? 'Search campaigns...' : 'Kampanya ara...'}
                        value={campaignSearch}
                        onChange={(e) => setCampaignSearch(e.target.value)}
                        className="pl-8 h-8 text-sm border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="p-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-2 flex-1">
                        <button onClick={handleSelectAllCampaigns} className="flex-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-2 py-1.5 rounded">{lang === 'en' ? 'Select All' : 'Tümünü Seç'}</button>
                        <button onClick={handleDeselectAllCampaigns} className="flex-1 text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-2 py-1.5 rounded">{lang === 'en' ? 'Clear' : 'Temizle'}</button>
                      </div>
                      <div className="border-l border-gray-200 pl-2">
                        <button
                          onClick={() => setFilters(f => ({ ...f, activeOnly: !f.activeOnly }))}
                          className={`text-xs font-medium px-2 py-1.5 rounded transition-colors ${filters.activeOnly ? 'bg-green-50 text-green-700' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                        >
                          {lang === 'en' ? 'Active' : 'Aktif'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1">
                    {getFilteredCampaigns().map((campaign) => (
                      <button key={campaign} onClick={() => handleCampaignToggle(campaign)} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-gray-50 text-left">
                        <div className={`w-4 h-4 border rounded flex items-center justify-center flex-shrink-0 ${filters.campaigns.includes(campaign) ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                          {filters.campaigns.includes(campaign) && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-gray-700 truncate flex-1">{campaign}</span>
                        {campaignStatusMap[campaign] === 'paused' && (
                          <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex-shrink-0">
                            {lang === 'en' ? 'Paused' : 'Durduruldu'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button onClick={resetFilters} className="flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-white rounded-md transition-colors">
                <X className="w-4 h-4" />
                <span>{lang === 'en' ? 'Clear' : 'Temizle'}</span>
              </button>
            )}
          </div>
        </div>
        )}

        {/* Attribution overlap notice — shown when multiple platforms are in view */}
        {showAttributionNotice && (
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              {(t.offlineConversions as any)?.attributionOverlapNotice || 'Cross-platform totals may include overlapping attribution — platforms can independently claim the same conversion.'}
            </p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="vx-page-body min-h-[calc(100vh-8rem)]">

        {/* Summary Tab */}
        {mainTab === 'ozet' && (
          <div className="vx-section-stack">
            <OfflineSummary filters={filters} />
          </div>
        )}

        {/* Performance Tab */}
        {mainTab === 'performans' && (
          <>
            {/* 1. KPI Summary Cards */}
            <div className="vx-section-stack">
              <PerformanceKPISummary totals={totals} derived={derived} />
            </div>

            {/* 2. Omnichannel Funnel */}
            <div className="vx-section-stack">
              <PerformanceChart filters={filters as any} onFiltersChange={setFilters as any} />
            </div>

            {/* 3. Revenue Trend Chart */}
            <div className="vx-section-stack">
              <RevenueTrendChart totals={totals} byPlatform={byPlatform} dateRange={filters.dateRange} />
            </div>

            {/* 4. Platform Comparison */}
            <div className="vx-section-stack">
              <PlatformComparison byPlatform={byPlatform} />
            </div>

            {/* 5. Geographic Performance */}
            <div className="vx-section-stack">
              <GeographicPerformance filters={filters as any} />
            </div>

            {/* 6. Top Campaigns Quick List */}
            <div className="vx-section-stack">
              <TopCampaignsQuickList
                campaigns={filteredCampaigns}
                onNavigateToTab={(tab) => setMainTab(tab as TabKey)}
              />
            </div>
          </>
        )}

        {/* Campaigns Tab */}
        {mainTab === 'kampanyalar' && (
          <div className="vx-section-stack">
            <CampaignTable filters={filters} onActiveOnlyChange={(v) => setFilters(f => ({ ...f, activeOnly: v }))} />
          </div>
        )}

        {/* Data Connection Tab */}
        {mainTab === 'veri_baglantisi' && (
          <>
            <div className="vx-section-stack">
              <PipelineHealthSummary health={mockPipelineHealth} />
            </div>
            {activeIssues.length > 0 && (
              <div className="vx-section-stack">
                <ActiveIssuesPanel
                  issues={activeIssues}
                  onDismiss={handleDismissIssue}
                  onRetry={handleRetryIssue}
                />
              </div>
            )}
            <div className="vx-section-stack">
              <DataPipelineStatus />
            </div>
            <div className="vx-section-stack">
              <UploadHistoryTable batches={mockUploadBatches} ingestionJobs={mockIngestionJobs} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
