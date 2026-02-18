import { useState, lazy, Suspense } from "react";
import { useLocales } from "@/lib/formatters";
import SegmentSummaryCards from "@/components/segments/SegmentSummaryCards";
import SegmentListTable from "@/components/segments/SegmentListTable";
import PlatformPushDashboard from "@/components/segments/PlatformPushDashboard";
import FeedLabelDashboard from "@/components/segments/FeedLabelDashboard";
import ExportDashboard from "@/components/segments/ExportDashboard";
import SegmentInsightsDashboard from "@/components/segments/SegmentInsightsDashboard";

const SegmentAttributionDashboard = lazy(
  () => import("@/components/segments/SegmentAttributionDashboard"),
);

type Tab = "audiences" | "insights" | "platform_push" | "feed_labels" | "exports" | "attribution";

export default function Segments() {
  const [mainTab, setMainTab] = useState<Tab>("audiences");
  const { t } = useLocales();

  return (
    <div className="vx-page">
      {/* Tab Navigation - Sticky */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="vx-tabs">
            <button
              onClick={() => setMainTab("audiences")}
              className={`vx-tab ${mainTab === "audiences" ? "vx-tab-active" : ""}`}
              data-testid="tab-audiences"
            >
              {t("segments.tabs.audiences") || "Audiences"}
            </button>
            <button
              onClick={() => setMainTab("insights")}
              className={`vx-tab ${mainTab === "insights" ? "vx-tab-active" : ""}`}
              data-testid="tab-insights"
            >
              {t("segments.tabs.insights") || "Insights"}
            </button>
            <button
              onClick={() => setMainTab("platform_push")}
              className={`vx-tab ${mainTab === "platform_push" ? "vx-tab-active" : ""}`}
              data-testid="tab-platform-push"
            >
              {t("segments.tabs.platformPush") || "Platform Push"}
            </button>
            <button
              onClick={() => setMainTab("feed_labels")}
              className={`vx-tab ${mainTab === "feed_labels" ? "vx-tab-active" : ""}`}
              data-testid="tab-feed-labels"
            >
              {t("segments.tabs.feedLabels") || "Feed Labels"}
            </button>
            <button
              onClick={() => setMainTab("exports")}
              className={`vx-tab ${mainTab === "exports" ? "vx-tab-active" : ""}`}
              data-testid="tab-exports"
            >
              {t("segments.tabs.exports") || "Exports"}
            </button>
            <button
              onClick={() => setMainTab("attribution")}
              className={`vx-tab ${mainTab === "attribution" ? "vx-tab-active" : ""}`}
              data-testid="tab-attribution"
            >
              {t("segments.tabs.attribution") || "Attribution"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="vx-page-body min-h-[calc(100vh-8rem)]">
        {mainTab === "audiences" && (
          <>
            <SegmentSummaryCards />
            <div className="vx-section-stack">
              <SegmentListTable />
            </div>
          </>
        )}

        {mainTab === "insights" && <SegmentInsightsDashboard />}
        {mainTab === "platform_push" && <PlatformPushDashboard />}
        {mainTab === "feed_labels" && <FeedLabelDashboard />}
        {mainTab === "exports" && <ExportDashboard />}
        {mainTab === "attribution" && (
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            }
          >
            <SegmentAttributionDashboard />
          </Suspense>
        )}
      </div>
    </div>
  );
}
