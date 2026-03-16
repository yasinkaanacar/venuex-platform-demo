import { useState, useMemo, useCallback } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Dialog, DialogContent, DialogActions, IconButton, LinearProgress } from "@mui/material";
import { X, AlertTriangle, MapPin, Globe, ChevronRight, ChevronLeft, CheckCircle2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { useTranslation } from "@/contexts/LanguageContext";
import type { LocationConflict, ConflictAction, ConflictType } from "@/lib/mock/locations-platform";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    conflicts: LocationConflict[];
}

// ------------------------------------------------------------------
// Static config
// ------------------------------------------------------------------

const conflictTypeBadge: Record<ConflictType, { label: (t: any) => string; className: string }> = {
    only_in_vx: {
        label: (t) => t.locations.conflicts.onlyInVx,
        className: "bg-slate-100 text-slate-700",
    },
    only_in_google: {
        label: (t) => t.locations.conflicts.onlyInGoogle,
        className: "bg-blue-100 text-blue-700",
    },
    data_mismatch: {
        label: (t) => t.locations.conflicts.dataMismatch,
        className: "bg-amber-100 text-amber-700",
    },
};

const actionsByConflictType: Record<ConflictType, { value: ConflictAction; labelKey: string }[]> = {
    only_in_vx: [
        { value: "add_to_google", labelKey: "actionAddToGoogle" },
        { value: "delete_vx", labelKey: "actionDeleteVx" },
        { value: "skip", labelKey: "actionSkip" },
    ],
    only_in_google: [
        { value: "add_to_vx", labelKey: "actionAddToVx" },
        { value: "delete_google", labelKey: "actionDeleteGoogle" },
        { value: "skip", labelKey: "actionSkip" },
    ],
    data_mismatch: [
        { value: "use_vx", labelKey: "actionUseVx" },
        { value: "use_google", labelKey: "actionUseGoogle" },
        { value: "skip", labelKey: "actionSkip" },
    ],
};

const fieldDisplayLabel: Record<string, string> = {
    phone: "Phone",
    website: "Website",
    address: "Address",
    name: "Name",
    email: "Email",
    workingHours: "Working Hours",
};

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function actionLabel(action: ConflictAction, t: any): string {
    const map: Record<ConflictAction, string> = {
        add_to_google: t.locations.conflicts.actionAddToGoogle,
        delete_vx: t.locations.conflicts.actionDeleteVx,
        delete_google: t.locations.conflicts.actionDeleteGoogle,
        add_to_vx: t.locations.conflicts.actionAddToVx,
        use_vx: t.locations.conflicts.actionUseVx,
        use_google: t.locations.conflicts.actionUseGoogle,
        skip: t.locations.conflicts.actionSkip,
    };
    return map[action] ?? action;
}

// ------------------------------------------------------------------
// Conflict row (memoised to avoid re-renders across the virtual list)
// ------------------------------------------------------------------

interface RowProps {
    conflict: LocationConflict;
    selected: ConflictAction | undefined;
    onSelect: (id: string, action: ConflictAction) => void;
    t: any;
}

