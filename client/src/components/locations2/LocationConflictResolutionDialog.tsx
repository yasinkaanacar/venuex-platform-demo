import { useState } from "react";
import { Dialog, DialogContent, DialogActions, IconButton } from "@mui/material";
import { X, AlertTriangle, MapPin, Globe, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { useTranslation } from "@/contexts/LanguageContext";
import type { LocationConflict, ConflictAction, ConflictType } from "@/lib/mock-locations";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    conflicts: LocationConflict[];
}

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

const actionsByConflictType: Record<ConflictType, { value: ConflictAction; labelKey: keyof any }[]> = {
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

const actionSummaryLabel = (action: ConflictAction, t: any): string => {
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
};

const fieldDisplayLabel: Record<string, string> = {
    phone: "Phone",
    website: "Website",
    address: "Address",
    name: "Name",
    email: "Email",
    workingHours: "Working Hours",
};

export default function LocationConflictResolutionDialog({ open, onOpenChange, conflicts }: Props) {
    const { t } = useTranslation();
    const [step, setStep] = useState<"review" | "confirm">("review");
    const [resolutions, setResolutions] = useState<Record<string, ConflictAction>>({});
    const [applying, setApplying] = useState(false);

    const setAction = (conflictId: string, action: ConflictAction) => {
        setResolutions((prev) => ({ ...prev, [conflictId]: action }));
    };

    const resolvedCount = Object.values(resolutions).filter((a) => a !== "skip").length;
    const canProceed = Object.keys(resolutions).length > 0 && resolvedCount > 0;

    const handleClose = () => {
        onOpenChange(false);
        // Reset after close animation
        setTimeout(() => {
            setStep("review");
            setResolutions({});
        }, 300);
    };

    const handleApply = async () => {
        setApplying(true);
        await new Promise((r) => setTimeout(r, 800));
        setApplying(false);
        showToast({ type: "success", title: t.locations.conflicts.applySuccess });
        handleClose();
    };

    const conflictsWithActions = conflicts.filter((c) => resolutions[c.id] && resolutions[c.id] !== "skip");

    return (
        <Dialog
            open={open}
            onClose={handleClose}
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
                },
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            {t.locations.conflicts.dialogTitle}
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {t.locations.conflicts.dialogDescription}
                        </p>
                    </div>
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {(t.locations.conflicts.conflictsCount as string).replace("{{count}}", String(conflicts.length))}
                    </span>
                </div>
                <IconButton size="small" onClick={handleClose}>
                    <X className="h-4 w-4 text-gray-500" />
                </IconButton>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 px-6 py-2 bg-gray-50 border-b border-gray-100">
                <button
                    onClick={() => setStep("review")}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full transition-colors ${
                        step === "review"
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                    <span>1</span>
                    <span>{t.locations.conflicts.stepReview}</span>
                </button>
                <ChevronRight className="h-3 w-3 text-gray-300" />
                <button
                    onClick={() => canProceed && setStep("confirm")}
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

            <DialogContent sx={{ p: 0 }}>
                {step === "review" ? (
                    <div className="divide-y divide-gray-100">
                        {conflicts.map((conflict) => {
                            const badge = conflictTypeBadge[conflict.conflictType];
                            const actions = actionsByConflictType[conflict.conflictType];
                            const selected = resolutions[conflict.id];
                            const locationName =
                                conflict.vxLocation?.name ?? conflict.googleLocation?.name ?? "—";
                            const storeCode = conflict.vxLocation?.storeCode;

                            return (
                                <div key={conflict.id} className="px-6 py-4">
                                    {/* Row header */}
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-medium text-gray-900 truncate">
                                                        {locationName}
                                                    </span>
                                                    {storeCode && (
                                                        <span className="text-xs text-gray-400 font-mono">
                                                            {storeCode}
                                                        </span>
                                                    )}
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                                                    >
                                                        {badge.label(t)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Data comparison */}
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
                                                <div
                                                    key={f.field}
                                                    className="grid grid-cols-3 text-xs px-3 py-2 border-b last:border-b-0 border-gray-50"
                                                >
                                                    <span className="text-gray-500 font-medium">
                                                        {fieldDisplayLabel[f.field] ?? f.field}
                                                    </span>
                                                    <span
                                                        className={`truncate ${
                                                            selected === "use_vx"
                                                                ? "text-blue-700 font-medium"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {f.vxValue}
                                                    </span>
                                                    <span
                                                        className={`truncate ${
                                                            selected === "use_google"
                                                                ? "text-green-700 font-medium"
                                                                : "text-gray-700"
                                                        }`}
                                                    >
                                                        {f.googleValue}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {conflict.conflictType === "only_in_vx" && conflict.vxLocation && (
                                        <div className="mb-3 rounded-lg border border-gray-100 bg-slate-50 px-3 py-2 text-xs text-gray-600 space-y-0.5">
                                            <div>
                                                <span className="font-medium text-gray-500">Address: </span>
                                                {conflict.vxLocation.address}
                                            </div>
                                            {conflict.vxLocation.phone && (
                                                <div>
                                                    <span className="font-medium text-gray-500">Phone: </span>
                                                    {conflict.vxLocation.phone}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {conflict.conflictType === "only_in_google" && conflict.googleLocation && (
                                        <div className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-gray-600 space-y-0.5">
                                            <div>
                                                <span className="font-medium text-gray-500">Address: </span>
                                                {conflict.googleLocation.address}
                                            </div>
                                            {conflict.googleLocation.phone && (
                                                <div>
                                                    <span className="font-medium text-gray-500">Phone: </span>
                                                    {conflict.googleLocation.phone}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {actions.map((action) => (
                                            <button
                                                key={action.value}
                                                onClick={() => setAction(conflict.id, action.value)}
                                                className={`text-xs px-3 py-1.5 rounded-md border transition-colors font-medium ${
                                                    selected === action.value
                                                        ? action.value === "skip"
                                                            ? "bg-gray-100 border-gray-300 text-gray-600"
                                                            : "bg-blue-600 border-blue-600 text-white"
                                                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
                                                }`}
                                            >
                                                {(t.locations.conflicts as any)[action.labelKey as string]}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Confirm step */
                    <div className="px-6 py-6">
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                {t.locations.conflicts.summaryTitle}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {t.locations.conflicts.summaryDescription}
                            </p>
                        </div>

                        {conflictsWithActions.length === 0 ? (
                            <div className="text-sm text-gray-400 py-4 text-center">
                                {(t.locations.conflicts.unresolvedWarning as string).replace(
                                    "{{count}}",
                                    String(conflicts.length)
                                )}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {conflictsWithActions.map((conflict) => {
                                    const action = resolutions[conflict.id];
                                    const locationName =
                                        conflict.vxLocation?.name ?? conflict.googleLocation?.name ?? "—";
                                    return (
                                        <div
                                            key={conflict.id}
                                            className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                                        >
                                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm text-gray-800 truncate block">
                                                    {locationName}
                                                </span>
                                                {conflict.vxLocation?.storeCode && (
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {conflict.vxLocation.storeCode}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md whitespace-nowrap">
                                                {actionSummaryLabel(action, t)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Skipped items */}
                        {conflicts.filter((c) => resolutions[c.id] === "skip").length > 0 && (
                            <p className="text-xs text-gray-400 mt-3">
                                {conflicts.filter((c) => resolutions[c.id] === "skip").length} item(s) will be skipped.
                            </p>
                        )}

                        {/* Unresolved */}
                        {conflicts.filter((c) => !resolutions[c.id]).length > 0 && (
                            <p className="text-xs text-amber-600 mt-2">
                                {(t.locations.conflicts.unresolvedWarning as string).replace(
                                    "{{count}}",
                                    String(conflicts.filter((c) => !resolutions[c.id]).length)
                                )}
                            </p>
                        )}
                    </div>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #f3f4f6", gap: 1 }}>
                {step === "review" ? (
                    <>
                        <Button variant="ghost" size="sm" onClick={handleClose}>
                            {(t as any).common?.cancel ?? "Cancel"}
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => setStep("confirm")}
                            disabled={!canProceed}
                        >
                            {t.locations.conflicts.nextButton}
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setStep("review")}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            {t.locations.conflicts.backButton}
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleApply}
                            disabled={applying || conflictsWithActions.length === 0}
                        >
                            {applying ? "Applying…" : t.locations.conflicts.applyButton}
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}
