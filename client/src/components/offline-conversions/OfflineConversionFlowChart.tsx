import { useLocation } from "wouter";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import {
    Iconify,
    fShortenNumber,
    useLocales,
    fPercentChangeCustom,
    fCapitalize,
    calculatePercentageChange,
    TrendInfo,
    NormalizedAdMetricsResponse
} from "./mock-setup";

const PATHS = { setup: { welcome: '/setup' } };

interface OfflineConversionFlowChartProps {
    providerMetrics?: NormalizedAdMetricsResponse;
    isLoadingProviderMetrics: boolean;
    selectedProvider: string;
    setupNeeded?: boolean;
    isMultiPlatform?: boolean;
}

export default function OfflineConversionFlowChart({
    providerMetrics,
    isLoadingProviderMetrics,
    selectedProvider,
    setupNeeded,
    isMultiPlatform,
}: OfflineConversionFlowChartProps) {
    const { t, translate } = useLocales();
    const [, setLocation] = useLocation();

    if (setupNeeded) {
        return (
            <div className="min-h-[320px] flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{t("common.integration_needed")}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {translate("reports.performance_chart.integration_needed_description", {
                            selectedProvider: fCapitalize(selectedProvider),
                        })}
                    </p>
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        onClick={() => {
                            setLocation(PATHS.setup.welcome);
                        }}
                    >
                        {t("onboarding.complete_setup")}
                    </button>
                </div>
            </div>
        );
    }
    if (isLoadingProviderMetrics) {
        return (
            <Stack sx={{ height: "306px", alignItems: "center", justifyContent: "center" }}>
                <CircularProgress />
            </Stack>
        );
    }

    return (
        <Stack
            direction="row"
            alignItems="center"
            sx={{
                mt: -4,
                maxWidth: "100%",
                overflowX: "auto",
                flexWrap: "nowrap",
            }}
        >
            <Stack gap={0.5}>
                <Typography variant="caption" color="grey.600">
                    {t("common.cost")}
                </Typography>
                <Typography variant="h6" color="primary.darker">
                    {`₺${fShortenNumber(providerMetrics?.cost.value ?? 0)}`}
                </Typography>
                <TrendInfo
                    trendDirection={providerMetrics?.cost?.change && providerMetrics?.cost?.change < 0 ? "down" : "up"}
                    value={fPercentChangeCustom(providerMetrics?.cost?.change ?? 0)}
                />
            </Stack>
            <Arrow />
            <Stack gap={0.5}>
                <Typography variant="caption" color="grey.600">
                    {t("common.impressions")}
                </Typography>
                <Typography variant="h6" color="primary.darker">
                    {`${fShortenNumber(providerMetrics?.impressions.value ?? 0)}`}
                </Typography>
                <TrendInfo
                    trendDirection={
                        providerMetrics?.impressions?.change && providerMetrics?.impressions?.change < 0 ? "down" : "up"
                    }
                    value={fPercentChangeCustom(providerMetrics?.impressions?.change ?? 0)}
                />
            </Stack>
            <Arrow />
            <Stack
                gap={0.5}
                sx={{
                    backgroundColor: "grey.200",
                    borderTopLeftRadius: "12px",
                    borderBottomLeftRadius: "12px",
                    p: 1.5,
                }}
            >
                <Typography variant="caption" color="grey.600">
                    {t("common.clicks")}
                </Typography>
                <Typography variant="h6" color="primary.darker">
                    {`${fShortenNumber(providerMetrics?.clicks.value ?? 0)}`}
                </Typography>
                <TrendInfo
                    trendDirection={
                        providerMetrics?.clicks?.change && providerMetrics?.clicks?.change < 0 ? "down" : "up"
                    }
                    value={fPercentChangeCustom(providerMetrics?.clicks?.change ?? 0)}
                />
            </Stack>
            <Box sx={{ fontSize: 0 }}>
                <FlowPath />
            </Box>
            <Stack sx={{ flex: 1, gap: "142px" }}>
                <Stack
                    sx={{ backgroundColor: "#E8F6FF", pt: 0.5, pb: 0.5, position: "relative" }}
                    alignItems="center"
                    direction="row"
                >
                    <Typography
                        sx={{
                            position: "absolute",
                            left: "-90px",
                            py: "6px",
                            px: "7px",
                            backgroundColor: "#009FFF",
                            color: "common.white",
                            fontSize: "13px",
                            lineHeight: "14px",
                            fontWeight: 800,
                            borderRadius: "10px",
                        }}
                    >
                        {t("common.online").toUpperCase()}
                    </Typography>
                    <TextGroup
                        label={t("common.online_sales")}
                        value={`${fShortenNumber(providerMetrics?.onlineOrders.value ?? 0)}`}
                        change={providerMetrics?.onlineOrders?.change ?? 0}
                    />
                    <Iconify icon="ic:round-arrow-right" color="#009FFF" />
                    <TextGroup
                        label={t("common.online_revenue")}
                        value={`₺${fShortenNumber(providerMetrics?.onlineRevenue.value ?? 0)}`}
                        change={providerMetrics?.onlineRevenue?.change ?? 0}
                    />
                    <Iconify icon="ic:round-arrow-right" color="#009FFF" />
                    <TextGroup
                        label={t("common.online_ROAS")}
                        value={`${fShortenNumber(providerMetrics?.onlineROI.value ?? 0)}`}
                        change={providerMetrics?.onlineROI?.change ?? 0}
                        sx={{ width: 100 }}
                    />
                    <Iconify icon="ic:round-arrow-right" color="#009FFF" />
                    <TextGroup
                        label={t("common.online_AOV")}
                        value={`₺${fShortenNumber(providerMetrics?.onlineAOV.value ?? 0)}`}
                        change={providerMetrics?.onlineAOV?.change ?? 0}
                        sx={{ width: 100 }}
                    />
                    <Iconify icon="ic:round-arrow-right" color="#009FFF" />
                </Stack>
                <Stack
                    sx={{ backgroundColor: "#FFF7E8", pt: 0.5, pb: 0.5, position: "relative" }}
                    alignItems="center"
                    justifyContent="space-between"
                    direction="row"
                >
                    {selectedProvider.toLowerCase() === "google" && (
                        <Box
                            sx={{
                                position: "absolute",
                                left: "-100px",
                                top: isMultiPlatform ? "-72px" : "-60px",
                            }}
                        >
                            <TextGroup
                                label={t("common.store_visits")}
                                value={`${fShortenNumber(providerMetrics?.storeVisit.value ?? 0)}`}
                                change={providerMetrics?.storeVisit?.change ?? 0}
                            />
                            {isMultiPlatform && (
                                <Typography
                                    variant="caption"
                                    sx={{ fontSize: "10px", color: "grey.500", mt: -0.5, pl: 0.5, display: "block" }}
                                >
                                    (Google Only)
                                </Typography>
                            )}
                        </Box>
                    )}
                    <Typography
                        sx={{
                            position: "absolute",
                            left: "-90px",
                            py: "6px",
                            px: "7px",
                            backgroundColor: "warning.main",
                            color: "common.white",
                            fontSize: "13px",
                            lineHeight: "14px",
                            fontWeight: 800,
                            borderRadius: "10px",
                        }}
                    >
                        {t("common.offline").toUpperCase()}
                    </Typography>
                    <TextGroup
                        label={t("common.offline_sales")}
                        value={`${fShortenNumber(providerMetrics?.offlineOrders.value ?? 0)}`}
                        change={providerMetrics?.offlineOrders?.change ?? 0}
                    />
                    <Iconify icon="ic:round-arrow-right" color="warning.main" />
                    <TextGroup
                        label={t("common.offline_revenue")}
                        value={`₺${fShortenNumber(providerMetrics?.offlineRevenue.value ?? 0)}`}
                        change={providerMetrics?.offlineRevenue?.change ?? 0}
                    />
                    <Iconify icon="ic:round-arrow-right" color="warning.main" />
                    <TextGroup
                        label={t("common.offline_ROAS")}
                        value={`${fShortenNumber(providerMetrics?.offlineROAS.value ?? 0)}`}
                        change={providerMetrics?.offlineROAS?.change ?? 0}
                        sx={{ width: 110 }}
                    />
                    <Iconify icon="ic:round-arrow-right" color="warning.main" />
                    <TextGroup
                        label={t("common.offline_AOV")}
                        value={`₺${fShortenNumber(providerMetrics?.offlineAOV.value ?? 0)}`}
                        change={providerMetrics?.offlineAOV?.change ?? 0}
                        sx={{ width: 100 }}
                    />
                    <Iconify icon="ic:round-arrow-right" color="warning.main" />
                </Stack>
            </Stack>
            <Box sx={{ transform: "scaleX(-1)", fontSize: 0 }}>
                <FlowPath />
            </Box>
            <Stack
                direction="row"
                sx={{
                    border: "1px solid",
                    borderColor: "grey.300",
                    boxShadow: "0px 20px 40px -4px rgba(145, 158, 171, 0.16)",
                    borderRadius: 1.5,
                    transform: "translateX(-6px)",
                    backgroundColor: "common.white",
                }}
                alignItems="center"
            >
                <TextGroup
                    label={t("common.omni_AOV")}
                    value={`₺${fShortenNumber(providerMetrics ? (providerMetrics.onlineAOV.value + providerMetrics.offlineAOV.value) / 2 : 0)}`}
                    sx={{ width: 80, pl: 1.5 }}
                    change={calculatePercentageChange(
                        ((providerMetrics?.onlineAOV?.value ?? 0) + (providerMetrics?.offlineAOV?.value ?? 0)) / 2,
                        ((providerMetrics?.onlineAOV?.past_value ?? 0) +
                            (providerMetrics?.offlineAOV?.past_value ?? 0)) /
                        2,
                    )}
                />
                <Iconify icon="ic:round-arrow-right" color="grey.500" />
                <TextGroup
                    label={t("common.omni_ROAS")}
                    value={`${fShortenNumber(providerMetrics ? providerMetrics.onlineROI.value + providerMetrics.offlineROAS.value : 0)}`}
                    sx={{ width: 80 }}
                    change={calculatePercentageChange(
                        (providerMetrics?.onlineROI?.value ?? 0) + (providerMetrics?.offlineROAS?.value ?? 0),
                        (providerMetrics?.onlineROI?.past_value ?? 0) + (providerMetrics?.offlineROAS?.past_value ?? 0),
                    )}
                />
                <Iconify icon="ic:round-arrow-right" color="grey.500" />
                <TextGroup
                    label={t("common.omni_revenue")}
                    value={`₺${fShortenNumber(providerMetrics ? providerMetrics.onlineRevenue.value + providerMetrics.offlineRevenue.value : 0)}`}
                    sx={{ width: 100 }}
                    change={calculatePercentageChange(
                        (providerMetrics?.onlineRevenue?.value ?? 0) + (providerMetrics?.offlineRevenue?.value ?? 0),
                        (providerMetrics?.onlineRevenue?.past_value ?? 0) +
                        (providerMetrics?.offlineRevenue?.past_value ?? 0),
                    )}
                />
            </Stack>
        </Stack>
    );
}