function ConflictRow({ conflict, selected, onSelect, t }: RowProps) {
    const badge = conflictTypeBadge[conflict.conflictType];
    const actions = actionsByConflictType[conflict.conflictType];
    const locationName = conflict.vxLocation?.name ?? conflict.googleLocation?.name ?? "—";
    const storeCode = conflict.vxLocation?.storeCode;

    return (
        <div className="px-6 py-4">
            {/* Row header */}
            <div className="flex items-center gap-2 mb-3 min-w-0">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="text-sm font-medium text-gray-900 truncate">{locationName}</span>
                {storeCode && (
                    <span className="text-xs text-gray-400 font-mono shrink-0">{storeCode}</span>
                )}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${badge.className}`}>
                    {badge.label(t)}
                </span>
            </div>

            {/* Data panel */}
            {conflict.conflictType === "data_mismatch" && conflict.mismatchFields && (
                <div className="mb-3 rounded-lg border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-3 text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 border-b border-gray-100">
                        <span>{t.locations.conflicts.fieldLabel}</span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                            {t.locations.conflicts.vxSide}
                        </span>
                        <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3 text-green-600" />
                            {t.locations.conflicts.googleSide}
                        </span>
                    </div>
                    {conflict.mismatchFields.map((f) => (
                        <div key={f.field} className="grid grid-cols-3 text-xs px-3 py-2 border-b last:border-b-0 border-gray-50">
                            <span className="text-gray-500 font-medium">{fieldDisplayLabel[f.field] ?? f.field}</span>
                            <span className={`truncate pr-2 ${selected === "use_vx" ? "text-blue-700 font-medium" : "text-gray-700"}`}>
                                {f.vxValue}
                            </span>
                            <span className={`truncate ${selected === "use_google" ? "text-green-700 font-medium" : "text-gray-700"}`}>
                                {f.googleValue}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {conflict.conflictType === "only_in_vx" && conflict.vxLocation && (
                <div className="mb-3 rounded-lg border border-gray-100 bg-slate-50 px-3 py-2 text-xs text-gray-600 space-y-0.5">
                    <div><span className="font-medium text-gray-500">Address: </span>{conflict.vxLocation.address}</div>
                    {conflict.vxLocation.phone && (
                        <div><span className="font-medium text-gray-500">Phone: </span>{conflict.vxLocation.phone}</div>
                    )}
                </div>
            )}

            {conflict.conflictType === "only_in_google" && conflict.googleLocation && (
                <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-gray-600 space-y-0.5">
                    <div><span className="font-medium text-gray-500">Address: </span>{conflict.googleLocation.address}</div>
                    {conflict.googleLocation.phone && (
                        <div><span className="font-medium text-gray-500">Phone: </span>{conflict.googleLocation.phone}</div>
                    )}
                </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
                {actions.map((action) => (
                    <button
                        key={action.value}
                        onClick={() => onSelect(conflict.id, action.value)}
                        className={`text-xs px-3 py-1.5 rounded-md border transition-colors font-medium ${
                            selected === action.value
                                ? action.value === "skip"
                                    ? "bg-gray-100 border-gray-300 text-gray-600"
                                    : "bg-blue-600 border-blue-600 text-white"
                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                        }`}
                    >
                        {(t.locations.conflicts as any)[action.labelKey]}
                    </button>
                ))}
            </div>
        </div>
    );
}

// ------------------------------------------------------------------
// Main component
// ------------------------------------------------------------------

type FilterType = ConflictType | "all";

export default function LocationConflictResolutionDialog({ open, onOpenChange, conflicts }: Props) {
    const { t } = useTranslation();
    const [step, setStep] = useState<"review" | "confirm">("review");
    const [resolutions, setResolutions] = useState<Record<string, ConflictAction>>({});
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<FilterType>("all");
    // applyProgress: null = idle, 0-100 = in progress
    const [applyProgress, setApplyProgress] = useState<number | null>(null);

    // State ref — when the scroll container mounts, this triggers a re-render so
    // the virtualizer receives a non-null scroll element with a real clientHeight.
    // useRef alone won't work here because the virtualizer initialises while the
    // Dialog is still animating in and scrollRef.current is null at that point.
    const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null);

    // ------------------------------------------------------------------
    // Derived state
    // ------------------------------------------------------------------

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return conflicts.filter((c) => {
            if (typeFilter !== "all" && c.conflictType !== typeFilter) return false;
            if (!q) return true;
            const name = (c.vxLocation?.name ?? c.googleLocation?.name ?? "").toLowerCase();
            const code = (c.vxLocation?.storeCode ?? "").toLowerCase();
            return name.includes(q) || code.includes(q);
        });
    }, [conflicts, search, typeFilter]);

    const resolvedCount = useMemo(
        () => Object.values(resolutions).filter((a) => a !== "skip").length,
        [resolutions]
    );
    const canProceed = resolvedCount > 0;

    const conflictsWithActions = useMemo(
        () => conflicts.filter((c) => resolutions[c.id] && resolutions[c.id] !== "skip"),
        [conflicts, resolutions]
    );

    // Grouped counts for confirm step
    const actionGroups = useMemo(() => {
        const groups: Record<string, number> = {};
        for (const [, action] of Object.entries(resolutions)) {
            if (action === "skip") continue;
            groups[action] = (groups[action] ?? 0) + 1;
        }
        return groups;
    }, [resolutions]);

    const skippedCount = useMemo(
        () => Object.values(resolutions).filter((a) => a === "skip").length,
        [resolutions]
    );
    const unresolvedCount = conflicts.filter((c) => !resolutions[c.id]).length;

    // ------------------------------------------------------------------
    // Virtualizer
    // ------------------------------------------------------------------

    const rowVirtualizer = useVirtualizer({
        count: filtered.length,
        getScrollElement: () => scrollEl,
        estimateSize: useCallback((index: number) => {
            const c = filtered[index];
            if (c.conflictType === "data_mismatch") return 220;
            return 140;
        }, [filtered]),
        overscan: 8,
    });

    // ------------------------------------------------------------------
    // Actions
    // ------------------------------------------------------------------

    const setAction = useCallback((conflictId: string, action: ConflictAction) => {
        setResolutions((prev) => ({ ...prev, [conflictId]: action }));
    }, []);

    // Bulk apply: set same action for all filtered conflicts of a given type
    const bulkApply = useCallback((action: ConflictAction) => {
        setResolutions((prev) => {
            const next = { ...prev };
            for (const c of filtered) {
                next[c.id] = action;
            }
            return next;
        });
    }, [filtered]);

    const handleClose = () => {
        onOpenChange(false);
        setTimeout(() => {
            setStep("review");
            setResolutions({});
            setSearch("");
            setTypeFilter("all");
            setApplyProgress(null);
        }, 300);
    };

    const handleApply = async () => {
        const total = conflictsWithActions.length;
        if (total === 0) return;

        // Simulate chunked batch apply — 50 per chunk, ~100ms per chunk
        const CHUNK = 50;
        let done = 0;
        setApplyProgress(0);

        while (done < total) {
            await new Promise((r) => setTimeout(r, 100));
            done = Math.min(done + CHUNK, total);
            setApplyProgress(Math.round((done / total) * 100));
        }

        showToast({ type: "success", title: t.locations.conflicts.applySuccess });
        handleClose();
    };

    // ------------------------------------------------------------------
    // Bulk action options for current filter
    // ------------------------------------------------------------------

    const bulkActions = useMemo((): { value: ConflictAction; labelKey: string }[] => {
        if (typeFilter === "all" || filtered.length === 0) return [];
        const type = typeFilter as ConflictType;
        return actionsByConflictType[type].filter((a) => a.value !== "skip");
    }, [typeFilter, filtered.length]);

    // ------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------

    const isApplying = applyProgress !== null;

    return (
        <Dialog
            open={open}
            onClose={isApplying ? undefined : handleClose}
            fullWidth
            maxWidth="lg"
            TransitionProps={{
                onExited: () => {
                    (document.activeElement as HTMLElement)?.blur();
                },
            }}
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "90vh",
                },
            }}
        >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-gray-900">{t.locations.conflicts.dialogTitle}</h2>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{t.locations.conflicts.dialogDescription}</p>
                    </div>
                    <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 shrink-0">
                        {(t.locations.conflicts.conflictsCount as string).replace("{{count}}", String(conflicts.length))}
                    </span>
                </div>
                <IconButton size="small" onClick={handleClose} disabled={isApplying}>
                    <X className="h-4 w-4 text-gray-500" />
                </IconButton>
            </div>

            {/* ── Step indicator + progress ── */}
            <div className="flex items-center justify-between px-6 py-2 bg-gray-50 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => !isApplying && setStep("review")}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                            step === "review" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        <span>1</span>
                        <span>{t.locations.conflicts.stepReview}</span>
                    </button>
                    <ChevronRight className="h-3 w-3 text-gray-300" />
                    <button
                        onClick={() => !isApplying && canProceed && setStep("confirm")}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                            step === "confirm"
                                ? "bg-blue-600 text-white"
                                : canProceed
                                ? "text-gray-500 hover:text-gray-700"
                                : "text-gray-300 cursor-not-allowed"
                        }`}
                    >
                        <span>2</span>
                        <span>{t.locations.conflicts.stepApply}</span>
                    </button>
                </div>

                {/* Resolved progress */}
                <span className="text-xs text-gray-500">
                    {(t.locations.conflicts.progressLabel as string)
                        .replace("{{resolved}}", String(resolvedCount))
                        .replace("{{total}}", String(conflicts.length))}
                </span>
            </div>

            {/* ── DialogContent (scrollable) ── */}
            <DialogContent sx={{ p: 0, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {step === "review" ? (
                    <>
                        {/* Toolbar: search + type filters */}
                        <div className="px-6 py-3 border-b border-gray-100 bg-white shrink-0 space-y-2">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder={t.locations.conflicts.searchPlaceholder as string}
                                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Type filter chips */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {(["all", "only_in_vx", "only_in_google", "data_mismatch"] as FilterType[]).map((type) => {
                                    const label =
                                        type === "all"
                                            ? (t.locations.conflicts.filterAll as string)
                                            : conflictTypeBadge[type].label(t);
                                    const count =
                                        type === "all"
                                            ? conflicts.length
                                            : conflicts.filter((c) => c.conflictType === type).length;
                                    const isActive = typeFilter === type;
                                    const colorClass =
                                        type === "all"
                                            ? isActive
                                                ? "bg-gray-800 border-gray-800 text-white"
                                                : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-800"
                                            : type === "only_in_vx"
                                            ? isActive
                                                ? "bg-slate-700 border-slate-700 text-white"
                                                : "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400"
                                            : type === "only_in_google"
                                            ? isActive
                                                ? "bg-blue-600 border-blue-600 text-white"
                                                : "bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400"
                                            : /* data_mismatch */ isActive
                                            ? "bg-amber-500 border-amber-500 text-white"
                                            : "bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-400";
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setTypeFilter(type)}
                                            className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${colorClass}`}
                                        >
                                            {label} <span className="opacity-60">{count}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Bulk apply bar — only shown when filtering a specific type */}
                            {bulkActions.length > 0 && (
                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                    <span className="text-xs text-gray-500 shrink-0">
                                        {(t.locations.conflicts.bulkApplyLabel as string).replace(
                                            "{{count}}",
                                            String(filtered.length)
                                        )}
                                    </span>
                                    {bulkActions.map((a) => (
                                        <button
                                            key={a.value}
                                            onClick={() => bulkApply(a.value)}
                                            className="text-xs px-2.5 py-1 rounded-md border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-medium transition-colors"
                                        >
                                            {(t.locations.conflicts as any)[a.labelKey]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Virtual list — min-h-0 lets the flex child shrink; setScrollEl (state-based callback ref)
                            triggers a re-render when the element mounts so the virtualizer receives a real clientHeight */}
                        <div ref={setScrollEl} className="flex-1 min-h-0 overflow-y-auto">
                            {filtered.length === 0 ? (
                                <div className="flex items-center justify-center h-32 text-sm text-gray-400">
                                    {t.locations.conflicts.noResults as string}
                                </div>
                            ) : (
                                <div
                                    style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}
                                >
                                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                        const conflict = filtered[virtualRow.index];
                                        return (
                                            <div
                                                key={conflict.id}
                                                data-index={virtualRow.index}
                                                ref={rowVirtualizer.measureElement}
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    transform: `translateY(${virtualRow.start}px)`,
                                                }}
                                                className="border-b border-gray-100 last:border-b-0"
                                            >
                                                <ConflictRow
                                                    conflict={conflict}
                                                    selected={resolutions[conflict.id]}
                                                    onSelect={setAction}
                                                    t={t}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    /* ── Confirm step ── */
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="mb-5">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                {t.locations.conflicts.summaryTitle}
                            </h3>
                            <p className="text-xs text-gray-500">{t.locations.conflicts.summaryDescription}</p>
                        </div>

                        {/* Action groups summary */}
                        {Object.keys(actionGroups).length === 0 ? (
                            <p className="text-sm text-gray-400 py-4 text-center">
                                {(t.locations.conflicts.unresolvedWarning as string).replace(
                                    "{{count}}",
                                    String(conflicts.length)
                                )}
                            </p>
                        ) : (
                            <div className="space-y-2 mb-4">
                                {(Object.entries(actionGroups) as [ConflictAction, number][]).map(([action, count]) => (
                                    <div
                                        key={action}
                                        className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                                    >
                                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                        <span className="flex-1 text-sm text-gray-700">{actionLabel(action, t)}</span>
                                        <span className="text-xs font-semibold text-gray-900 bg-white border border-gray-200 px-2 py-0.5 rounded-md">
                                            {(t.locations.conflicts.locationsCount as string).replace(
                                                "{{count}}",
                                                String(count)
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Per-location action list */}
                        {conflictsWithActions.length > 0 && (
                            <div className="mb-4">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    {t.locations.conflicts.perLocationTitle}
                                </h4>
                                <div className="space-y-1.5">
                                    {conflictsWithActions.map((conflict) => {
                                        const action = resolutions[conflict.id];
                                        const locationName = conflict.vxLocation?.name ?? conflict.googleLocation?.name ?? "—";
                                        const storeCode = conflict.vxLocation?.storeCode;
                                        const badge = conflictTypeBadge[conflict.conflictType];

                                        return (
                                            <div
                                                key={conflict.id}
                                                className="flex items-center gap-3 rounded-md border border-gray-100 bg-white px-3 py-2"
                                            >
                                                <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                                <div className="flex-1 min-w-0 flex items-center gap-2">
                                                    <span className="text-xs font-medium text-gray-900 truncate">{locationName}</span>
                                                    {storeCode && (
                                                        <span className="text-[10px] text-gray-400 font-mono shrink-0">{storeCode}</span>
                                                    )}
                                                </div>
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${badge.className}`}>
                                                    {badge.label(t)}
                                                </span>
                                                <span className="text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md shrink-0">
                                                    {actionLabel(action, t)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Footer counts */}
                        <div className="space-y-1">
                            {skippedCount > 0 && (
                                <p className="text-xs text-gray-400">
                                    {skippedCount} location(s) will be skipped.
                                </p>
                            )}
                            {unresolvedCount > 0 && (
                                <p className="text-xs text-amber-600">
                                    {(t.locations.conflicts.unresolvedWarning as string).replace(
                                        "{{count}}",
                                        String(unresolvedCount)
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Apply progress bar */}
                        {isApplying && (
                            <div className="mt-6 space-y-2">
                                <p className="text-xs text-gray-500">
                                    {(t.locations.conflicts.applyingProgress as string)
                                        .replace("{{current}}", String(Math.round((applyProgress! / 100) * conflictsWithActions.length)))
                                        .replace("{{total}}", String(conflictsWithActions.length))}
                                </p>
                                <LinearProgress variant="determinate" value={applyProgress!} sx={{ borderRadius: 4, height: 6 }} />
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>

            {/* ── Footer ── */}
            <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #f3f4f6", gap: 1, shrink: 0 }}>
                {step === "review" ? (
                    <>
                        <Button variant="ghost" size="sm" onClick={handleClose}>
                            {(t as any).common?.cancel ?? "Cancel"}
                        </Button>
                        <Button size="sm" onClick={() => setStep("confirm")} disabled={!canProceed}>
                            {t.locations.conflicts.nextButton}
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setStep("review")} disabled={isApplying}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            {t.locations.conflicts.backButton}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleApply}
                            disabled={isApplying || conflictsWithActions.length === 0}
                        >
                            {isApplying ? `${applyProgress}%` : t.locations.conflicts.applyButton}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
