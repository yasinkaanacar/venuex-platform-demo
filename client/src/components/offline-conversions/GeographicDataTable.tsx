import { useMemo, useState } from "react";
import { GeographicMetricsResultDto } from "@/hooks/useDashboard";
import { fCurrency, fNumber, fPercent, useLocales } from "@/lib/formatters";
import { Provider } from "@/lib/constants";
import { getCities } from "turkey-neighbourhoods";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

interface GeographicDataTableProps {
    mapType: "turkey" | "world";
    metricsData: GeographicMetricsResultDto[];
    loading?: boolean;
    provider?: string;
}

export default function GeographicDataTable({
    mapType,
    metricsData,
    loading = false,
    provider,
}: GeographicDataTableProps) {
    const { t } = useLocales();
    const [page, setPage] = useState(0);
    const rowsPerPage = 10;

    // Get region name helper
    const getRegionName = useMemo(() => {
        return (iso: string): string => {
            if (mapType === "turkey") {
                const plateCode = iso.split("-")[1] || iso;
                const cities = getCities();
                const city = cities.find((c) => c.code === plateCode);
                return city?.name || plateCode;
            }
            return iso; // For world, use ISO code directly
        };
    }, [mapType]);

    // Add region names to data
    const enrichedData = useMemo(() => {
        return metricsData.map((item) => ({
            ...item,
            regionName: getRegionName(item.iso),
        }));
    }, [metricsData, getRegionName]);

    // Pagination
    const paginatedData = useMemo(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return enrichedData.slice(startIndex, endIndex);
    }, [enrichedData, page, rowsPerPage]);

    const totalPages = Math.ceil(enrichedData.length / rowsPerPage);

    const handlePrevPage = () => {
        setPage((p) => Math.max(0, p - 1));
    };

    const handleNextPage = () => {
        setPage((p) => Math.min(totalPages - 1, p + 1));
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading data...</div>;
    }

    if (metricsData.length === 0) {
        return <div className="p-8 text-center text-gray-500">No geographic data available</div>;
    }

    return (
        <div className="w-full overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="vx-th">{mapType === "turkey" ? t("common.province") : t("common.country")}</th>
                            <th className="vx-th text-right">{t("campaigns.top_performing_campaigns.impressions")}</th>
                            <th className="vx-th text-right">{t("campaigns.top_performing_campaigns.clicks")}</th>
                            <th className="vx-th text-right">{t("campaigns.top_performing_campaigns.spend")}</th>
                            {provider !== Provider.Meta && provider !== Provider.TikTok && (
                                <>
                                    <th className="vx-th text-right">{t("campaigns.top_performing_campaigns.visits")}</th>
                                    <th className="vx-th text-right">{t("campaigns.top_performing_campaigns.click_to_visit")}</th>
                                </>
                            )}
                            <th className="vx-th text-right">{t("campaigns.top_performing_campaigns.offline_purchases")}</th>
                            <th className="vx-th text-right">{t("campaigns.top_performing_campaigns.offline_revenue")}</th>
                            <th className="vx-th text-right">{t("campaigns.top_performing_campaigns.offline_roas")}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {paginatedData.map((row) => (
                            <tr key={row.iso} className="bg-white hover:bg-gray-50">
                                <td className="vx-td font-medium text-gray-900">{row.regionName}</td>
                                <td className="vx-td text-right">{fNumber(row.impressions)}</td>
                                <td className="vx-td text-right">{fNumber(row.clicks)}</td>
                                <td className="vx-td text-right">{fCurrency(row.spend)}</td>
                                {provider !== Provider.Meta && provider !== Provider.TikTok && (
                                    <>
                                        <td className="vx-td text-right">{fNumber(row.visits || 0)}</td>
                                        <td className="vx-td text-right">{fPercent(row.clickToVisitRate || 0)}</td>
                                    </>
                                )}
                                <td className="vx-td text-right">{fNumber(row.offlinePurchases || 0)}</td>
                                <td className="vx-td text-right">{fCurrency(row.offlineRevenue)}</td>
                                <td className="vx-td text-right text-green-600 font-medium">{row.offlineRoas.toFixed(1)}x</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
                    <span className="text-sm text-gray-700">
                        Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, enrichedData.length)} of {enrichedData.length} entries
                    </span>
                    <div className="flex space-x-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 0}
                            className="p-2 rounded bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={page >= totalPages - 1}
                            className="p-2 rounded bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
