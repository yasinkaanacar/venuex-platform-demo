// components/GeographicMap.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { useGeoJSON } from "@/hooks/useGeoJSON";
import { getCities } from "turkey-neighbourhoods";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useApiInsightsByGeographySummary, GeographicMetricsResultDto } from "@/hooks/useDashboard";
import { FilterState } from "@/lib/types";
import { formatDate } from "@/lib/formatDate";
import { fCurrency, fNumber, fPercent, useLocales, useSetup, useBrandContext } from "@/lib/formatters";
import { Provider } from "@/lib/constants";
import ProviderSelection from "./provider-selection";
import GeographicDataTable from "./GeographicDataTable";

type MapType = "turkey" | "world";
type MetricType = "revenue" | "roas";

interface GeographicMapProps {
    filters: FilterState;
    showProviderFilter?: boolean;
    showDataTable?: boolean;
    showMapTypeSelector?: boolean;
    mapType?: MapType;
    onMapTypeChange?: (type: MapType) => void;
    /** When true, renders only map content without card wrapper/header */
    embedded?: boolean;

    /**
     * When provided, shows a "View All" button that navigates to this path.
     */
    viewAllPath?: string;
}

interface SingleMapProps {
    mapType: MapType;
    metricsData: GeographicMetricsResultDto[];
    metricType: MetricType;
    title: string;
    geoData: any;
    provider?: string;
    tooltipDirection?: "auto" | "left" | "right";
}

const PROVIDER_OPTIONS = [
    {
        key: Provider.Google,
        icon: SiGoogle,
        bgColor: "bg-[#EA4335]",
    },
    {
        key: Provider.Meta,
        icon: SiMeta,
        bgColor: "bg-blue-600",
    },
    {
        key: Provider.TikTok,
        icon: SiTiktok,
        bgColor: "bg-black",
    },
];

// Color palettes
const REVENUE_COLORS = ["#eff6ff", "#bfdbfe", "#60a5fa", "#3b82f6", "#1e40af"];
const ROAS_COLORS = ["#f0fdf4", "#bbf7d0", "#4ade80", "#22c55e", "#15803d"];

// Helper function to interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number): string {
    // Parse hex colors
    const c1 = {
        r: parseInt(color1.slice(1, 3), 16),
        g: parseInt(color1.slice(3, 5), 16),
        b: parseInt(color1.slice(5, 7), 16),
    };
    const c2 = {
        r: parseInt(color2.slice(1, 3), 16),
        g: parseInt(color2.slice(3, 5), 16),
        b: parseInt(color2.slice(5, 7), 16),
    };

    // Interpolate
    const r = Math.round(c1.r + factor * (c2.r - c1.r));
    const g = Math.round(c1.g + factor * (c2.g - c1.g));
    const b = Math.round(c1.b + factor * (c2.b - c1.b));

    // Convert back to hex
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Get gradient color based on normalized value (0-1) and color palette
function getGradientColor(normalizedValue: number, colorPalette: string[]): string {
    if (normalizedValue <= 0) {
        return colorPalette[0];
    }
    if (normalizedValue >= 1) {
        return colorPalette[colorPalette.length - 1];
    }

    // Find which segment we're in
    const segmentSize = 1 / (colorPalette.length - 1);
    const segmentIndex = Math.floor(normalizedValue / segmentSize);
    const segmentProgress = (normalizedValue % segmentSize) / segmentSize;

    // Interpolate between the two colors in this segment
    const color1 = colorPalette[segmentIndex];
    const color2 = colorPalette[Math.min(segmentIndex + 1, colorPalette.length - 1)];

    return interpolateColor(color1, color2, segmentProgress);
}