function Arrow() {
    return (
        <Box sx={{ mx: 2 }}>
            <svg width="50" height="8" viewBox="0 0 63 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M62.3536 4.35355C62.5488 4.15829 62.5488 3.84171 62.3536 3.64645L59.1716 0.464466C58.9763 0.269204 58.6597 0.269204 58.4645 0.464466C58.2692 0.659728 58.2692 0.976311 58.4645 1.17157L61.2929 4L58.4645 6.82843C58.2692 7.02369 58.2692 7.34027 58.4645 7.53553C58.6597 7.7308 58.9763 7.7308 59.1716 7.53553L62.3536 4.35355ZM0 4.5H62V3.5H0V4.5Z"
                    fill="#919EAB"
                />
            </svg>
        </Box>
    );
}

function FlowPath() {
    return (
        <svg width="107" height="460" viewBox="0 0 107 306" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 116V200C53.5 200 53.5 306 107 330V224C53.5 224 53.5 116 0 104Z"
                fill="#FFF7E8"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 116V202C53.5 202 53.5 92 107 82V-24C53.5 0 53.5 116 0 104Z"
                fill="#E8F6FF"
            />
        </svg>
    );
}

function TextGroup({ label, value, change, sx }: { label: string; value: string; change: number; sx?: any }) {
    let trendDirection: "up" | "down" | "stale" = "up";
    if (change < 0) {
        trendDirection = "down";
    } else if (change === 0) {
        trendDirection = "stale";
    }
    return (
        <Stack
            gap={0.5}
            sx={{
                p: 1.5,
                pl: 0.5,
                pr: 0.5,
                width: 120,
                ...sx,
            }}
        >
            <Typography variant="h6" color="primary.darker">
                {value}
            </Typography>
            <Typography variant="caption" color="grey.600">
                {label}
            </Typography>
            <TrendInfo
                trendDirection={trendDirection}
                value={fPercentChangeCustom((change ?? 0).toFixed(2), "00")}
                showZero
            />
        </Stack>
    );
}
