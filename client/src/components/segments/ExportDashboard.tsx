import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/hooks/query-keys";
import {
  Download,
  Clock,
  FileText,
  Server,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  Calendar,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TableEmptyState, TableSkeletonRows, TableErrorState } from "@/components/shared/table-states";
import { DataLoadingState, DataErrorState } from "@/components/shared/data-states";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useLocales, fNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { mockSegments, segmentDataService } from "@/lib/mock/segments";
import { showToast } from "@/lib/toast";
import type {
  SegmentExport,
  ScheduledExport,
  ExportFormat,
  ExportFrequency,
} from "@/lib/types/segments";

export default function ExportDashboard() {
  const { t } = useLocales();
  const queryClient = useQueryClient();
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [scheduledDialogOpen, setScheduledDialogOpen] = useState(false);
  const [editingScheduledExport, setEditingScheduledExport] = useState<ScheduledExport | null>(null);

  const { data: exports, isLoading: exportsLoading, isError: exportsError, refetch: refetchExports } = useQuery<SegmentExport[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_EXPORTS],
  });

  const { data: scheduled, isLoading: scheduledLoading, isError: scheduledError, refetch: refetchScheduled } = useQuery<ScheduledExport[]>({
    queryKey: [QUERY_KEYS.SEGMENTS_EXPORTS_SCHEDULED],
  });

  const statusConfig: Record<string, { color: string; icon: React.ReactNode }> =
    {
      completed: {
        color: "bg-green-100 text-green-700",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      in_progress: {
        color: "bg-blue-100 text-blue-700",
        icon: <Loader2 className="w-3 h-3 animate-spin" />,
      },
      scheduled: {
        color: "bg-gray-100 text-gray-700",
        icon: <Clock className="w-3 h-3" />,
      },
      failed: {
        color: "bg-red-100 text-red-700",
        icon: <AlertCircle className="w-3 h-3" />,
      },
    };

  function handleEditScheduled(sexp: ScheduledExport) {
    setEditingScheduledExport(sexp);
    setScheduledDialogOpen(true);
  }

  async function handleDeleteScheduled(sexp: ScheduledExport) {
    try {
      await segmentDataService.deleteScheduledExport(sexp.id);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SEGMENTS_EXPORTS_SCHEDULED],
      });
      showToast({
        type: "success",
        title: t("common.delete") || "Deleted",
        description: sexp.name,
      });
    } catch {
      showToast({
        type: "error",
        title: t("common.error") || "Error",
        description: t("segments.exports.deleteError") || "Failed to delete scheduled export",
      });
    }
  }

  function handleDownload(exp: SegmentExport) {
    showToast({
      type: "info",
      title: t("segments.exports.downloadCsv") || "Download started",
      description: exp.name,
    });
  }

  return (
    <div className="px-6 pt-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          {t("segments.exports.title") || "Exports"}
        </h2>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setScheduledDialogOpen(true)}
          >
            <Clock className="w-4 h-4 mr-2" />
            {t("segments.exports.configureScheduled") ||
              "Configure Scheduled Export"}
          </Button>
          <Button onClick={() => setExportDialogOpen(true)}>
            <Download className="w-4 h-4 mr-2" />
            {t("segments.exports.downloadCsv") || "Download CSV"}
          </Button>
        </div>
      </div>

      {/* Export History */}
      <div className="vx-card mb-6">
        <div className="vx-card-header">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("segments.exports.exportHistory") || "Export History"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="vx-th text-left">
                  {t("segments.exports.exportName") || "Export Name"}
                </th>
                <th className="vx-th text-left">
                  {t("segments.list.name") || "Segments"}
                </th>
                <th className="vx-th text-left">
                  {t("segments.exports.format") || "Format"}
                </th>
                <th className="vx-th text-right">
                  {t("segments.exports.recordCount") || "Records"}
                </th>
                <th className="vx-th text-right">
                  {t("segments.exports.fileSize") || "File Size"}
                </th>
                <th className="vx-th text-center">
                  {t("common.status") || "Status"}
                </th>
                <th className="vx-th text-right">
                  {t("segments.list.lastUpdated") || "Date"}
                </th>
                <th className="vx-th text-center">
                  {t("common.actions") || "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {exportsLoading ? (
                <TableSkeletonRows columns={8} rows={3} />
              ) : exportsError ? (
                <TableErrorState colSpan={8} onRetry={refetchExports} />
              ) : exports && exports.length > 0 ? (
                exports.map((exp) => {
                  const sc = statusConfig[exp.status] ?? statusConfig.completed;
                  return (
                    <tr
                      key={exp.id}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="vx-td font-medium text-gray-900">
                        {exp.name}
                      </td>
                      <td className="vx-td text-sm text-gray-600">
                        {exp.segmentNames.join(", ")}
                      </td>
                      <td className="vx-td">
                        <Badge
                          variant="outline"
                          className="text-xs uppercase"
                        >
                          {exp.format}
                        </Badge>
                      </td>
                      <td className="vx-td text-right text-sm">
                        {fNumber(exp.recordCount)}
                      </td>
                      <td className="vx-td text-right text-sm text-gray-600">
                        {exp.fileSize || "—"}
                      </td>
                      <td className="vx-td text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                            sc.color,
                          )}
                        >
                          {sc.icon}
                          {exp.status === "completed"
                            ? t("common.success") || "Completed"
                            : exp.status}
                        </span>
                      </td>
                      <td className="vx-td text-right text-sm text-gray-500">
                        {new Date(exp.createdAt).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="vx-td text-center">
                        {exp.downloadUrl && exp.status === "completed" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(exp)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <TableEmptyState
                  colSpan={8}
                  title={t("segments.exports.noExports") || "No exports yet"}
                  className="py-8"
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Exports */}
      <div className="vx-card">
        <div className="vx-card-header">
          <h3 className="text-sm font-semibold text-gray-900">
            {t("segments.exports.scheduledExports") || "Scheduled Exports"}
          </h3>
        </div>
        <div className="p-6">
          {scheduledLoading ? (
            <DataLoadingState />
          ) : scheduledError ? (
            <DataErrorState onRetry={refetchScheduled} />
          ) : scheduled && scheduled.length > 0 ? (
            <div className="space-y-4">
              {scheduled.map((sexp) => (
                <div
                  key={sexp.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Server className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {sexp.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {sexp.segmentNames.join(", ")}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {sexp.destination.type.toUpperCase()}://{sexp.destination.host}
                        {sexp.destination.remotePath}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">
                        {t("segments.exports.frequency") || "Frequency"}
                      </div>
                      <div className="font-medium capitalize">
                        {sexp.frequency}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">
                        {t("segments.exports.lastRun") || "Last Run"}
                      </div>
                      <div className="font-medium">
                        {sexp.lastRunAt
                          ? new Date(sexp.lastRunAt).toLocaleDateString("tr-TR")
                          : "—"}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">
                        {t("segments.exports.nextRun") || "Next Run"}
                      </div>
                      <div className="font-medium">
                        {sexp.nextRunAt
                          ? new Date(sexp.nextRunAt).toLocaleDateString("tr-TR")
                          : "—"}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        sexp.isActive
                          ? "border-green-300 text-green-700 bg-green-50"
                          : "border-gray-300 text-gray-500",
                      )}
                    >
                      {sexp.isActive
                        ? t("segments.status.active") || "Active"
                        : t("segments.status.paused") || "Paused"}
                    </Badge>
                    <div className="flex items-center gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditScheduled(sexp)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteScheduled(sexp)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {t("segments.exports.noScheduled") ||
                "No scheduled exports configured"}
            </div>
          )}
        </div>
      </div>

      {/* Ad-hoc Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />

      {/* Scheduled Export Dialog */}
      <ScheduledExportDialog
        open={scheduledDialogOpen}
        onOpenChange={(v) => {
          setScheduledDialogOpen(v);
          if (!v) setEditingScheduledExport(null);
        }}
        editingExport={editingScheduledExport}
      />
    </div>
  );
}

// ------------------------------------------------------------------
// Ad-hoc Export Dialog
// ------------------------------------------------------------------

function ExportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useLocales();
  const queryClient = useQueryClient();
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const activeSegments = mockSegments.filter(
    (s) => s.status === "active" || s.status === "building",
  );

  const toggleSegment = (id: string) => {
    setSelectedSegments((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  async function handleExport() {
    if (selectedSegments.length === 0 || isExporting) return;

    setIsExporting(true);
    try {
      const selectedNames = activeSegments
        .filter((s) => selectedSegments.includes(s.id))
        .map((s) => s.name);

      const totalRecords = activeSegments
        .filter((s) => selectedSegments.includes(s.id))
        .reduce((sum, s) => sum + (s.actualSize ?? s.estimatedSize), 0);

      await segmentDataService.createExport({
        name: `${format.toUpperCase()} Export — ${selectedNames.join(", ")}`,
        segmentIds: selectedSegments,
        segmentNames: selectedNames,
        format,
        recordCount: totalRecords,
        fileSize: `${(totalRecords * 0.0001).toFixed(1)} MB`,
      });

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEGMENTS_EXPORTS] });

      showToast({
        type: "success",
        title: t("segments.exports.exportStarted") || "Export started",
        description: selectedNames.join(", "),
      });

      // Reset and close
      setSelectedSegments([]);
      setFormat("csv");
      setIncludeMetadata(true);
      onOpenChange(false);
    } catch {
      showToast({
        type: "error",
        title: t("common.error") || "Error",
        description: t("segments.exports.createError") || "Failed to create export",
      });
    } finally {
      setIsExporting(false);
    }
  }

  function handleClose(v: boolean) {
    if (!isExporting) {
      if (!v) {
        setSelectedSegments([]);
        setFormat("csv");
        setIncludeMetadata(true);
      }
      onOpenChange(v);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t("segments.exports.downloadCsv") || "Download CSV"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("segments.exports.selectSegments") ||
                "Select segments to export"}
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2">
              {activeSegments.map((seg) => (
                <label
                  key={seg.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedSegments.includes(seg.id)}
                    onChange={() => toggleSegment(seg.id)}
                    disabled={isExporting}
                  />
                  <span className="text-sm text-gray-900">{seg.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {fNumber(seg.actualSize ?? seg.estimatedSize)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("segments.exports.format") || "Format"}
            </label>
            <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={includeMetadata}
              onChange={() => setIncludeMetadata(!includeMetadata)}
              disabled={isExporting}
            />
            <span className="text-sm text-gray-700">
              {t("segments.exports.includeMetadata") ||
                "Include metadata columns"}
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={isExporting}>
            {t("common.cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleExport}
            disabled={selectedSegments.length === 0 || isExporting}
            startIcon={
              isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )
            }
          >
            {isExporting
              ? t("common.loading") || "Exporting..."
              : t("common.export") || "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ------------------------------------------------------------------
// Scheduled Export Dialog
// ------------------------------------------------------------------

function ScheduledExportDialog({
  open,
  onOpenChange,
  editingExport,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingExport: ScheduledExport | null;
}) {
  const { t } = useLocales();
  const queryClient = useQueryClient();
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [exportName, setExportName] = useState("");
  const [frequency, setFrequency] = useState<ExportFrequency>("weekly");
  const [sftpHost, setSftpHost] = useState("");
  const [sftpPort, setSftpPort] = useState("22");
  const [sftpUsername, setSftpUsername] = useState("");
  const [sftpPath, setSftpPath] = useState("/data/exports/");
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = editingExport !== null;

  const activeSegments = mockSegments.filter(
    (s) => s.status === "active" || s.status === "building",
  );

  // Populate form when editing
  useEffect(() => {
    if (open && editingExport) {
      setExportName(editingExport.name);
      setSelectedSegments([...editingExport.segmentIds]);
      setFrequency(editingExport.frequency);
      setSftpHost(editingExport.destination.host);
      setSftpPort(String(editingExport.destination.port));
      setSftpUsername(editingExport.destination.username);
      setSftpPath(editingExport.destination.remotePath);
    } else if (open && !editingExport) {
      resetForm();
    }
  }, [open, editingExport]);

  const toggleSegment = (id: string) => {
    setSelectedSegments((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  function resetForm() {
    setSelectedSegments([]);
    setExportName("");
    setFrequency("weekly");
    setSftpHost("");
    setSftpPort("22");
    setSftpUsername("");
    setSftpPath("/data/exports/");
  }

  async function handleSave() {
    if (selectedSegments.length === 0 || !exportName.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const selectedNames = activeSegments
        .filter((s) => selectedSegments.includes(s.id))
        .map((s) => s.name);

      const payload = {
        name: exportName.trim(),
        segmentIds: selectedSegments,
        segmentNames: selectedNames,
        format: "csv" as const,
        frequency,
        destination: {
          type: "sftp" as const,
          host: sftpHost.trim() || "sftp.example.com",
          port: parseInt(sftpPort, 10) || 22,
          username: sftpUsername.trim() || "user",
          remotePath: sftpPath.trim() || "/",
        },
      };

      if (isEditing) {
        await segmentDataService.updateScheduledExport(editingExport.id, payload);
      } else {
        await segmentDataService.createScheduledExport(payload);
      }

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SEGMENTS_EXPORTS_SCHEDULED],
      });

      showToast({
        type: "success",
        title: isEditing
          ? t("common.save") || "Saved"
          : t("segments.exports.configureScheduled") || "Scheduled export saved",
        description: `${exportName} — ${frequency}`,
      });

      resetForm();
      onOpenChange(false);
    } catch {
      showToast({
        type: "error",
        title: t("common.error") || "Error",
        description: t("segments.exports.saveError") || "Failed to save scheduled export",
      });
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose(v: boolean) {
    if (!isSaving) {
      if (!v) resetForm();
      onOpenChange(v);
    }
  }

  const canSave = selectedSegments.length > 0 && exportName.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("segments.exports.editScheduled") || "Edit Scheduled Export"
              : t("segments.exports.configureScheduled") || "Configure Scheduled Export"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {t("segments.exports.exportName") || "Export Name"}
            </label>
            <Input
              placeholder="e.g. Weekly Full Export"
              value={exportName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setExportName(e.target.value)
              }
              disabled={isSaving}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              {t("segments.exports.selectSegments") ||
                "Select segments to export"}
            </label>
            <div className="space-y-2 max-h-36 overflow-y-auto border border-gray-200 rounded-md p-2">
              {activeSegments.map((seg) => (
                <label
                  key={seg.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedSegments.includes(seg.id)}
                    onChange={() => toggleSegment(seg.id)}
                    disabled={isSaving}
                  />
                  <span className="text-sm text-gray-900">{seg.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              {t("segments.exports.frequency") || "Frequency"}
            </label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as ExportFrequency)}>
              <SelectContent>
                <SelectItem value="daily">
                  {t("segments.exports.daily") || "Daily"}
                </SelectItem>
                <SelectItem value="weekly">
                  {t("segments.exports.weekly") || "Weekly"}
                </SelectItem>
                <SelectItem value="monthly">
                  {t("segments.exports.monthly") || "Monthly"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-gray-500" />
              {t("segments.exports.sftpConfiguration") || "SFTP Configuration"}
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-xs text-gray-500 mb-1 block">
                  {t("segments.exports.sftpHost") || "SFTP Host"}
                </label>
                <Input
                  placeholder="sftp.example.com"
                  className="h-8 text-sm"
                  value={sftpHost}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSftpHost(e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  {t("segments.exports.sftpPort") || "Port"}
                </label>
                <Input
                  placeholder="22"
                  className="h-8 text-sm"
                  value={sftpPort}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSftpPort(e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  {t("segments.exports.sftpUsername") || "Username"}
                </label>
                <Input
                  placeholder="username"
                  className="h-8 text-sm"
                  value={sftpUsername}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSftpUsername(e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  {t("segments.exports.sftpPath") || "Remote Path"}
                </label>
                <Input
                  placeholder="/data/exports/"
                  className="h-8 text-sm"
                  value={sftpPath}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSftpPath(e.target.value)
                  }
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)} disabled={isSaving}>
            {t("common.cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            startIcon={
              isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4" />
              )
            }
          >
            {isSaving
              ? t("common.loading") || "Saving..."
              : isEditing
                ? t("common.save") || "Save Changes"
                : t("common.save") || "Save Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
