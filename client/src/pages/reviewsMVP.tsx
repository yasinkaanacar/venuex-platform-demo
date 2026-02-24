import { useState, useRef, useMemo } from 'react';
import { Bell, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PopoverSelect } from '@/components/ui/popover-select';
import { useTranslation } from '@/contexts/LanguageContext';

// Types
import type {
  ReviewSource, ReplyStatus, SortOrder, CommentFilter, LocationsTabFilters,
} from '@/lib/types/reviews';

// Mock data
import {
  reviewKpiData, ratingDistribution, themeAnalysisData,
  reviewTrendData, reviewLocationsData, recentReviews,
  locationContextData, productContextData,
} from '@/lib/mock-reviews-data';

// Components
import ReviewKpiCards from '@/components/reviews/ReviewKpiCards';
import ReviewTrendChart from '@/components/reviews/ReviewTrendChart';
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

export default function ReviewsMVP() {
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
  const [overviewLocation, setOverviewLocation] = useState('BOY007');
  const [overviewDateRange, setOverviewDateRange] = useState('30');

  const storeSetOptions = useMemo(() => [
    { value: 'all', label: t.reviews.filters.allStoreSets },
    { value: 'marmara', label: 'Marmara Region' },
    { value: 'BOY', label: 'BOY' },
    { value: 'premium', label: 'Premium' },
    { value: 'standard', label: 'Standard' },
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

  // ── Inbox State (shared across FilterBar + ReviewList + ReviewDetail) ──
  const [reviewSource, setReviewSource] = useState<ReviewSource>('locations');
  const [locationFilter, setLocationFilter] = useState('BOY007');
  const [productFilter, setProductFilter] = useState('all');
  const [replyStatusFilter, setReplyStatusFilter] = useState<ReplyStatus>('unreplied');
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
      {/* ── Sticky Tab Navigation ──────────────────────────────────────── */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
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

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <div className="vx-page-body min-h-[calc(100vh-8rem)]">

        {/* ────────── OVERVIEW TAB ────────── */}
        {activeTab === 'overview' && (
          <>
            {/* Overview Filters */}
            <div className="vx-section-stack">
              <div className="vx-card">
                <div className="vx-surface-muted">
                  <div className="px-6 py-3">
                    <div className="vx-filter-row">
                      <PopoverSelect
                        options={storeSetOptions}
                        value={overviewStoreSet}
                        onValueChange={setOverviewStoreSet}
                        triggerLabel={t.reviews.filters.storeSet}
                      />
                      <PopoverSelect
                        options={cityOptions}
                        value={overviewCity}
                        onValueChange={setOverviewCity}
                        triggerLabel={t.reviews.filters.city}
                        popoverWidth="w-[220px]"
                      />
                      <PopoverSelect
                        options={locationOptions}
                        value={overviewLocation}
                        onValueChange={setOverviewLocation}
                        triggerLabel={t.reviews.filters.location}
                        popoverWidth="w-[240px]"
                      />
                      <PopoverSelect
                        options={dateRangeOptions}
                        value={overviewDateRange}
                        onValueChange={setOverviewDateRange}
                        triggerLabel={t.reviews.filters.dateRange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="vx-section-stack">
              <ReviewKpiCards kpiData={reviewKpiData} ratingDistribution={ratingDistribution} />
            </div>

            <div className="vx-section-stack">
              <ReviewTrendChart data={reviewTrendData} />
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
              <ReviewLocationsFilterBar
                filters={locationsTabFilters}
                onFiltersChange={(updates) => setLocationsTabFilters((prev) => ({ ...prev, ...updates }))}
              />
            </div>

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
