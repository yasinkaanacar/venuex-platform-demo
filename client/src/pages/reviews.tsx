import { useState, useRef, useMemo, useEffect } from 'react';
import { Bell, FileText, Settings, ChevronDown, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/LanguageContext';

// Types
import type {
  ReviewSource, ReplyStatus, SortOrder, CommentFilter, LocationsTabFilters,
} from '@/lib/types/reviews';

// Mock data
import {
  reviewKpiData, ratingDistribution, themeAnalysisData,
  reviewLocationsData, recentReviews,
  locationContextData, productContextData,
} from '@/lib/mock/reviews';

// Components
import ReviewKpiCards from '@/components/reviews/ReviewKpiCards';
import ThemeAnalysis from '@/components/reviews/ThemeAnalysis';
import InboxFilterBar from '@/components/reviews/InboxFilterBar';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewDetail from '@/components/reviews/ReviewDetail';
import ReviewLocationsFilterBar from '@/components/reviews/ReviewLocationsFilterBar';
import ReviewLocationsTable from '@/components/reviews/ReviewLocationsTable';
import AlertSettingsDialog from '@/components/reviews/AlertSettingsDialog';
import ReplyTemplatesDialog from '@/components/reviews/ReplyTemplatesDialog';
import AiSettingsDialog from '@/components/reviews/AiSettingsDialog';

type ActiveTab = 'overview' | 'inbox' | 'locations';

export default function Reviews() {
  const { t } = useTranslation();

  // ── Tab State ───────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // ── Dialog State ────────────────────────────────────────────────────────
  const [alertSettingsOpen, setAlertSettingsOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);

  // ── Overview Filters ────────────────────────────────────────────────────
  const [overviewStoreSet, setOverviewStoreSet] = useState('marmara');
  const [overviewCity, setOverviewCity] = useState('Istanbul');
  const [overviewLocation, setOverviewLocation] = useState('STR007');
  const [overviewDateRange, setOverviewDateRange] = useState('30');

  const storeSetOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allStoreSets },
    { value: 'marmara', label: 'Marmara Bölgesi' },
    { value: 'BOY', label: 'BOY' },
    { value: 'premium', label: 'Premium' },
    { value: 'standard', label: 'Standart' },
  ], [t]);

  const cityOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allCities },
    { value: 'Istanbul', label: 'İstanbul' },
    { value: 'Ankara', label: 'Ankara' },
    { value: 'Izmir', label: 'İzmir' },
    { value: 'Bursa', label: 'Bursa' },
    { value: 'Antalya', label: 'Antalya' },
    { value: 'Adana', label: 'Adana' },
    { value: 'Mersin', label: 'Mersin' },
    { value: 'Gaziantep', label: 'Gaziantep' },
    { value: 'Konya', label: 'Konya' },
    { value: 'Eskişehir', label: 'Eskişehir' },
    { value: 'Kayseri', label: 'Kayseri' },
    { value: 'Trabzon', label: 'Trabzon' },
    { value: 'Samsun', label: 'Samsun' },
    { value: 'Erzurum', label: 'Erzurum' },
    { value: 'Malatya', label: 'Malatya' },
    { value: 'Van', label: 'Van' },
    { value: 'Şanlıurfa', label: 'Şanlıurfa' },
    { value: 'Diyarbakır', label: 'Diyarbakır' },
    { value: 'Denizli', label: 'Denizli' },
    { value: 'Manisa', label: 'Manisa' },
    { value: 'Aydın', label: 'Aydın' },
    { value: 'Muğla', label: 'Muğla' },
  ], [t]);

  const locationOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allLocations },
    ...reviewLocationsData.map((loc) => ({ value: loc.code, label: loc.name })),
  ], [t]);

  const dateRangeOptions = useMemo(() => [
    { value: '7', label: t.filters.last7days },
    { value: '14', label: t.filters.last14days },
    { value: '30', label: t.filters.last30days },
    { value: '90', label: t.filters.last90days },
  ], [t]);

  // ── Filter Bar Dropdown State ───────────────────────────────────────────
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const storeSetDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const dateRangeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const refs = [storeSetDropdownRef, cityDropdownRef, locationDropdownRef, dateRangeDropdownRef];
      const clickedInside = refs.some(ref => ref.current?.contains(event.target as Node));
      if (!clickedInside) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = overviewStoreSet !== 'marmara' || overviewCity !== 'Istanbul' || overviewLocation !== 'STR007' || overviewDateRange !== '30';
  const resetFilters = () => { setOverviewStoreSet('marmara'); setOverviewCity('Istanbul'); setOverviewLocation('STR007'); setOverviewDateRange('30'); setOpenDropdown(null); };

  // ── Inbox State (shared across FilterBar + ReviewList + ReviewDetail) ──
  const [reviewSource, setReviewSource] = useState<ReviewSource>('locations');
  const [locationFilter, setLocationFilter] = useState('STR007');
  const [productFilter, setProductFilter] = useState('all');
  const [replyStatusFilter, setReplyStatusFilter] = useState<ReplyStatus>('UNANSWERED');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');
  const [commentFilter, setCommentFilter] = useState<CommentFilter>('all');
  const [themeFilter, setThemeFilter] = useState('all');
  const [storeSetFilter, setStoreSetFilter] = useState('marmara');
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(recentReviews[0]?.id ?? null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // ── Locations Tab State ─────────────────────────────────────────────────
  const [locationsTabFilters, setLocationsTabFilters] = useState<LocationsTabFilters>({
    dateRange: '30', region: 'all', city: 'Istanbul',
    storeSet: 'marmara', sentiment: 'all', avgRating: 'all',
    replyRate: 'all', search: '',
  });

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'inbox') {
      setTimeout(() => {
        filterBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  const selectedReview = selectedReviewId
    ? recentReviews.find((r) => r.id === selectedReviewId)
    : recentReviews[0];

  return (
    <div className="vx-page">
      {/* ── Sticky Tab Navigation + Filter Bar ────────────────────────── */}
      <div className="sticky top-0 z-40">
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-3 flex items-center justify-between">
            <div className="vx-tabs">
              {(['overview', 'inbox', 'locations'] as ActiveTab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`vx-tab ${activeTab === tab ? 'vx-tab-active' : ''}`}
                  data-testid={`tab-${tab === 'overview' ? 'ozet' : tab}`}
                >
                  {tab === 'overview' ? t.reviews.tabs.overview : tab === 'inbox' ? t.reviews.tabs.inbox : t.reviews.tabs.locations}
                </button>
              ))}
            </div>

            {/* Global Settings */}
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border border-gray-200 bg-white hover:bg-gray-50 shadow-sm" onClick={() => setAlertSettingsOpen(true)}>
                <Bell className="w-4 h-4 mr-2" />{t.reviews.actions.alertSettings}
              </Button>
              <Button variant="outline" size="sm" className="border border-gray-200 bg-white hover:bg-gray-50 shadow-sm" onClick={() => setTemplatesOpen(true)}>
                <FileText className="w-4 h-4 mr-2" />{t.reviews.actions.templates}
              </Button>
              <Button variant="outline" size="sm" className="border border-gray-200 bg-white hover:bg-gray-50 shadow-sm" onClick={() => setAiSettingsOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />{t.reviews.actions.aiSettings}
              </Button>
            </div>
          </div>
        </div>

        {/* Shared Filter Bar — Overview & Locations tabs */}
        {activeTab !== 'inbox' && (
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="vx-filter-row">
              {/* Date Range */}
              <div className="relative" ref={dateRangeDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'dateRange' ? null : 'dateRange')}
                  className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${overviewDateRange !== '30' ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
                >
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{dateRangeOptions.find(o => o.value === overviewDateRange)?.label || t.reviews.filters.dateRange}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {openDropdown === 'dateRange' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      {dateRangeOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => { setOverviewDateRange(option.value); setOpenDropdown(null); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 ${overviewDateRange === option.value ? 'bg-gray-50' : ''}`}
                        >
                          <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${overviewDateRange === option.value ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                            {overviewDateRange === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Store Set */}
              <div className="relative" ref={storeSetDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'storeSet' ? null : 'storeSet')}
                  className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${overviewStoreSet !== 'marmara' ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
                >
                  <span>{storeSetOptions.find(o => o.value === overviewStoreSet)?.label || t.reviews.filters.storeSet}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {openDropdown === 'storeSet' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-1">
                      {storeSetOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => { setOverviewStoreSet(option.value); setOpenDropdown(null); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 ${overviewStoreSet === option.value ? 'bg-gray-50' : ''}`}
                        >
                          <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${overviewStoreSet === option.value ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                            {overviewStoreSet === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* City */}
              <div className="relative" ref={cityDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}
                  className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${overviewCity !== 'Istanbul' ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
                >
                  <span>{cityOptions.find(o => o.value === overviewCity)?.label || t.reviews.filters.city}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {openDropdown === 'city' && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                    <div className="py-1">
                      {cityOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => { setOverviewCity(option.value); setOpenDropdown(null); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 ${overviewCity === option.value ? 'bg-gray-50' : ''}`}
                        >
                          <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${overviewCity === option.value ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                            {overviewCity === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Location */}
              <div className="relative" ref={locationDropdownRef}>
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                  className={`flex items-center gap-2 h-9 px-3 text-sm font-medium bg-white border rounded-md hover:border-gray-400 transition-colors ${overviewLocation !== 'STR007' ? 'border-gray-400 text-gray-900' : 'border-gray-200 text-gray-600'}`}
                >
                  <span>{locationOptions.find(o => o.value === overviewLocation)?.label || t.reviews.filters.location}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {openDropdown === 'location' && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                    <div className="py-1">
                      {locationOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => { setOverviewLocation(option.value); setOpenDropdown(null); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-gray-50 ${overviewLocation === option.value ? 'bg-gray-50' : ''}`}
                        >
                          <div className={`w-4 h-4 border rounded-full flex items-center justify-center ${overviewLocation === option.value ? 'bg-gray-900 border-gray-900' : 'border-gray-300'}`}>
                            {overviewLocation === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="text-gray-700">{option.label}</span>
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
                  <span>{t.common.clear}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="vx-page-body min-h-[calc(100vh-8rem)]">

        {/* ────────── OVERVIEW TAB ────────── */}
        {activeTab === 'overview' && (
          <>
            <div className="vx-section-stack">
              <ReviewKpiCards kpiData={reviewKpiData} ratingDistribution={ratingDistribution} />
            </div>

<div className="vx-section-stack">
              <ThemeAnalysis data={themeAnalysisData} />
            </div>
          </>
        )}

        {/* ────────── INBOX TAB ────────── */}
        {activeTab === 'inbox' && (
          <>
            <div className="vx-section-stack">
              <InboxFilterBar
                ref={filterBarRef}
                reviewSource={reviewSource}
                onReviewSourceChange={setReviewSource}
                locationFilter={locationFilter}
                onLocationFilterChange={setLocationFilter}
                productFilter={productFilter}
                onProductFilterChange={setProductFilter}
                replyStatusFilter={replyStatusFilter}
                onReplyStatusFilterChange={setReplyStatusFilter}
                ratingFilter={ratingFilter}
                onRatingFilterChange={setRatingFilter}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
                commentFilter={commentFilter}
                onCommentFilterChange={setCommentFilter}
                themeFilter={themeFilter}
                onThemeFilterChange={setThemeFilter}
                storeSetFilter={storeSetFilter}
                onStoreSetFilterChange={setStoreSetFilter}
                locations={reviewLocationsData}
              />
            </div>

            <div className="vx-section-stack">
              <div className="grid gap-6" style={{ gridTemplateColumns: '2fr 3fr' }}>
                <ReviewList
                  reviews={recentReviews}
                  selectedReviewId={selectedReviewId}
                  onSelectReview={setSelectedReviewId}
                  reviewSource={reviewSource}
                  ratingFilter={ratingFilter}
                  sortOrder={sortOrder}
                  commentFilter={commentFilter}
                />
                <ReviewDetail
                  review={selectedReview}
                  reviewSource={reviewSource}
                  locationContextData={locationContextData}
                  productContextData={productContextData}
                />
              </div>
            </div>
          </>
        )}

        {/* ────────── LOCATIONS TAB ────────── */}
        {activeTab === 'locations' && (
          <>
            <div className="vx-section-stack">
              <ReviewLocationsTable
                locations={reviewLocationsData}
                onLocationClick={() => handleTabChange('inbox')}
              />
            </div>
          </>
        )}
      </div>

      {/* ── Dialogs ────────────────────────────────────────────────────── */}
      <AlertSettingsDialog open={alertSettingsOpen} onOpenChange={setAlertSettingsOpen} />
      <ReplyTemplatesDialog open={templatesOpen} onOpenChange={setTemplatesOpen} />
      <AiSettingsDialog open={aiSettingsOpen} onOpenChange={setAiSettingsOpen} />
    </div>
  );
}
