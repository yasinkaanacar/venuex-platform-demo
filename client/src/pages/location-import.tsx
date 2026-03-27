import { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { PATHS } from '@/routes/paths';
import { useTranslation } from '@/contexts/LanguageContext';
import { showToast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  ArrowLeft,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Clock,
  FolderOpen,
  Table2,
} from 'lucide-react';
import { MOCK_IMPORT_FILE_HISTORY } from '@/lib/mock/location-import';
import type { ImportFileRecord } from '@/lib/types/location-import';

// ========== HELPERS ==========

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getExtBadgeColor(ext: string): string {
  switch (ext) {
    case 'xlsx': case 'xls': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'csv': return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'json': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'xml': return 'bg-purple-50 text-purple-700 border-purple-200';
    default: return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

// ========== SUB-COMPONENTS ==========

function WarningCallout({ loc }: { loc: any }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm font-medium text-amber-800">{loc?.warningTitle || 'Import will affect your location data'}</p>
        <p className="text-xs text-amber-600 mt-0.5">{loc?.warningDesc || 'Importing may create new locations, update existing ones, or remove unmatched locations.'}</p>
      </div>
    </div>
  );
}

function ActionCards({ loc }: { loc: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Download Template */}
      <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <Download className="w-[18px] h-[18px] text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{loc?.downloadTemplate || 'Download Template'}</p>
            <p className="text-xs text-gray-500 mt-0.5">{loc?.downloadTemplateDesc || 'Download a blank template with the correct column structure'}</p>
            <div className="flex items-center gap-2 mt-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="vx-button text-xs h-7">
                    <Download className="w-3 h-3 mr-1.5" />
                    {loc?.downloadTemplate || 'Download Template'}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-1.5" align="start">
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => showToast({ type: 'success', title: 'Template downloaded', description: 'locations-template.xlsx' })}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    {loc?.downloadXlsx || 'Download .xlsx'}
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => showToast({ type: 'success', title: 'Template downloaded', description: 'locations-template.csv' })}
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    {loc?.downloadCsv || 'Download .csv'}
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {/* Export Current */}
      <div className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <Upload className="w-[18px] h-[18px] text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{loc?.exportCurrent || 'Export Current Locations'}</p>
            <p className="text-xs text-gray-500 mt-0.5">{loc?.exportCurrentDesc || 'Export all your current locations as an Excel file'}</p>
            <div className="flex items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="vx-button text-xs h-7"
                onClick={() => showToast({ type: 'success', title: 'Export started', description: 'locations-export.xlsx' })}
              >
                <FileSpreadsheet className="w-3 h-3 mr-1.5" />
                {loc?.exportXlsx || 'Export as .xlsx'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileDropZone({
  loc,
  onFileDrop,
}: {
  loc: any;
  onFileDrop: () => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`relative flex flex-col items-center justify-center py-10 px-6 bg-white rounded-lg border-2 border-dashed transition-all cursor-pointer ${
        isDragOver ? 'border-blue-400 bg-blue-50/40 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/30'
      }`}
      onClick={onFileDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); onFileDrop(); }}
    >
      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
        <Upload className="w-5 h-5 text-blue-500" />
      </div>
      <p className="text-sm font-medium text-gray-700">{loc?.uploadDesc || 'Drag and drop your file here, or click to browse'}</p>
      <p className="text-xs text-gray-400 mt-1">{loc?.supportedFormats || 'Supported: .csv, .xlsx, .xls, .json, .xml'}</p>
      <p className="text-xs text-gray-400">{loc?.maxFileSize || 'Maximum file size: 10 MB'}</p>
      <Button variant="outline" size="sm" className="vx-button mt-4 pointer-events-none">
        <Upload className="w-3.5 h-3.5 mr-1.5" />
        {loc?.browseFiles || 'Browse Files'}
      </Button>
    </div>
  );
}

