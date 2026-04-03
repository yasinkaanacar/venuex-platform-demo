import { useState } from "react";
import { useLocales } from "@/lib/formatters";
import SegmentSummaryCards from "@/components/segments/SegmentSummaryCards";
import SegmentListTable from "@/components/segments/SegmentListTable";
import PlatformPushDashboard from "@/components/segments/PlatformPushDashboard";

type Tab = "audiences" | "platform_push";

export default function Segments() {
  const [mainTab, setMainTab] = useState<Tab>("audiences");
  const { t } = useLocales();

  return (
    <div className="vx-page">
      {/* Tab Navigation - Sticky */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
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
              onClick={() => setMainTab("platform_push")}
              className={`vx-tab ${mainTab === "platform_push" ? "vx-tab-active" : ""}`}
              data-testid="tab-platform-push"
            >
              {t("segments.tabs.platformPush") || "Platform Push"}
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

        {mainTab === "platform_push" && <PlatformPushDashboard />}
      </div>
    </div>
  );
}