export default function GeographicMap({
    filters,
    showProviderFilter = false,
    showDataTable = true,
    showMapTypeSelector = true,
    viewAllPath,
    mapType: propMapType,
    onMapTypeChange,
    embedded = false,
}: GeographicMapProps) {
    const { t, translate } = useLocales();
    const { brandId } = useBrandContext();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [internalMapType, setInternalMapType] = useState<MapType>("world");

    // Controlled or uncontrolled state
    const mapType = propMapType !== undefined ? propMapType : internalMapType;

    const {
        isLoading: isLoadingSetup,
        isGoogleAdsEnabled,
        isMetaConversionsConnected,
        isMetaAdAccountEnabled,
        isTiktokEventsConnected,
    } = useSetup();

    const providerOptions = useMemo(() => {
        return [
            {
                enabled: !isLoadingSetup && isGoogleAdsEnabled,
                ...PROVIDER_OPTIONS.find((p) => p.key === Provider.Google)!,
            },
            {
                enabled: !isLoadingSetup && isMetaConversionsConnected && isMetaAdAccountEnabled,
                ...PROVIDER_OPTIONS.find((p) => p.key === Provider.Meta)!,
            },
            {
                enabled: !isLoadingSetup && isTiktokEventsConnected,
                ...PROVIDER_OPTIONS.find((p) => p.key === Provider.TikTok)!,
            },
        ];
    }, [
        isLoadingSetup,
        isGoogleAdsEnabled,
        isMetaConversionsConnected,
        isMetaAdAccountEnabled,
        isTiktokEventsConnected,
    ]);

    // When showProviderFilter=true, use internal state. Otherwise, use filters.platform
    const [internalProvider, setInternalProvider] = useState<Provider>(() => {
        return providerOptions.find((p) => p.enabled)?.key || Provider.Google;
    });

    // Determine which provider to use
    const provider = showProviderFilter ? internalProvider : (filters.platform as Provider) || Provider.Google;
    const providerOption = providerOptions.find((p) => p.key === provider);

    const handleProviderChange = (newProvider: Provider) => {
        if (showProviderFilter) {
            // Internal state mode: just update local state
            setInternalProvider(newProvider);
        }
        // Note: When showProviderFilter is false, provider comes from filters.platform
        // and parent component manages it through filters
    };

    // Reset map type to world when provider changes
    useEffect(() => {
        // If controlled, notify parent. If uncontrolled, set internal state.
        if (propMapType === undefined) {
            setInternalMapType("world");
        } else if (onMapTypeChange) {
            onMapTypeChange("world");
        }
    }, [provider, propMapType, onMapTypeChange]);

    // Determine if we should fetch data based on filter state
    const shouldFetchData = useMemo(() => {
        // When showing internal provider filter, always fetch (uncontrolled mode, no external filters)
        if (showProviderFilter) {
            return true;
        }

        // If campaigns is explicitly empty (Deselect All state), don't fetch
        if (!filters.isAllCampaignsSelected && (filters.campaigns?.length || 0) === 0) {
            return false;
        }
        // If no campaign types selected and NOT Meta platform, don't fetch
        if ((filters.campaignTypes?.length || 0) === 0 && provider !== Provider.Meta) {
            return false;
        }
        return true;
    }, [showProviderFilter, filters.isAllCampaignsSelected, filters.campaigns, filters.campaignTypes, provider]);

    const { data: turkeyGeographicData, isLoading: isTurkeyLoading } = useApiInsightsByGeographySummary({
        brandId: brandId!,
        provider: provider as unknown as string,
        payload: {
            provider: provider as unknown as string,
            startDate: formatDate((filters.dateRange as any)?.startDate),
            endDate: formatDate((filters.dateRange as any)?.endDate),
            level: "TURKEY",
            // 3-State Logic:
            //    undefined = implicit all
            //    [] = explicit none
            //    [...ids] = manual selection
            ...(filters.isAllCampaignsSelected ? {} : { campaigns: filters.campaigns || [] }),
            campaignTypes: showProviderFilter ? undefined : filters.campaignTypes,
        },
        // TikTok doesn't support Turkey (city/province) level
        enabled: !!brandId && providerOption?.enabled && provider !== Provider.TikTok && shouldFetchData,
    });

    const { data: worldGeographicData, isLoading: isWorldLoading } = useApiInsightsByGeographySummary({
        brandId: brandId!,
        provider: provider as unknown as string,
        payload: {
            provider: provider as unknown as string,
            startDate: formatDate((filters.dateRange as any)?.startDate),
            endDate: formatDate((filters.dateRange as any)?.endDate),
            level: "WORLD",
            // 3-State Logic:
            //    undefined = implicit all
            //    [] = explicit none
            //    [...ids] = manual selection
            ...(filters.isAllCampaignsSelected ? {} : { campaigns: filters.campaigns || [] }),
            campaignTypes: showProviderFilter ? undefined : filters.campaignTypes,
        },
        enabled: !!brandId && providerOption?.enabled && shouldFetchData,
    });

    // Determine metrics data and loading state based on current map type
    const metricsData = mapType === "turkey" ? turkeyGeographicData?.data || [] : worldGeographicData?.data || [];
    const isLoadingData = mapType === "turkey" ? isTurkeyLoading : isWorldLoading;

    // GeoJSON hook
    const { geoData, loading: geoLoading, error } = useGeoJSON(mapType);

    const isLoading = isLoadingData || geoLoading;

    // Handle dropdown selection
    const handleMapTypeSelect = (type: MapType) => {
        if (propMapType !== undefined && onMapTypeChange) {
            onMapTypeChange(type);
        } else {
            setInternalMapType(type);
        }
        setIsDropdownOpen(false);
    };

    // TikTok only supports world level, not Turkey (city/province) level
    if (provider === Provider.TikTok && mapType === "turkey") {
        if (embedded) {
            return (
                <div className="p-8 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
                    <p className="text-sm text-gray-500">{t("geographic_insights.feature_not_supported")}</p>
                </div>
            );
        }
        return (
            <div id="geographic-map" className="vx-card mt-6">
                {/* Header with Title and View All Button */}
                <div className="vx-card-header flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">{t("geographic_insights.title")}</h3>
                    </div>

                    {/* View All Button */}
                    {viewAllPath && (
                        <a
                            href={viewAllPath}
                            className="text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer"
                            data-testid="button-view-all-locations"
                        >
                            {`${t("dashboard.view_all")} →`}
                        </a>
                    )}
                </div>

                <div className="vx-card-body vx-surface-muted border-b border-gray-200">
                    {/* Controls Row */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Spacer for alignment */}
                        <div className="flex-1" />

                        {/* Provider Selection - Centered */}
                        {showProviderFilter && (
                            <div className="flex justify-center flex-1">
                                <ProviderSelection
                                    providers={providerOptions}
                                    selectedProvider={provider}
                                    onProviderChange={handleProviderChange}
                                    attrIdPrefix="tab-geographic-map"
                                />
                            </div>
                        )}

                        {/* Map Type Selector - Right aligned */}
                        <div className="flex-1 flex justify-end">
                            {showMapTypeSelector && (
                                <MapTypeDropdown
                                    mapType={mapType}
                                    isDropdownOpen={isDropdownOpen}
                                    onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
                                    onSelectMapType={handleMapTypeSelect}
                                />
                            )}
                        </div>
                    </div>

                    {/* Not Supported Message */}
                    <div className="text-center py-12">
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {t("geographic_insights.feature_not_supported")}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            {translate("geographic_insights.platform_not_supported_description", {
                                platform: "TikTok",
                            })}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const defaultDescription = translate("geographic_insights.top_performing_regions", {
        regionType: t("common.country"),
    });

    // Loading state
    if (isLoading) {
        if (embedded) {
            return (
                <div className="p-8 bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">{t("geographic_insights.loading_map")}</p>
                    </div>
                </div>
            );
        }
        return (
            <div id="geographic-map" className="vx-card mt-6">
                {/* Header with Title and View All Button */}
                <div className="vx-card-header flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">{t("geographic_insights.title")}</h3>
                        <p className="text-sm text-muted-foreground">{defaultDescription}</p>
                    </div>

                    {/* View All Button */}
                    {viewAllPath && (
                        <a
                            href={viewAllPath}
                            className="text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer"
                            data-testid="button-view-all-locations"
                        >
                            {`${t("dashboard.view_all")} →`}
                        </a>
                    )}
                </div>

                <div className="vx-card-body vx-surface-muted border-b border-gray-200">
                    {/* Controls Row */}
                    {(showProviderFilter || showMapTypeSelector) && (
                        <div className="flex items-center justify-between mb-6">
                            {/* Spacer for alignment */}
                            <div className="flex-1" />

                            {/* Provider Selection - Centered */}
                            {showProviderFilter && (
                                <div className="flex justify-center flex-1">
                                    <ProviderSelection
                                        providers={providerOptions}
                                        selectedProvider={provider}
                                        onProviderChange={handleProviderChange}
                                        attrIdPrefix="tab-geographic-map"
                                    />
                                </div>
                            )}

                            {/* Map Type Selector - Right aligned */}
                            <div className="flex-1 flex justify-end">
                                {showMapTypeSelector && (
                                    <MapTypeDropdown
                                        mapType={mapType}
                                        isDropdownOpen={isDropdownOpen}
                                        onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
                                        onSelectMapType={handleMapTypeSelect}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-center p-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">{t("geographic_insights.loading_map")}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        if (embedded) {
            return (
                <div className="p-8 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-sm text-red-600">{t("geographic_insights.map_load_error")}</p>
                </div>
            );
        }
        return (
            <div id="geographic-map" className="vx-card mt-6">
                {/* Header with Title and View All Button */}
                <div className="vx-card-header flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">{t("geographic_insights.title")}</h3>
                        <p className="text-sm text-muted-foreground">{defaultDescription}</p>
                    </div>

                    {/* View All Button */}
                    {viewAllPath && (
                        <a
                            href={viewAllPath}
                            className="text-gray-700 hover:text-gray-900 font-medium bg-transparent border-none cursor-pointer"
                            data-testid="button-view-all-locations"
                        >
                            {`${t("dashboard.view_all")} →`}
                        </a>
                    )}
                </div>

                <div className="vx-card-body vx-surface-muted border-b border-gray-200">
                    {/* Controls Row */}
                    {(showProviderFilter || showMapTypeSelector) && (
                        <div className="flex items-center justify-between mb-6">
                            {/* Spacer for alignment */}
                            <div className="flex-1" />

                            {/* Provider Selection - Centered */}
                            {showProviderFilter && (
                                <div className="flex justify-center flex-1">
                                    <ProviderSelection
                                        providers={providerOptions}
                                        selectedProvider={provider}
                                        onProviderChange={handleProviderChange}
                                        attrIdPrefix="tab-geographic-map"
                                    />
                                </div>
                            )}

                            {/* Map Type Selector - Right aligned */}
                            <div className="flex-1 flex justify-end">
                                {showMapTypeSelector && (
                                    <MapTypeDropdown
                                        mapType={mapType}
                                        isDropdownOpen={isDropdownOpen}
                                        onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
                                        onSelectMapType={handleMapTypeSelect}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                        <div className="p-8 bg-red-50 rounded-lg">
                            <p className="text-red-600">{t("geographic_insights.map_load_error")}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No data
    if (!geoData) {
        if (embedded) {
            return (
                <div className="p-8 bg-white rounded-lg border border-gray-100 shadow-sm">
                    <p className="text-sm text-yellow-600">{t("geographic_insights.no_data_available")}</p>
                </div>
            );
        }
        return (
            <div id="geographic-map" className="vx-card mt-6">
                {/* Header with Title and View All Button */}
                <div className="vx-card-header flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-foreground">{t("geographic_insights.title")}</h3>
                        <p className="text-sm text-muted-foreground">{defaultDescription}</p>
                    </div>

                    {/* View All Button */}
                    {viewAllPath && (
                        <a
                            href={viewAllPath}
                            className="text-gray-700  hover:text-gray-900  font-medium bg-transparent border-none cursor-pointer"
                            data-testid="button-view-all-locations"
                        >
                            {`${t("dashboard.view_all")} →`}
                        </a>
                    )}
                </div>

                <div className="vx-card-body vx-surface-muted border-b border-gray-200">
                    {/* Controls Row */}
                    {(showProviderFilter || showMapTypeSelector) && (
                        <div className="flex items-center justify-between mb-6">
                            {/* Spacer for alignment */}
                            <div className="flex-1" />

                            {/* Provider Selection - Centered */}
                            {showProviderFilter && (
                                <div className="flex justify-center flex-1">
                                    <ProviderSelection
                                        providers={providerOptions}
                                        selectedProvider={provider}
                                        onProviderChange={handleProviderChange}
                                        attrIdPrefix="tab-geographic-map"
                                    />
                                </div>
                            )}

                            {/* Map Type Selector - Right aligned */}
                            <div className="flex-1 flex justify-end">
                                {showMapTypeSelector && (
                                    <MapTypeDropdown
                                        mapType={mapType}
                                        isDropdownOpen={isDropdownOpen}
                                        onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
                                        onSelectMapType={handleMapTypeSelect}
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between mb-6">
                        <div className="p-8 bg-yellow-50 rounded-lg">
                            <p className="text-yellow-600">{t("geographic_insights.no_data_available")}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const regionType = mapType === "turkey" ? t("common.province") : t("common.country");
    const description = translate("geographic_insights.top_performing_regions", { regionType });

    if (embedded) {
        return (
            <div className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                    <SingleMap
                        mapType={mapType}
                        metricsData={metricsData}
                        metricType="revenue"
                        title={t("geographic_insights.offline_revenue_distribution")}
                        geoData={geoData}
                        provider={provider}
                        tooltipDirection="auto"
                    />
                    <SingleMap
                        mapType={mapType}
                        metricsData={metricsData}
                        metricType="roas"
                        title={t("geographic_insights.offline_roas_distribution")}
                        geoData={geoData}
                        provider={provider}
                        tooltipDirection="left"
                    />
                </div>
            </div>
        );
    }

    return (
        <div id="geographic-map" className="vx-card mt-6">
            {/* Header with Title and View All Button */}
            <div className="vx-card-header flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">{t("geographic_insights.title")}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>

                {/* View All Button */}
                {viewAllPath && (
                    <a
                        href={viewAllPath}
                        className="text-gray-700  hover:text-gray-900  font-medium bg-transparent border-none cursor-pointer"
                        data-testid="button-view-all-locations"
                    >
                        {`${t("dashboard.view_all")} →`}
                    </a>
                )}
            </div>

            <div className="vx-card-body vx-surface-muted border-b border-gray-200">
                {/* Controls Row */}
                {(showProviderFilter || showMapTypeSelector) && (
                    <div className="flex items-center justify-between mb-6">
                        {/* Spacer for alignment */}
                        <div className="flex-1" />

                        {/* Provider Selection - Centered */}
                        {showProviderFilter && (
                            <div className="flex justify-center flex-1">
                                <ProviderSelection
                                    providers={providerOptions}
                                    selectedProvider={provider}
                                    onProviderChange={handleProviderChange}
                                    attrIdPrefix="tab-geographic-map"
                                />
                            </div>
                        )}

                        {/* Map Type Selector - Right aligned */}
                        <div className="flex-1 flex justify-end">
                            {showMapTypeSelector && (
                                <MapTypeDropdown
                                    mapType={mapType}
                                    isDropdownOpen={isDropdownOpen}
                                    onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
                                    onSelectMapType={handleMapTypeSelect}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Two Maps Side by Side */}
                <div className="grid grid-cols-2 gap-6">
                    <SingleMap
                        mapType={mapType}
                        metricsData={metricsData}
                        metricType="revenue"
                        title={t("geographic_insights.offline_revenue_distribution")}
                        geoData={geoData}
                        provider={provider}
                        tooltipDirection="auto"
                    />
                    <SingleMap
                        mapType={mapType}
                        metricsData={metricsData}
                        metricType="roas"
                        title={t("geographic_insights.offline_roas_distribution")}
                        geoData={geoData}
                        provider={provider}
                        tooltipDirection="left"
                    />
                </div>

                {/* Reserved Space for Future Table */}
                {showDataTable && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <GeographicDataTable
                            mapType={mapType}
                            metricsData={metricsData}
                            loading={isLoading}
                            provider={provider}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

function SingleMap({
    mapType,
    metricsData,
    metricType,
    title,
    geoData,
    provider,
    tooltipDirection = "auto",
}: SingleMapProps) {
    const { t } = useLocales();
    const [tooltipContent, setTooltipContent] = useState("");
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

    // Map configurations
    const mapConfigs = {
        turkey: {
            scale: 2200,
            center: [35, 39] as [number, number],
        },
        world: {
            scale: 100,
            center: [10, 30] as [number, number],
        },
    };

    const currentConfig = mapConfigs[mapType];

    // Get color palette based on metric type
    const colorPalette = metricType === "revenue" ? REVENUE_COLORS : ROAS_COLORS;

    // Backend'den gelen data ile GeoJSON feature'ı eşleştir
    const getRegionData = (feature: any): GeographicMetricsResultDto | undefined => {
        if (mapType === "turkey") {
            const plateCode = feature.properties.plate_code;
            return metricsData.find((m) => {
                const backendCode = m.iso?.split("-")[1] || m.iso;
                return backendCode === plateCode;
            });
        }

        if (mapType === "world") {
            const countryCode = feature.properties.country_code;
            return metricsData.find((m) => m.iso === countryCode);
        }

        return undefined;
    };

    // Şehir ismini turkey-neighbourhoods'dan al
    const getCityName = (plateCode: string): string => {
        const cities = getCities();
        const city = cities.find((c) => c.code === plateCode);
        return city?.name || plateCode;
    };

    // Get value from region data based on metric type
    const getMetricValue = (data: GeographicMetricsResultDto): number => {
        return metricType === "revenue" ? data.offlineRevenue : data.offlineRoas;
    };

    // Calculate min/max values for the metric
    const {
        minValue,
        maxValue: _maxValue,
        rangeValue,
    } = useMemo(() => {
        if (metricsData.length === 0) {
            return { minValue: 0, maxValue: 0, rangeValue: 0 };
        }

        const getValue = (data: GeographicMetricsResultDto): number => {
            return metricType === "revenue" ? data.offlineRevenue : data.offlineRoas;
        };

        const values = metricsData.map(getValue).filter((v) => v > 0);
        if (values.length === 0) {
            return { minValue: 0, maxValue: 0, rangeValue: 0 };
        }

        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min;

        return { minValue: min, maxValue: max, rangeValue: range };
    }, [metricsData, metricType]);

    // Get color for a value based on gradient
    const getColorForValue = (value: number): string => {
        if (value <= 0) {
            return "#e5e7eb"; // No data
        }

        // Single value or very small range - use best color
        if (rangeValue < 0.01) {
            return colorPalette[colorPalette.length - 1];
        }

        // Normalize value between 0 and 1
        const normalizedValue = (value - minValue) / rangeValue;

        // Use smooth gradient interpolation
        return getGradientColor(normalizedValue, colorPalette);
    };

    // Get color for region
    const getColorForRegion = (regionData: GeographicMetricsResultDto | undefined): string => {
        if (!regionData) {
            return "#e5e7eb"; // No data
        }

        const value = getMetricValue(regionData);
        return getColorForValue(value);
    };

    // Generate dynamic legend with smooth gradient
    const legend = useMemo(() => {
        if (metricsData.length === 0) {
            return null;
        }

        const getValue = (data: GeographicMetricsResultDto): number => {
            return metricType === "revenue" ? data.offlineRevenue : data.offlineRoas;
        };

        const values = metricsData.map(getValue).filter((v) => v > 0);
        if (values.length === 0) {
            return null;
        }

        const min = Math.min(...values);
        const max = Math.max(...values);

        // Format labels based on metric type
        const minLabel = metricType === "revenue" ? fCurrency(min) : `${min.toFixed(1)}x`;
        const maxLabel = metricType === "revenue" ? fCurrency(max) : `${max.toFixed(1)}x`;

        return {
            min: minLabel,
            max: maxLabel,
            gradient: colorPalette,
        };
    }, [metricsData, metricType, colorPalette]);

    // Generate tooltip content
    const handleMouseEnter = (regionData: GeographicMetricsResultDto | undefined, regionName: string) => {
        if (!regionData) {
            const noDataMsg = t("geographic_insights.no_data");
            const tooltipLines = [regionName, "━━━━━━━━━━━━━━━━━━━━", noDataMsg];
            setTooltipContent(tooltipLines.join("\n"));
            return;
        }

        const isMeta = provider === Provider.Meta;

        const metrics = [
            {
                label: t("campaigns.top_performing_campaigns.impressions"),
                value: fNumber(regionData.impressions),
            },
            {
                label: t("campaigns.top_performing_campaigns.clicks"),
                value: fNumber(regionData.clicks),
            },
            {
                label: t("campaigns.top_performing_campaigns.spend"),
                value: fCurrency(regionData.spend),
            },
        ];

        if (!isMeta) {
            metrics.push({
                label: t("campaigns.top_performing_campaigns.visits"),
                value: fNumber(regionData.visits || 0),
            });
            metrics.push({
                label: t("campaigns.top_performing_campaigns.click_to_visit"),
                value: fPercent(regionData.clickToVisitRate || 0),
            });
        }

        metrics.push({
            label: t("campaigns.top_performing_campaigns.offline_purchases"),
            value: fNumber(regionData.offlinePurchases || 0),
        });
        metrics.push({
            label: t("campaigns.top_performing_campaigns.offline_revenue"),
            value: `${fCurrency(regionData.offlineRevenue)}`,
        });
        metrics.push({
            label: t("campaigns.top_performing_campaigns.offline_roas"),
            value: `${regionData.offlineRoas.toFixed(1)}x`,
        });

        const tooltipLines = [regionName, "━━━━━━━━━━━━━━━━━━━━", ...metrics.map((m) => `${m.label}: ${m.value}`)];

        setTooltipContent(tooltipLines.join("\n"));
    };

    return (
        <div className="bg-white rounded-lg p-4">
            {/* Map Title */}
            <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>

            {/* Map */}
            <div
                className="relative"
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltipPosition({
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                    });
                }}
            >
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: currentConfig.scale,
                        center: currentConfig.center,
                    }}
                    width={800}
                    height={500}
                    style={{ width: "100%", height: "auto" }}
                >
                    <Geographies geography={geoData}>
                        {({ geographies }: { geographies: any[] }) =>
                            geographies.map((geo: any) => {
                                const regionData = getRegionData(geo);
                                const regionName =
                                    mapType === "turkey"
                                        ? getCityName(geo.properties.plate_code)
                                        : geo.properties.normalized_name;

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={getColorForRegion(regionData)}
                                        stroke="#fff"
                                        strokeWidth={0.5}
                                        onMouseEnter={() => handleMouseEnter(regionData, regionName)}
                                        onMouseLeave={() => setTooltipContent("")}
                                        style={{
                                            default: { outline: "none" },
                                            hover: {
                                                fill: "#0ea5e9",
                                                outline: "none",
                                                cursor: "pointer",
                                            },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>
                </ComposableMap>

                {/* Tooltip */}
                {tooltipContent && (
                    <div
                        className="absolute bg-gray-900 text-white px-5 py-4 rounded-lg shadow-xl whitespace-pre-line text-sm z-10 pointer-events-none min-w-[280px]"
                        style={{
                            left: `${tooltipPosition.x + 15}px`,
                            top: `${tooltipPosition.y + 15}px`,
                            transform: (() => {
                                switch (tooltipDirection) {
                                    case "left": {
                                        return "translateX(-100%) translateX(-30px)";
                                    }
                                    case "auto": {
                                        return tooltipPosition.x > 400 ? "translateX(-100%) translateX(-30px)" : "none";
                                    }
                                    default: {
                                        return "none";
                                    }
                                }
                            })(),
                        }}
                    >
                        {tooltipContent}
                    </div>
                )}
            </div>

            {/* Legend */}
            {legend && (
                <div className="mt-4 flex flex-col items-center gap-2">
                    {/* Gradient Bar */}
                    <div className="flex items-center gap-3 w-full max-w-md">
                        <span className="text-xs text-gray-600 font-medium min-w-[60px] text-right">{legend.min}</span>
                        <div
                            className="flex-1 h-4 rounded-md"
                            style={{
                                background: `linear-gradient(to right, ${legend.gradient.join(", ")})`,
                            }}
                        />
                        <span className="text-xs text-gray-600 font-medium min-w-[60px] text-left">{legend.max}</span>
                    </div>
                    {/* No data indicator */}
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-200" />
                        <span className="text-xs text-gray-500">{t("geographic_insights.no_data")}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Map Type Dropdown Component
interface MapTypeDropdownProps {
    mapType: "turkey" | "world";
    isDropdownOpen: boolean;
    onToggleDropdown: () => void;
    onSelectMapType: (type: "turkey" | "world") => void;
}

function MapTypeDropdown({ mapType, isDropdownOpen, onToggleDropdown, onSelectMapType }: MapTypeDropdownProps) {
    const { t } = useLocales();

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={onToggleDropdown}
                className="vx-button justify-between !border-gray-300 !bg-gray-100 hover:!bg-gray-200 !text-black"
            >
                <span className="flex items-center gap-2">
                    {mapType === "turkey" ? t("countries.tr") : t("countries.world")}
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
            </Button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                        <button
                            type="button"
                            onClick={() => onSelectMapType("turkey")}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${mapType === "turkey" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                }`}
                        >
                            {t("countries.tr")}
                        </button>
                        <button
                            type="button"
                            onClick={() => onSelectMapType("world")}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${mapType === "world" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                                }`}
                        >
                            {t("countries.world")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