function MethodDialog({
  open,
  onClose,
  onSelect,
  loc,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (method: 'venueX' | 'own') => void;
  loc: any;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{loc?.selectMethod || 'Select Import Method'}</DialogTitle>
          <DialogDescription>{loc?.selectMethodDesc || 'How is your file structured?'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <button
            className="w-full flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300/30 transition-all text-left group"
            onClick={() => onSelect('venueX')}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <Table2 className="w-[18px] h-[18px] text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{loc?.venueXFormat || 'VenueX Format'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{loc?.venueXFormatDesc || "Your file uses VenueX column names. We'll validate and import directly."}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 mt-2.5 shrink-0 group-hover:text-blue-500 transition-colors" />
          </button>

          <button
            className="w-full flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300/30 transition-all text-left group"
            onClick={() => onSelect('own')}
          >
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
              <FolderOpen className="w-[18px] h-[18px] text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{loc?.ownFormat || 'Own Format'}</p>
              <p className="text-xs text-gray-500 mt-0.5">{loc?.ownFormatDesc || "Your file has custom column names. You'll map them to VenueX fields."}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 mt-2.5 shrink-0 group-hover:text-blue-500 transition-colors" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FileHistoryTable({ files, loc, onContinue }: { files: ImportFileRecord[]; loc: any; onContinue: (id: string) => void }) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <FolderOpen className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-sm font-medium text-gray-500">{loc?.noFiles || 'No imports yet'}</p>
        <p className="text-xs text-gray-400 mt-1">{loc?.noFilesDesc || 'Upload a file above to get started'}</p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">{loc?.fileName || 'File Name'}</th>
          <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">{loc?.uploadDate || 'Upload Date'}</th>
          <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">{loc?.rowCount || 'Rows'}</th>
          <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">{loc?.fileSize || 'Size'}</th>
          <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">{loc?.sourceType || 'Type'}</th>
          <th className="text-right text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">{loc?.status || 'Status'}</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {files.map((file) => (
          <tr key={file.id} className="hover:bg-gray-50/50 transition-colors">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className={`w-4 h-4 shrink-0 ${file.fileExtension === 'csv' ? 'text-blue-500' : 'text-emerald-500'}`} />
                <span className="text-sm text-gray-900 font-medium truncate max-w-[220px]">{file.fileName}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDate(file.fileUploadDate)}
              </div>
            </td>
            <td className="px-4 py-3 text-center">
              <span className="text-sm text-gray-700 tabular-nums">{file.rowCount.toLocaleString()}</span>
            </td>
            <td className="px-4 py-3 text-center">
              <span className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</span>
            </td>
            <td className="px-4 py-3 text-center">
              <Badge className={`text-[10px] uppercase font-semibold ${getExtBadgeColor(file.fileExtension)}`}>
                .{file.fileExtension}
              </Badge>
            </td>
            <td className="px-4 py-3 text-right">
              {file.importResult ? (
                <div className="flex items-center justify-end gap-2">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                    {file.importResult.newLocationCount} {loc?.newLocations || 'new'}
                  </Badge>
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">
                    {file.importResult.updatedLocationCount} {loc?.updatedLocations || 'updated'}
                  </Badge>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="vx-button text-xs h-7"
                  onClick={() => onContinue(file.id)}
                >
                  {loc?.continueImport || 'Continue'}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ========== MAIN PAGE ==========

export default function LocationImport() {
  const [, navigate] = useLocation();
  const { t } = useTranslation();
  const loc = (t.locations as any)?.import as any;

  const [methodDialogOpen, setMethodDialogOpen] = useState(false);

  const handleFileDrop = useCallback(() => {
    setMethodDialogOpen(true);
  }, []);

  const handleMethodSelect = useCallback((method: 'venueX' | 'own') => {
    setMethodDialogOpen(false);
    if (method === 'own') {
      navigate(PATHS.LOCATIONS_IMPORT_ANALYSIS + '?method=own');
    } else {
      navigate(PATHS.LOCATIONS_IMPORT_ANALYSIS + '?method=venueX');
    }
  }, [navigate]);

  const handleContinueImport = useCallback((fileId: string) => {
    navigate(PATHS.LOCATIONS_IMPORT_ANALYSIS + '?fileId=' + fileId + '&method=own');
  }, [navigate]);

  return (
    <div className="vx-section-stack !mt-0 space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(PATHS.LOCATIONS)}
          className="text-gray-500 hover:text-gray-700 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          {loc?.backToLocations || 'Back to Locations'}
        </Button>
      </div>

      {/* Warning */}
      <WarningCallout loc={loc} />

      {/* Upload + Actions Card */}
      <div className="vx-card">
        <div className="vx-card-header">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-foreground">{loc?.uploadTitle || 'Upload File'}</h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                {loc?.pageDesc || 'Import location data from files.'}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{loc?.supportedFormats || 'Supported: .csv, .xlsx, .xls, .json, .xml'}</p>
        </div>
        <div className="vx-card-body vx-surface-muted space-y-4">
          <ActionCards loc={loc} />
          <FileDropZone loc={loc} onFileDrop={handleFileDrop} />
        </div>
      </div>

      {/* File History Card */}
      <div className="vx-card">
        <div className="vx-card-header">
          <div className="flex items-center gap-1.5">
            <h3 className="text-base font-semibold text-foreground">{loc?.fileHistory || 'Import History'}</h3>
            <div className="relative group">
              <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                {loc?.fileHistoryTooltip || 'Track all your past imports'}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{loc?.fileHistoryDesc || 'Previously uploaded files and their import status'}</p>
        </div>
        <div className="overflow-hidden">
          <FileHistoryTable
            files={MOCK_IMPORT_FILE_HISTORY}
            loc={loc}
            onContinue={handleContinueImport}
          />
        </div>
      </div>

      {/* Method Selection Dialog */}
      <MethodDialog
        open={methodDialogOpen}
        onClose={() => setMethodDialogOpen(false)}
        onSelect={handleMethodSelect}
        loc={loc}
      />
    </div>
  );
}
