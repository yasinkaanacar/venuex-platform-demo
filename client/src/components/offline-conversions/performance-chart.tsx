// UI components removed - using plain HTML elements
import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import { Box, Stack, useMediaQuery, useTheme } from "@mui/material";
import {
    ALL_CAMPAIGNS_ID,
    Provider,
    useBrandContext,
    useSetup,
    useAuthContext,
    useLocales,
    FilterState,
    useApiProviderMetrics,
    formatDate
} from "./mock-setup";
import ProviderSelection, { ProviderOptions } from "./provider-selection";
import OfflineConversionFlowChart from "./OfflineConversionFlowChart";

// Custom hook to calculate zoom factor based on screen size
const useResponsiveZoom = () => {
    const [zoomFactor, setZoomFactor] = useState(1);

    useEffect(() => {
        const calculateZoom = () => {
            const width = window.innerWidth;

            if (width >= 1400) {
                // xxl breakpoint (1400px)
                return 0.85;
            }
            if (width > 1200) {
                // between xxl and xl (1200px - 1400px)
                // Interpolate between 0.6 and 0.7 based on screen size
                const ratio = (width - 1200) / (1400 - 1200);
                return 0.6 + ratio * 0.1;
            }
            // xl and below
            return 0.8;
        };

        const handleResize = () => {
            const zoom = calculateZoom();
            setZoomFactor(zoom);
        };

        // Set initial zoom
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return zoomFactor;
};

interface PerformanceChartProps {
    filters: FilterState;
    onFiltersChange: Dispatch<SetStateAction<FilterState>>;
    /**
     * When true, shows an internal provider filter and manages its own provider state.
     * When false, uses filters.platform and updates via onFiltersChange.
     */
    showProviderFilter?: boolean;
}

export default function PerformanceChart({ filters, onFiltersChange, showProviderFilter = true }: PerformanceChartProps) {
    const { t } = useLocales();
    const theme = useTheme();
    const { brandId: selectedBrandId } = useBrandContext();
    const { isSuperUser: _isSuperUser } = useAuthContext();
    const zoomFactor = useResponsiveZoom();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("xl"));
    const { isGoogleAdsEnabled, isMetaConversionsConnected, isMetaAdAccountEnabled, isTiktokEventsConnected } =
        useSetup();

    const offlineRoasProviderOptions: ProviderOptions[] = useMemo(
        () => [
            { key: Provider.Google, enabled: isGoogleAdsEnabled },
            { key: Provider.Meta, enabled: isMetaConversionsConnected && isMetaAdAccountEnabled },
            { key: Provider.TikTok, enabled: isTiktokEventsConnected },
        ],
        [isGoogleAdsEnabled, isMetaConversionsConnected, isMetaAdAccountEnabled, isTiktokEventsConnected],
    );

    // When showProviderFilter=true, use internal state. Otherwise, use filters.platform
    const [internalProvider, setInternalProvider] = useState<Provider>(() => {
        return offlineRoasProviderOptions.find((p) => p.enabled)?.key || Provider.Google;
    });

    // Determine which provider to use
    // Safe check: filters.platform might be undefined or string. Cast to Provider or fallback.
    const performanceChartProvider = showProviderFilter
        ? internalProvider
        : (filters.platform as Provider) || Provider.Google;

    // Handle provider changes
    const handleProviderChange = (newProvider: Provider) => {
        if (showProviderFilter) {
            // Internal state mode: just update local state
            setInternalProvider(newProvider);
        } else {
            // External state mode: update filters.platform
            onFiltersChange((prev) => ({
                ...prev,
                platform: newProvider,
            }));
        }
    };

    const currentOfflineProviderNeedsSetup = useMemo(() => {
        const providerOption = offlineRoasProviderOptions.find((p) => p.key === performanceChartProvider);
        return !providerOption?.enabled;
    }, [offlineRoasProviderOptions, performanceChartProvider]);

    // get metrics api
    const hookPayload = useMemo(() => {
        const hasSelectedCampaigns = !showProviderFilter && filters.campaigns && filters.campaigns.length > 0;

        // Handle dateRange safely (could be string or object)
        const startDate = typeof filters.dateRange === 'string' ? new Date().toISOString() : formatDate(filters.dateRange.startDate);
        const endDate = typeof filters.dateRange === 'string' ? new Date().toISOString() : formatDate(filters.dateRange.endDate);

        return {
            startDate,
            endDate,
            ...(showProviderFilter || !hasSelectedCampaigns
                ? { campaign: ALL_CAMPAIGNS_ID }
                : { campaigns: filters.campaigns }),
            campaignTypes:
                performanceChartProvider === Provider.Google && showProviderFilter
                    ? [
                        "SEARCH",
                        "DISPLAY",
                        "SHOPPING",
                        "VIDEO",
                        "SMART",
                        "DEMAND_GEN",
                        "LOCAL",
                        "PERFORMANCE_MAX",
                        "MULTI_CHANNEL",
                    ]
                    : filters.campaignTypes || [],
        };
    }, [
        showProviderFilter,
        filters.campaigns,
        filters.dateRange,
        filters.campaignTypes,
        performanceChartProvider,
    ]);

    // Determine if we should fetch data based on filter state (only when NOT using internal provider filter)
    const shouldFetchData = useMemo(() => {
        // When showing internal provider filter, always fetch
        if (showProviderFilter) {
            return true;
        }

        // If campaigns is explicitly empty (Deselect All state), don't fetch
        if (filters.isAllCampaignsSelected === false && (filters.campaigns?.length || 0) === 0) {
            return false;
        }

        // If no campaign types selected and NOT Meta platform, don't fetch
        if ((filters.campaignTypes?.length || 0) === 0 && filters.platform !== Provider.Meta) {
            return false;
        }
        return true;
    }, [
        showProviderFilter,
        filters.isAllCampaignsSelected,
        filters.campaigns,
        filters.campaignTypes,
        filters.platform,
    ]);

    const { data: providerMetrics, isLoading: isLoadingProviderMetrics } = useApiProviderMetrics({
        brandId: selectedBrandId!,
        provider: showProviderFilter ? performanceChartProvider : filters.platform,
        payload: hookPayload,
        enabled: !!selectedBrandId && !currentOfflineProviderNeedsSetup && shouldFetchData,
    });

    return (
        <div className="vx-card">
            <div className="vx-card-header flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{t("reports.performance_chart.title")}</h3>

                </div>
            </div>
            <div className="vx-card-body vx-surface-muted">
                {showProviderFilter && (
                    <div className="mb-4 flex justify-center">
                        <ProviderSelection
                            providers={offlineRoasProviderOptions}
                            selectedProvider={performanceChartProvider}
                            onProviderChange={handleProviderChange}
                            attrIdPrefix="tab-performance-chart"
                        />
                    </div>
                )}
                <div className="relative" data-testid="chart-performance">
                    <Box
                        sx={{
                            backgroundColor: "common.white",
                            borderRadius: 1.5,
                            border: "1px solid",
                            borderColor: "grey.200",
                            overflow: "hidden",
                        }}
                    >
                        {/* Using same component for both screen sizes for simplicity in MVP, but handling zoom */}
                        <Stack direction="column" alignItems="center" sx={{ px: 2, py: 4, gap: 4 }}>
                            <Box
                                sx={{
                                    zoom: isSmallScreen ? 1 : zoomFactor,
                                    transformOrigin: "center",
                                    width: "fit-content",
                                    maxWidth: "100%",
                                    overflow: "visible",
                                    transition: "zoom 0.3s ease-in-out",
                                    // Ensure x-scrolling if needed
                                    overflowX: 'auto',
                                }}
                            >
                                <OfflineConversionFlowChart
                                    providerMetrics={shouldFetchData && providerMetrics ? providerMetrics : undefined}
                                    isLoadingProviderMetrics={isLoadingProviderMetrics}
                                    selectedProvider={performanceChartProvider}
                                    setupNeeded={currentOfflineProviderNeedsSetup}
                                />
                            </Box>
                        </Stack>
                    </Box>
                </div>
            </div>
        </div>
    );
}
