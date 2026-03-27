import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Copy,
  Pause,
  Play,
  Send,
} from "lucide-react";
import { SiGoogle, SiMeta, SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLocales, fNumber, fCurrency } from "@/lib/formatters";
import { TableEmptyState, TableErrorState, TableLoadingRow } from "@/components/shared/table-states";
import { cn } from "@/lib/utils";
import { segmentDataService } from "@/lib/mock/segments";
import { showToast } from "@/lib/toast";
import SegmentBuilderDialog from "./SegmentBuilderDialog";
import SegmentDetailDrawer from "./SegmentDetailDrawer";
import PushToPlatformDialog from "./PushToPlatformDialog";
import type {
  Segment,
  SegmentType,
  SegmentStatus,
  AdPlatform,
  SegmentPerformanceSummary,
  AttributionConfidence,
} from "@/lib/types/segments";

// ------------------------------------------------------------------
// Badge style maps
// ------------------------------------------------------------------

const STATUS_STYLES: Record<
  SegmentStatus,
  { bg: string; text: string; dot?: string }
> = {
  active: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500" },
  building: { bg: "bg-blue-100", text: "text-blue-800", dot: "bg-blue-500" },
  paused: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500" },
  error: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500" },
  draft: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
};

const TYPE_STYLES: Record<SegmentType, { bg: string; text: string }> = {
  value: { bg: "bg-indigo-100", text: "text-indigo-800" },
  category: { bg: "bg-emerald-100", text: "text-emerald-800" },
  rfm: { bg: "bg-violet-100", text: "text-violet-800" },
  store: { bg: "bg-amber-100", text: "text-amber-800" },
  combination: { bg: "bg-rose-100", text: "text-rose-800" },
};

const PLATFORM_ICON: Record<AdPlatform, React.ElementType> = {
  google: SiGoogle,
  meta: SiMeta,
  tiktok: SiTiktok,
};

const PLATFORM_COLOR: Record<AdPlatform, string> = {
  google: "text-[#4285F4]",
  meta: "text-[#0081FB]",
  tiktok: "text-[#000000]",
};

const CONFIDENCE_STYLES: Record<AttributionConfidence, { bg: string; text: string }> = {
  direct: { bg: "bg-green-100", text: "text-green-700" },
  estimated: { bg: "bg-yellow-100", text: "text-yellow-700" },
};

// ------------------------------------------------------------------
// Relative time helper
// ------------------------------------------------------------------

