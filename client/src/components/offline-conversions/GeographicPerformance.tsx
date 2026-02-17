
import React, { useState } from "react";
import GeographicMap from "./GeographicMap";
import GeographicDataTable from "./GeographicDataTable";
import { FilterState } from "@/lib/types";
import { useApiInsightsByGeographySummary } from "@/hooks/useDashboard";
import { useBrandContext, useLocales } from "@/lib/formatters";
import { formatDate } from "@/lib/formatDate";
import { Provider } from "@/lib/constants";
import { Globe, Map } from "lucide-react";

interface GeographicPerformanceProps {
    filters: FilterState;
    dateRange?: { startDate: Date; endDate: Date };
}

type MapType = "turkey" | "world";

export default function GeographicPerformance({ filters, dateRange }: GeographicPerformanceProps) {
    const { t } = useLocales();
    const { brandId } = useBrandContext();
    const [mapType, setMapType] = useState<MapType>("turkey");
    const [activeTab, setActiveTab] = useState<"map" | "table">("map");

    // We can fetch data here to pass to both, or let them fetch individually.
    // For now, let's keep the fetch logic inside the components as they are already set up for it, 
    // but we control the "mapType" (view mode) from here.
    // Ideally, we would lift the fetch here to avoid double fetching if they share data structure,
    // but GeographicMap handles its own complex fetching logic. 
    // GeographicDataTable also expects "metricsData" prop, so we DO need to fetch here or pass it from Map?
    // GeographicMap fetches its own data.
    // GeographicDataTable expects `metricsData`.
    // So we should probably lift the fetching logic here so we can pass data to both.

    // However, GeographicMap is complex and already has the fetching logic tightly coupled with GeoJSON loading.
    // Refactoring that fully is risky.
    // A simpler approach for the table:
    // Let's re-use the same hook here to get data for the table!

    // Determine provider
    // Note: GeographicMap handles provider selection internally if showProviderFilter=true, 
    // but here we might want to enforce consistency.
    // If we want the Table to match the Map, they need to share the Provider state.
    // GeographicMap has an internal provider state when showProviderFilter=true.
    // We should probably rely on the filters.platform from the parent if showProviderFilter=false,
    // OR if we want to support the internal toggle, we need to lift THAT state too.

    // For this implementation, let's assume we use the global filters.platform as the provider
    // to keep it simple and consistent with the "single source of truth" principle.
    // So we will set showProviderFilter={false} on GeographicMap.

    const provider = (filters.platform as Provider) || Provider.Google;

    const { data: turkeyGeographicData, isLoading: isTurkeyLoading } = useApiInsightsByGeographySummary({
        brandId: brandId!,
        provider: provider,
        payload: {
            provider: provider,
            startDate: formatDate(dateRange?.startDate || (filters.dateRange as any)?.startDate),
            endDate: formatDate(dateRange?.endDate || (filters.dateRange as any)?.endDate),
            level: "TURKEY",
            ...(filters.isAllCampaignsSelected ? {} : { campaigns: filters.campaigns || [] }),
            campaignTypes: filters.campaignTypes,
        },
        enabled: !!brandId && mapType === "turkey"
    });

    const { data: worldGeographicData, isLoading: isWorldLoading } = useApiInsightsByGeographySummary({
        brandId: brandId!,
        provider: provider,
        payload: {
            provider: provider,
            startDate: formatDate(dateRange?.startDate || (filters.dateRange as any)?.startDate),
            endDate: formatDate(dateRange?.endDate || (filters.dateRange as any)?.endDate),
            level: "WORLD",
            ...(filters.isAllCampaignsSelected ? {} : { campaigns: filters.campaigns || [] }),
            campaignTypes: filters.campaignTypes,
        },
        enabled: !!brandId && mapType === "world"
    });

    const metricsData = mapType === "turkey" ? turkeyGeographicData?.data || [] : worldGeographicData?.data || [];
    const isLoading = mapType === "turkey" ? isTurkeyLoading : isWorldLoading;

    return (
        <div className="space-y-6">
            {/* Controls Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-900">{t("geographic_insights.title")}</h3>
                </div>

                {/* Map Type Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setMapType("turkey")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mapType === "turkey"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t("offlineConversions.turkey") || "Türkiye"}
                    </button>
                    <button
                        onClick={() => setMapType("world")}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${mapType === "world"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {t("offlineConversions.world") || "Dünya"}
                    </button>
                </div>
            </div>

            {/* Map Visualization */}
            <GeographicMap
                filters={filters}
                showProviderFilter={false}
                showDataTable={false}
                showMapTypeSelector={false}
                mapType={mapType}
                onMapTypeChange={setMapType}
            />

            {/* Detailed Data Table */}
            <div className="vx-card">
                <div className="vx-card-header">
                    <div className="flex items-center gap-2">
                        <Map className="w-5 h-5 text-gray-700" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            {mapType === "turkey"
                                ? (t("offlineConversions.provinceBasedPerformance") || "İl Bazlı Performans")
                                : (t("offlineConversions.countryBasedPerformance") || "Ülke Bazlı Performans")}
                        </h3>
                    </div>
                </div>
                <div className="p-0">
                    <GeographicDataTable
                        mapType={mapType}
                        metricsData={metricsData}
                        loading={isLoading}
                        provider={provider}
                    />
                </div>
            </div>
        </div>
    );
}
