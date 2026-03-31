import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
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
import { Info } from 'lucide-react';
import { ProviderOptions } from "./provider-selection";
import OfflineConversionFlowChart from "./OfflineConversionFlowChart";

// Custom hook to calculate zoom factor based on screen size
const useResponsiveZoom = () => {
    const [zoomFactor, setZoomFactor] = useState(1);

    useEffect(() => {
        const calculateZoom = () => {
            const width = window.innerWidth;

            if (width >= 1400) {
                return 0.85;
            }
            if (width > 1200) {
                const ratio = (width - 1200) / (1400 - 1200);
                return 0.6 + ratio * 0.1;
            }
            return 0.8;
        };

        const handleResize = () => {
            const zoom = calculateZoom();
            setZoomFactor(zoom);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return zoomFactor;
};

interface PerformanceChartProps {
    filters: FilterState;
    onFiltersChange: Dispatch<SetStateAction<FilterState>>;
    providerSelector?: React.ReactNode;
}

export default function PerformanceChart({ filters, onFiltersChange, providerSelector }: PerformanceChartProps) {
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

    // Derive provider from page-level filters.platforms
    const filterPlatforms = (filters as any).platforms as string[] | undefined;
    const isMultiPlatform = !filterPlatforms?.length || filterPlatforms.length > 1;

    const performanceChartProvider = useMemo(() => {
        if (filterPlatforms && filterPlatforms.length === 1) {
            return filterPlatforms[0] as Provider;
        }
        return (filters.platform as Provider) || Provider.Google;
    }, [filterPlatforms, filters.platform]);

    const currentOfflineProviderNeedsSetup = useMemo(() => {
        const providerOption = offlineRoasProviderOptions.find((p) => p.key === performanceChartProvider);
        return !providerOption?.enabled;
    }, [offlineRoasProviderOptions, performanceChartProvider]);

    // get metrics api
    const hookPayload = useMemo(() => {
        const hasSelectedCampaigns = filters.campaigns && filters.campaigns.length > 0;

        const startDate = typeof filters.dateRange === 'string' ? new Date().toISOString() : formatDate(filters.dateRange.startDate);
        const endDate = typeof filters.dateRange === 'string' ? new Date().toISOString() : formatDate(filters.dateRange.endDate);

        return {
            startDate,
            endDate,
            ...(!hasSelectedCampaigns
                ? { campaign: ALL_CAMPAIGNS_ID }
                : { campaigns: filters.campaigns }),
            campaignTypes: filters.campaignTypes || [],
        };
    }, [
        filters.campaigns,
        filters.dateRange,
        filters.campaignTypes,
    ]);

    // Determine if we should fetch data
    const shouldFetchData = useMemo(() => {
        if (filters.isAllCampaignsSelected === false && (filters.campaigns?.length || 0) === 0) {
            return false;
        }
        return true;
    }, [
        filters.isAllCampaignsSelected,
        filters.campaigns,
    ]);

    const { data: providerMetrics, isLoading: isLoadingProviderMetrics } = useApiProviderMetrics({
        brandId: selectedBrandId!,
        provider: performanceChartProvider,
        payload: hookPayload,
        enabled: !!selectedBrandId && !currentOfflineProviderNeedsSetup && shouldFetchData,
    });

    return (
        <div className="vx-card overflow-visible">
            <div className="vx-card-header flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{t("reports.performance_chart.title")}</h3>
                        <div className="relative group">
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                                {t("reports.performance_chart.tooltip") || "Visualizes the full conversion flow from ad impressions through to offline store purchases, showing how each platform contributes to the omnichannel funnel."}
                                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{t("reports.performance_chart.description") || "End-to-end attribution flow from ad click to in-store purchase"}</p>
                </div>
            </div>
            <div className="vx-card-body vx-surface-muted">
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
                        <Stack direction="column" alignItems="center" sx={{ px: 2, py: 4, gap: 4 }}>
                            {providerSelector && (
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    {providerSelector}
                                </Box>
                            )}
                            <Box
                                sx={{
                                    zoom: isSmallScreen ? 1 : zoomFactor,
                                    transformOrigin: "center",
                                    width: "fit-content",
                                    maxWidth: "100%",
                                    overflow: "visible",
                                    transition: "zoom 0.3s ease-in-out",
                                    overflowX: 'auto',
                                }}
                            >
                                <OfflineConversionFlowChart
                                    providerMetrics={shouldFetchData && providerMetrics ? providerMetrics : undefined}
                                    isLoadingProviderMetrics={isLoadingProviderMetrics}
                                    selectedProvider={performanceChartProvider}
                                    setupNeeded={currentOfflineProviderNeedsSetup}
                                    isMultiPlatform={isMultiPlatform}
                                />
                            </Box>
                        </Stack>
                    </Box>
                </div>
            </div>
        </div>
    );
}