function relativeTime(dateStr: string, t: (key: string) => string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return t("segments.list.timeJustNow") || "Just now";
  if (diffMin < 60) return `${diffMin}${t("segments.list.timeMinAgo") || "m ago"}`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}${t("segments.list.timeHourAgo") || "h ago"}`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}${t("segments.list.timeDayAgo") || "d ago"}`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}${t("segments.list.timeMonthAgo") || "mo ago"}`;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------

export default function SegmentListTable() {
  const { t } = useLocales();
  const queryClient = useQueryClient();

  // Data
  const { data: segments = [], isLoading, isError, refetch } = useQuery<Segment[]>({
    queryKey: [QUERY_KEYS.SEGMENTS],
  });

  const { data: perfSummaries = [] } = useQuery<SegmentPerformanceSummary[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_PERFORMANCE_SUMMARIES],
  });

  const perfMap = useMemo(() => {
    const map = new Map<string, SegmentPerformanceSummary>();
    perfSummaries.forEach((s) => map.set(s.segmentId, s));
    return map;
  }, [perfSummaries]);

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // UI state
  const [builderOpen, setBuilderOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [pushDialogOpen, setPushDialogOpen] = useState(false);
  const [pushTargetSegment, setPushTargetSegment] = useState<Segment | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close action menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  // Filtered segments
  const filtered = useMemo(() => {
    let result = [...segments];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((s) => s.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((s) => s.status === statusFilter);
    }

    return result;
  }, [segments, search, typeFilter, statusFilter]);

  // Row click
  function handleRowClick(segmentId: string) {
    setSelectedSegmentId(segmentId);
    setDetailOpen(true);
  }

  function invalidateSegmentQueries() {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS_SUMMARY] });
  }

  // Mock: Shows info toast. Full edit mode requires builder refactor (out of scope).
  function handleEdit(segment: Segment) {
    setOpenMenuId(null);
    showToast({ type: "info", title: t("segments.detail.editComingSoon") || "Edit mode coming soon" });
  }

  // Mock: Duplicates segment in memory. Wire to POST /api/segments in production.
  async function handleDuplicate(segment: Segment) {
    setOpenMenuId(null);
    try {
      await segmentDataService.createSegment({
        name: `${segment.name} (Copy)`,
        description: segment.description,
        type: segment.type,
        ruleGroups: segment.ruleGroups,
        groupLogic: segment.groupLogic,
        estimatedSize: segment.estimatedSize,
        tags: segment.tags,
        status: "draft",
      });
      invalidateSegmentQueries();
      showToast({
        type: "success",
        title: t("segments.detail.segmentDuplicated") || "Segment duplicated",
        description: segment.name,
      });
    } catch {
      showToast({ type: "error", title: t("common.error") || "Error" });
    }
  }

  // Mock: Updates segment status in memory. Wire to PATCH /api/segments/:id in production.
  async function handleToggleStatus(segment: Segment) {
    setOpenMenuId(null);
    const newStatus = segment.status === "active" ? "paused" : "active";
    try {
      await segmentDataService.updateSegment(segment.id, { status: newStatus });
      invalidateSegmentQueries();
      showToast({
        type: "success",
        title: newStatus === "paused"
          ? (t("segments.detail.segmentPaused") || "Segment paused")
          : (t("segments.detail.segmentActivated") || "Segment activated"),
        description: segment.name,
      });
    } catch {
      showToast({ type: "error", title: t("common.error") || "Error" });
    }
  }

  // Mock: Deletes segment from memory. Wire to DELETE /api/segments/:id in production.
  async function handleDelete(segment: Segment) {
    setOpenMenuId(null);
    const confirmed = window.confirm(
      t("segments.detail.deleteConfirm") || "Are you sure you want to delete this segment?",
    );
    if (!confirmed) return;
    try {
      await segmentDataService.deleteSegment(segment.id);
      invalidateSegmentQueries();
      showToast({
        type: "success",
        title: t("segments.detail.segmentDeleted") || "Segment deleted",
        description: segment.name,
      });
    } catch {
      showToast({ type: "error", title: t("common.error") || "Error" });
    }
  }

  // ------------------------------------------------------------------
  // Render helpers
  // ------------------------------------------------------------------

  function renderStatusBadge(status: SegmentStatus) {
    const style = STATUS_STYLES[status];
    const label = t(`segments.status.${status}`) || status;
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
          style.bg,
          style.text,
        )}
      >
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            style.dot,
            status === "building" && "animate-pulse",
          )}
        />
        {label}
      </span>
    );
  }

  function renderTypeBadge(type: SegmentType) {
    const style = TYPE_STYLES[type];
    const labelKey = `segments.builder.${type === "value" ? "valueBased" : type === "category" ? "categoryBased" : type === "rfm" ? "rfmBased" : type === "store" ? "storeBased" : "combination"}`;
    const label = t(labelKey) || type;
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
          style.bg,
          style.text,
        )}
      >
        {label}
      </span>
    );
  }

  function renderPlatformIcons(segment: Segment) {
    const platforms = segment.platformPushes.map((pp) => pp.platform);
    const uniquePlatforms = Array.from(new Set(platforms)) as AdPlatform[];

    if (uniquePlatforms.length === 0) {
      return <span className="text-xs text-muted-foreground">--</span>;
    }

    return (
      <div className="flex items-center gap-1.5">
        {uniquePlatforms.map((platform: AdPlatform) => {
          const Icon = PLATFORM_ICON[platform];
          return (
            <Icon
              key={platform}
              className={cn("w-4 h-4", PLATFORM_COLOR[platform])}
              title={platform}
            />
          );
        })}
      </div>
    );
  }

  function renderActionsMenu(segment: Segment) {
    const isOpen = openMenuId === segment.id;

    return (
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuId(isOpen ? null : segment.id);
          }}
          className="p-1.5 rounded hover:bg-muted transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </button>

        {isOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-full mt-1 z-50 min-w-[160px] rounded-md border bg-popover p-1 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left"
              onClick={() => {
                setSelectedSegmentId(segment.id);
                setDetailOpen(true);
                setOpenMenuId(null);
              }}
            >
              <Eye className="w-3.5 h-3.5" />
              {t("actions.viewDetails") || "View Details"}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left"
              onClick={() => handleEdit(segment)}
            >
              <Edit className="w-3.5 h-3.5" />
              {t("common.edit") || "Edit"}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left"
              onClick={() => handleDuplicate(segment)}
            >
              <Copy className="w-3.5 h-3.5" />
              {t("segments.list.duplicate") || "Duplicate"}
            </button>
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left",
                segment.status !== "active" && "opacity-50 cursor-not-allowed",
              )}
              onClick={() => {
                if (segment.status !== "active") return;
                setPushTargetSegment(segment);
                setPushDialogOpen(true);
                setOpenMenuId(null);
              }}
            >
              <Send className="w-3.5 h-3.5" />
              {t("segments.push.pushDialog.title") || "Push to Platform"}
            </button>
            {segment.status === "active" ? (
              <button
                type="button"
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left"
                onClick={() => handleToggleStatus(segment)}
              >
                <Pause className="w-3.5 h-3.5" />
                {t("segments.detail.pauseSegment") || "Pause"}
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent transition-colors text-left"
                onClick={() => handleToggleStatus(segment)}
              >
                <Play className="w-3.5 h-3.5" />
                {t("segments.detail.activateSegment") || "Activate"}
              </button>
            )}
            <div className="h-px bg-border my-1" />
            <button
              type="button"
              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-red-50 text-red-600 transition-colors text-left"
              onClick={() => handleDelete(segment)}
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t("common.delete") || "Delete"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Main render
  // ------------------------------------------------------------------

  return (
    <div className="space-y-4">
      {/* Toolbar: search, filters, create button */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-[320px]">
          <Input
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
            placeholder={
              t("segments.list.searchPlaceholder") || "Search segments..."
            }
            InputProps={{
              startAdornment: (
                <Search className="w-4 h-4 text-muted-foreground mr-1" />
              ),
            }}
          />
        </div>

        {/* Type filter */}
        <Select
          value={typeFilter}
          onValueChange={setTypeFilter}
          displayLabel={
            typeFilter === "all"
              ? t("segments.list.allTypes") || "All Types"
              : t(
                  `segments.builder.${typeFilter === "value" ? "valueBased" : typeFilter === "category" ? "categoryBased" : typeFilter === "rfm" ? "rfmBased" : typeFilter === "store" ? "storeBased" : "combination"}`,
                ) || typeFilter
          }
          width={150}
        >
          <SelectContent>
            <SelectItem value="all">
              {t("segments.list.allTypes") || "All Types"}
            </SelectItem>
            <SelectItem value="value">
              {t("segments.builder.valueBased") || "Value-Based"}
            </SelectItem>
            <SelectItem value="category">
              {t("segments.builder.categoryBased") || "Category-Based"}
            </SelectItem>
            <SelectItem value="rfm">
              {t("segments.builder.rfmBased") || "RFM-Based"}
            </SelectItem>
            <SelectItem value="store">
              {t("segments.builder.storeBased") || "Store-Based"}
            </SelectItem>
            <SelectItem value="combination">
              {t("segments.builder.combination") || "Combination"}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
          displayLabel={
            statusFilter === "all"
              ? t("segments.list.allStatuses") || "All Statuses"
              : t(`segments.status.${statusFilter}`) || statusFilter
          }
          width={150}
        >
          <SelectContent>
            <SelectItem value="all">
              {t("segments.list.allStatuses") || "All Statuses"}
            </SelectItem>
            <SelectItem value="active">
              {t("segments.status.active") || "Active"}
            </SelectItem>
            <SelectItem value="building">
              {t("segments.status.building") || "Building"}
            </SelectItem>
            <SelectItem value="paused">
              {t("segments.status.paused") || "Paused"}
            </SelectItem>
            <SelectItem value="error">
              {t("segments.status.error") || "Error"}
            </SelectItem>
            <SelectItem value="draft">
              {t("segments.status.draft") || "Draft"}
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Create button */}
        <Button
          variant="default"
          size="sm"
          onClick={() => setBuilderOpen(true)}
        >
          <Plus className="w-4 h-4" />
          {t("segments.builder.createSegment") || "Create Segment"}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-center px-2 py-3 font-medium text-muted-foreground w-10">
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  {t("segments.list.name") || "Segment Name"}
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  {t("segments.list.type") || "Type"}
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  {t("segments.list.size") || "Audience Size"}
                </th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                  {t("segments.list.platforms") || "Platforms"}
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  {t("segments.performance.totalSpend") || "Total Spend"}
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  {t("segments.performance.conversions") || "Conversions"}
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  {t("segments.performance.roas") || "ROAS"}
                </th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">
                  {t("segments.performance.confidence") || "Confidence"}
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  {t("segments.list.lastUpdated") || "Last Updated"}
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground w-12">
                  {t("segments.list.actions") || "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableLoadingRow colSpan={11} text={t("common.loading") || "Loading..."} />
              ) : isError ? (
                <TableErrorState colSpan={11} onRetry={refetch} />
              ) : filtered.length === 0 ? (
                <TableEmptyState
                  colSpan={11}
                  title={
                    search || typeFilter !== "all" || statusFilter !== "all"
                      ? (t("segments.list.noSegmentsFiltered") || "No segments match your filters.")
                      : (t("segments.list.noSegments") ||
                        "No segments created yet. Create your first audience segment to get started.")
                  }
                />
              ) : (
                filtered.map((segment) => (
                  <tr
                    key={segment.id}
                    onClick={() => handleRowClick(segment.id)}
                    className="border-b last:border-b-0 hover:bg-muted/30 cursor-pointer transition-colors"
                  >
                    {/* Status dot */}
                    <td className="px-2 py-3 text-center">
                      <span
                        className={cn(
                          "inline-block w-2.5 h-2.5 rounded-full",
                          segment.status === "active" ? "bg-green-500" :
                          segment.status === "paused" ? "bg-yellow-500" :
                          "bg-gray-400",
                        )}
                        title={t(`segments.status.${segment.status}`) || segment.status}
                      />
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-foreground">
                          {segment.name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {segment.description}
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      {renderTypeBadge(segment.type)}
                    </td>

                    {/* Audience Size */}
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {fNumber(segment.actualSize ?? segment.estimatedSize)}
                    </td>

                    {/* Platforms */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        {renderPlatformIcons(segment)}
                      </div>
                    </td>

                    {/* Total Spend (30d) */}
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {perfMap.get(segment.id)?.totalSpend
                        ? fCurrency(perfMap.get(segment.id)!.totalSpend)
                        : <span className="text-muted-foreground">--</span>}
                    </td>

                    {/* Conversions (30d) */}
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {perfMap.get(segment.id)?.conversions
                        ? fNumber(perfMap.get(segment.id)!.conversions)
                        : <span className="text-muted-foreground">--</span>}
                    </td>

                    {/* ROAS */}
                    <td className="px-4 py-3 text-right font-medium tabular-nums">
                      {perfMap.get(segment.id)?.roas
                        ? <span className="text-foreground">{perfMap.get(segment.id)!.roas.toFixed(1)}x</span>
                        : <span className="text-muted-foreground">--</span>}
                    </td>

                    {/* Confidence */}
                    <td className="px-4 py-3 text-center">
                      {perfMap.get(segment.id)?.confidence ? (
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                            CONFIDENCE_STYLES[perfMap.get(segment.id)!.confidence].bg,
                            CONFIDENCE_STYLES[perfMap.get(segment.id)!.confidence].text,
                          )}
                        >
                          {t(`segments.performance.confidence${perfMap.get(segment.id)!.confidence.charAt(0).toUpperCase()}${perfMap.get(segment.id)!.confidence.slice(1)}`) || perfMap.get(segment.id)!.confidence}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">--</span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {relativeTime(segment.updatedAt, t)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      {renderActionsMenu(segment)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Builder dialog */}
      {builderOpen && (
        <SegmentBuilderDialog
          open={builderOpen}
          onOpenChange={setBuilderOpen}
          onCreated={(segment) => {
            setPushTargetSegment(segment);
            setPushDialogOpen(true);
          }}
        />
      )}

      {/* Detail drawer */}
      {detailOpen && selectedSegmentId && (
        <SegmentDetailDrawer
          open={detailOpen}
          onOpenChange={setDetailOpen}
          segmentId={selectedSegmentId}
        />
      )}

      {/* Push to Platform dialog */}
      {pushTargetSegment && (
        <PushToPlatformDialog
          open={pushDialogOpen}
          onOpenChange={setPushDialogOpen}
          segment={pushTargetSegment}
        />
      )}
    </div>
  );
}
