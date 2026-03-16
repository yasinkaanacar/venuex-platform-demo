
import { useState } from "react";
import GeographicMap from "./GeographicMap";
import GeographicDataTable from "./GeographicDataTable";
import { FilterState } from "@/lib/types/common";
import { useApiInsightsByGeographySummary } from "@/hooks/useDashboard";
import { useLocales } from "@/lib/formatters";
import { useBrandContext } from "@/hooks/useAuth";
import { formatDate } from "@/lib/formatDate";
import { Provider } from "@/lib/constants";
import { Info } from "lucide-react";

interface GeographicPerformanceProps {
    filters: FilterState;
    dateRange?: { startDate: Date; endDate: Date };
}

type MapType = "turkey" | "world";

export default function GeographicPerformance({ filters, dateRange }: GeographicPerformanceProps) {
    const { t } = useLocales();
    const { brandId } = useBrandContext();
    const [mapType, setMapType] = useState<MapType>("turkey");

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
        <div className="vx-card">
            <div className="vx-card-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">{t("geographic_insights.title")}</h3>
                        <div className="relative group">
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                                {t("geographic_insights.tooltip") || "Shows campaign performance broken down by geographic region. Revenue and ROAS are color-coded on the map — darker areas indicate stronger performance."}
                                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                            </div>
                        </div>
                        <span className="text-xs text-gray-400">{t("geographic_insights.description") || "Regional breakdown of ad-attributed revenue and ROAS"}</span>
                    </div>

                    {/* Map Type Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setMapType("turkey")}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mapType === "turkey"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t("offlineConversions.turkey") || "Türkiye"}
                        </button>
                        <button
                            onClick={() => setMapType("world")}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${mapType === "world"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t("offlineConversions.world") || "Dünya"}
                        </button>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {mapType === "turkey"
                        ? (t("offlineConversions.provinceBasedPerformance") || "İl Bazlı Performans")
                        : (t("offlineConversions.countryBasedPerformance") || "Ülke Bazlı Performans")}
                </p>
            </div>

            <div className="vx-card-body vx-surface-muted space-y-4">
                {/* Map */}
                <GeographicMap
                    embedded
                    filters={filters}
                    showProviderFilter={false}
                    showDataTable={false}
                    showMapTypeSelector={false}
                    mapType={mapType}
                    onMapTypeChange={setMapType}
                />

                {/* Data Table */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
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
