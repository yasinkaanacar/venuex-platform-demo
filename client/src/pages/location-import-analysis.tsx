import { useState, useCallback, useMemo } from 'react';
import { useLocation, useSearch } from 'wouter';
import { PATHS } from '@/routes/paths';
import { useTranslation } from '@/contexts/LanguageContext';
import { showToast } from '@/lib/toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  MapPin,
  Link2,
  Plus,
  Trash2,
  PauseCircle,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  GitCompare,
} from 'lucide-react';
import { AnalyzeStep, ImportDecision, MatchingCriteria } from '@/lib/types/location-import';
import type {
  ColumnMappingDto,
  FileLocationForMatchDto,
  VenueXLocationForMatchDto,
  DuplicateFileLocationDto,
  ErrorDetailDto,
  GetFileLocationSummaryDto,
} from '@/lib/types/location-import';
import {
  VENUEX_MAPPING_FIELDS,
  autoMapColumns,
  MOCK_OWN_FORMAT_COLUMNS,
  MOCK_OWN_FORMAT_SAMPLE_ROWS,
  MOCK_FILE_LOCATIONS,
  MOCK_VENUEX_LOCATIONS,
  MOCK_MATCHING_STATUSES,
  MOCK_FILE_DUPLICATES,
  MOCK_VALIDATION_ERRORS,
  MOCK_DECISION_SUMMARY,
} from '@/lib/mock/location-import';

// ========== STEP CONFIG ==========

const STEP_ORDER: AnalyzeStep[] = [
  AnalyzeStep.MappingColumns,
  AnalyzeStep.FileAnalysis,
  AnalyzeStep.Matching,
  AnalyzeStep.LocationsCreated,
  AnalyzeStep.LocationsRemoved,
  AnalyzeStep.Summary,
];

function getStepLabel(step: AnalyzeStep, loc: any): string {
  switch (step) {
    case AnalyzeStep.MappingColumns: return loc?.stepMapping || 'Map Columns';
    case AnalyzeStep.FileAnalysis: return loc?.stepAnalysis || 'File Analysis';
    case AnalyzeStep.Matching: return loc?.stepMatching || 'Match Locations';
    case AnalyzeStep.LocationsCreated: return loc?.stepNewLocations || 'New Locations';
    case AnalyzeStep.LocationsRemoved: return loc?.stepRemovedLocations || 'Unmatched Locations';
    case AnalyzeStep.Summary: return loc?.stepSummary || 'Summary';
    default: return '';
  }
}

// ========== STEP INDICATOR ==========

function StepIndicator({ steps, currentIdx, loc }: { steps: AnalyzeStep[]; currentIdx: number; loc: any }) {
  return (
    <div className="flex items-center gap-1">
      {steps.map((step, idx) => {
        const isActive = idx === currentIdx;
        const isComplete = idx < currentIdx;
        return (
          <div key={step} className="flex items-center gap-1">
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
            <div className="flex items-center gap-1.5">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                isComplete ? 'bg-emerald-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {isComplete ? <Check className="w-3 h-3" /> : idx + 1}
              </div>
              <span className={`text-xs font-medium hidden lg:inline ${
                isActive ? 'text-gray-900' : isComplete ? 'text-emerald-600' : 'text-gray-400'
              }`}>
                {getStepLabel(step, loc)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ========== STEP 1: COLUMN MAPPING ==========

function MappingStep({
  mappings,
  onMappingChange,
  sampleRows,
  loc,
}: {
  mappings: ColumnMappingDto[];
  onMappingChange: (index: number, targetField: string) => void;
  sampleRows: Record<string, string>[];
  loc: any;
}) {
  const usedTargets = new Set(mappings.map((m) => m.targetField).filter(Boolean));
  const requiredFields = VENUEX_MAPPING_FIELDS.filter((f) => f.required);
  const mappedRequired = requiredFields.filter((f) => mappings.some((m) => m.targetField === f.key));
  const allRequiredMapped = mappedRequired.length === requiredFields.length;

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">{loc?.mappingTitle || 'Column Mapping'}</h3>
            <p className="text-xs text-gray-500 mt-1">{loc?.mappingDesc || 'Map each column to the corresponding VenueX field.'}</p>
          </div>
          <div className="flex items-center gap-2">
            {allRequiredMapped ? (
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {loc?.allRequiredMapped || 'All required fields mapped'}
              </Badge>
            ) : (
              <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {(loc?.fieldsRequired || '{{count}} required fields must be mapped').replace('{{count}}', String(requiredFields.length - mappedRequired.length))}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 w-[22%]">{loc?.sourceColumn || 'Your Column'}</th>
              <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 w-[30%]">{loc?.sampleData || 'Sample Data'}</th>
              <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 w-[30%]">{loc?.venueXField || 'VenueX Field'}</th>
              <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 w-[18%]">{loc?.status || 'Status'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mappings.map((mapping, idx) => {
              const samples = sampleRows.slice(0, 3).map((row) => row[mapping.sourceColumn]).filter(Boolean);
              const isMapped = !!mapping.targetField;
              const fieldDef = VENUEX_MAPPING_FIELDS.find((f) => f.key === mapping.targetField);
              const wasAutoMapped = isMapped && autoMapColumns([mapping.sourceColumn])[0]?.targetField === mapping.targetField;

              return (
                <tr key={mapping.sourceColumn} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{mapping.sourceColumn}</span>
                      {wasAutoMapped && (
                        <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-[10px]">{loc?.autoMapped || 'Auto'}</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      {samples.map((val, i) => (
                        <span key={i} className="text-xs text-gray-500 truncate max-w-[200px]">{val}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={mapping.targetField || '__none__'}
                      onValueChange={(val: string) => onMappingChange(idx, val === '__none__' ? '' : val)}
                      displayLabel={fieldDef ? `${fieldDef.label}${fieldDef.required ? ' *' : ''}` : (loc?.selectField || 'Select field…')}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: isMapped ? 'rgba(236, 253, 245, 0.5)' : 'white',
                          '& fieldset': { borderColor: isMapped ? '#a7f3d0' : undefined },
                        },
                      }}
                    >
                      <SelectContent>
                        <SelectItem value="__none__">— {loc?.selectField || 'Select field…'}</SelectItem>
                        {VENUEX_MAPPING_FIELDS.filter((f) => !usedTargets.has(f.key) || mapping.targetField === f.key).map((field) => (
                          <SelectItem key={field.key} value={field.key}>
                            {field.label}{field.required ? ' *' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isMapped ? (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {loc?.mapped || 'Mapped'}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500 border-gray-200">{loc?.unmapped || 'Unmapped'}</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ========== STEP 2: FILE ANALYSIS ==========

function FileAnalysisStep({
  validCount,
  errors,
  duplicates,
  loc,
}: {
  validCount: number;
  errors: ErrorDetailDto[];
  duplicates: DuplicateFileLocationDto[];
  loc: any;
}) {
  const totalErrors = errors.length;

  return (
    <div className="space-y-4">
      {/* Validation summary */}
      <div className="vx-card">
        <div className="vx-card-header">
          <h3 className="text-base font-semibold text-foreground">{loc?.analysisStepTitle || 'File Validation'}</h3>
          <p className="text-xs text-gray-500 mt-1">{loc?.analysisStepDesc || 'We checked your file for validation errors and potential duplicates.'}</p>
        </div>
        <div className="vx-card-body vx-surface-muted space-y-4">
          {/* Counts */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-[18px] h-[18px] text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-700 tabular-nums">{validCount}</p>
                <p className="text-xs text-gray-500">{(loc?.validRows || '{{count}} valid rows').replace('{{count}}', '')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${totalErrors > 0 ? 'bg-red-50' : 'bg-gray-100'}`}>
                {totalErrors > 0 ? <AlertCircle className="w-[18px] h-[18px] text-red-500" /> : <CheckCircle2 className="w-[18px] h-[18px] text-gray-400" />}
              </div>
              <div>
                <p className={`text-xl font-bold tabular-nums ${totalErrors > 0 ? 'text-red-600' : 'text-gray-400'}`}>{totalErrors}</p>
                <p className="text-xs text-gray-500">{totalErrors > 0 ? (loc?.errorRows || '{{count}} rows with errors').replace('{{count}}', '') : (loc?.noErrors || 'No validation errors found')}</p>
              </div>
            </div>
          </div>

          {/* Error table */}
          {totalErrors > 0 && (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-red-50 border-b border-red-100">
                <p className="text-xs font-semibold text-red-700">{loc?.errorTable || 'Validation Errors'}</p>
              </div>
              <table className="w-full">
                <tbody className="divide-y divide-gray-100">
                  {errors.map((err) => (
                    <tr key={err.index} className="hover:bg-red-50/30 transition-colors">
                      <td className="px-4 py-2.5 w-24">
                        <Badge className="bg-red-50 text-red-600 border-red-200 text-[10px]">
                          {(loc?.errorRow || 'Row {{index}}').replace('{{index}}', String(err.index))}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5">
                        {err.errors.map((e, i) => (
                          <span key={i} className="text-xs text-red-600 block">{e}</span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Duplicate detection */}
      <div className="vx-card">
        <div className="vx-card-header">
          <h3 className="text-base font-semibold text-foreground">{loc?.duplicatesTitle || 'Potential Duplicates in File'}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {duplicates.length > 0
              ? (loc?.duplicatesDesc || 'These pairs are within {{radius}}m of each other.').replace('{{radius}}', '50')
              : (loc?.duplicatesNone || 'No in-file duplicates detected')}
          </p>
        </div>
        {duplicates.length > 0 && (
          <div className="vx-card-body vx-surface-muted space-y-3">
            {duplicates.map((dup, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto_1fr] gap-3 p-4 bg-white rounded-lg border border-amber-100 shadow-sm items-center">
                <LocationMiniCard location={dup.first} />
                <div className="flex flex-col items-center">
                  <GitCompare className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] text-amber-500 mt-1">~50m</span>
                </div>
                <LocationMiniCard location={dup.second} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== STEP 3: MATCHING ==========

function MatchingStep({ loc }: { loc: any }) {
  const matched = MOCK_MATCHING_STATUSES.filter((s) => s.file && s.venuex);
  const fileOnly = MOCK_MATCHING_STATUSES.filter((s) => s.file && !s.venuex);

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">{loc?.matchingTitle || 'Match Imported Locations'}</h3>
            <p className="text-xs text-gray-500 mt-1">{loc?.matchingDesc || 'We matched your file locations against existing VenueX locations.'}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
              <Link2 className="w-3 h-3 mr-1" />
              {(loc?.matchedPairs || '{{count}} matched pairs').replace('{{count}}', String(matched.length))}
            </Badge>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
              <Plus className="w-3 h-3 mr-1" />
              {(loc?.unmatchedFile || '{{count}} new locations').replace('{{count}}', String(fileOnly.length))}
            </Badge>
          </div>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 w-[38%]">{loc?.fileLocation || 'File Location'}</th>
              <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 w-[12%]">{loc?.matchedBy || 'Matched by'}</th>
              <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 w-[38%]">{loc?.venueXLocation || 'VenueX Location'}</th>
              <th className="text-center text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3 w-[12%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Matched pairs first */}
            {matched.map((status, idx) => (
              <tr key={`m-${idx}`} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-4 py-3">
                  <MatchLocationCell loc={status.file!} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-[10px]">
                    {status.matchingCriteria === MatchingCriteria.STORE_CODE
                      ? (loc?.matchedByStoreCode || 'Store Code')
                      : status.matchingCriteria === MatchingCriteria.ADDRESS
                      ? (loc?.matchedByAddress || 'Address')
                      : (loc?.matchedByAuto || 'Auto')}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <MatchLocationCell loc={status.venuex!} isVenueX />
                </td>
                <td className="px-4 py-3 text-center">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400 inline" />
                </td>
              </tr>
            ))}
            {/* File-only (new) */}
            {fileOnly.map((status, idx) => (
              <tr key={`n-${idx}`} className="hover:bg-emerald-50/30 transition-colors">
                <td className="px-4 py-3">
                  <MatchLocationCell loc={status.file!} />
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge className="bg-gray-100 text-gray-400 border-gray-200 text-[10px]">—</Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-emerald-600 italic flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    {loc?.noMatch || 'No match — will be created'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Plus className="w-3.5 h-3.5 text-emerald-400 inline" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ========== STEP 4: NEW LOCATIONS ==========

function NewLocationsStep({ loc }: { loc: any }) {
  const newLocs = MOCK_MATCHING_STATUSES.filter((s) => s.file && !s.venuex).map((s) => s.file!);

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-foreground">{loc?.newLocationsTitle || 'New Locations'}</h3>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {(loc?.newLocationsDesc || 'These {{count}} locations will be created.').replace('{{count}}', String(newLocs.length))}
        </p>
      </div>
      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Store Code</th>
              <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Name</th>
              <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Address</th>
              <th className="text-left text-[11px] font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">City</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {newLocs.map((l) => (
              <tr key={l._id} className="hover:bg-emerald-50/30 transition-colors">
                <td className="px-4 py-3"><span className="text-xs font-mono text-gray-700">{l.store_code}</span></td>
                <td className="px-4 py-3"><span className="text-sm text-gray-900">{l.store_name}</span></td>
                <td className="px-4 py-3"><span className="text-xs text-gray-500">{l.full_address}</span></td>
                <td className="px-4 py-3"><span className="text-xs text-gray-500">{l.city}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ========== STEP 5: UNMATCHED VENUEX LOCATIONS ==========

function RemovedLocationsStep({
  decisions,
  onDecisionChange,
  loc,
}: {
  decisions: Record<string, ImportDecision>;
  onDecisionChange: (id: string, decision: ImportDecision) => void;
  loc: any;
}) {
  const venuexOnly = MOCK_MATCHING_STATUSES.filter((s) => s.venuex && !s.file).map((s) => s.venuex!);

  const decisionOptions: { value: ImportDecision; label: string; icon: React.ReactNode; color: string }[] = [
    { value: ImportDecision.KEEP_EXISTING, label: loc?.decisionKeep || 'Keep', icon: <ShieldCheck className="w-3.5 h-3.5" />, color: 'text-blue-600' },
    { value: ImportDecision.CLOSE_EXISTING, label: loc?.decisionClose || 'Close Temporarily', icon: <PauseCircle className="w-3.5 h-3.5" />, color: 'text-amber-600' },
    { value: ImportDecision.DELETE_EXISTING, label: loc?.decisionDelete || 'Delete', icon: <Trash2 className="w-3.5 h-3.5" />, color: 'text-red-600' },
  ];

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">{loc?.removedTitle || 'Unmatched VenueX Locations'}</h3>
        <p className="text-xs text-gray-500 mt-1">
          {(loc?.removedDesc || 'These {{count}} locations were not found in your import file.').replace('{{count}}', String(venuexOnly.length))}
        </p>
      </div>
      <div className="vx-card-body vx-surface-muted space-y-3">
        {venuexOnly.map((vx) => {
          const currentDecision = decisions[vx._id] || ImportDecision.KEEP_EXISTING;
          return (
            <div key={vx._id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{vx.store_name}</p>
                  <p className="text-xs text-gray-500 truncate">{vx.store_code} &middot; {vx.full_address} &middot; {vx.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-4">
                {decisionOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    variant={currentDecision === opt.value ? 'default' : 'outline'}
                    size="sm"
                    className={`text-xs h-7 ${
                      currentDecision === opt.value
                        ? opt.value === ImportDecision.DELETE_EXISTING
                          ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                          : opt.value === ImportDecision.CLOSE_EXISTING
                          ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500'
                          : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                        : 'bg-white'
                    }`}
                    onClick={() => onDecisionChange(vx._id, opt.value)}
                  >
                    {opt.icon}
                    <span className="ml-1">{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========== STEP 6: SUMMARY ==========

function SummaryStep({ summary, loc }: { summary: GetFileLocationSummaryDto; loc: any }) {
  const items: { label: string; count: number; icon: React.ReactNode; color: string; bg: string }[] = [
    { label: loc?.willOverwrite || 'Will be updated', count: summary.willBeOverwrittenCount, icon: <RefreshCw className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: loc?.willCreate || 'Will be created', count: summary.willBeCreatedCount, icon: <Plus className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: loc?.willDelete || 'Will be deleted', count: summary.willBeDeletedCount, icon: <Trash2 className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50' },
    { label: loc?.willClose || 'Will be closed', count: summary.willBeClosedCount, icon: <PauseCircle className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: loc?.willKeep || 'Will be kept', count: summary.willBeKeptCount, icon: <ShieldCheck className="w-5 h-5" />, color: 'text-gray-500', bg: 'bg-gray-100' },
  ];

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <h3 className="text-base font-semibold text-foreground">{loc?.summaryTitle || 'Import Summary'}</h3>
        <p className="text-xs text-gray-500 mt-1">{loc?.summaryDesc || 'Review the final import plan before applying changes.'}</p>
      </div>
      <div className="vx-card-body vx-surface-muted">
        <div className="grid grid-cols-5 gap-3">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center p-5 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
              <div className={`w-11 h-11 rounded-full ${item.bg} flex items-center justify-center mb-3`}>
                <span className={item.color}>{item.icon}</span>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${item.color}`}>{item.count}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== SHARED COMPONENTS ==========

function LocationMiniCard({ location }: { location: FileLocationForMatchDto | VenueXLocationForMatchDto }) {
  return (
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{location.store_name || location.store_code}</p>
      <p className="text-[11px] text-gray-500 truncate">{location.store_code}</p>
      <p className="text-[11px] text-gray-400 truncate">{location.full_address || location.city}</p>
    </div>
  );
}

function MatchLocationCell({ loc, isVenueX }: { loc: FileLocationForMatchDto | VenueXLocationForMatchDto; isVenueX?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <MapPin className={`w-3.5 h-3.5 shrink-0 ${isVenueX ? 'text-blue-400' : 'text-gray-400'}`} />
      <div className="min-w-0">
        <p className="text-sm text-gray-900 truncate">{loc.store_name || '—'}</p>
        <p className="text-[10px] text-gray-400 font-mono">{loc.store_code}</p>
        {loc.full_address && <p className="text-[10px] text-gray-400 truncate">{loc.full_address}</p>}
      </div>
    </div>
  );
}

// ========== MAIN PAGE ==========

export default function LocationImportAnalysis() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const method = params.get('method') || 'own';
  const isOwnFormat = method === 'own';

  const { t } = useTranslation();
  const loc = (t.locations as any)?.import as any;

  // Determine which steps to show based on import method
  const steps = useMemo(() => {
    if (isOwnFormat) return STEP_ORDER;
    // VenueX format skips column mapping
    return STEP_ORDER.filter((s) => s !== AnalyzeStep.MappingColumns);
  }, [isOwnFormat]);

  const [stepIdx, setStepIdx] = useState(0);
  const currentStep = steps[stepIdx];

  // Column mapping state
  const [mappings, setMappings] = useState<ColumnMappingDto[]>(() => autoMapColumns(MOCK_OWN_FORMAT_COLUMNS));

  // Decision state for unmatched VenueX locations
  const [decisions, setDecisions] = useState<Record<string, ImportDecision>>(() => {
    const d: Record<string, ImportDecision> = {};
    MOCK_VENUEX_LOCATIONS.forEach((vx) => { d[vx._id] = ImportDecision.KEEP_EXISTING; });
    return d;
  });

  const [isApplying, setIsApplying] = useState(false);

  // Handlers
  const handleMappingChange = useCallback((index: number, targetField: string) => {
    setMappings((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], targetField };
      return next;
    });
  }, []);

  const handleDecisionChange = useCallback((id: string, decision: ImportDecision) => {
    setDecisions((prev) => ({ ...prev, [id]: decision }));
  }, []);

  const handleNext = useCallback(() => {
    if (stepIdx < steps.length - 1) setStepIdx((s) => s + 1);
  }, [stepIdx, steps.length]);

  const handleBack = useCallback(() => {
    if (stepIdx > 0) setStepIdx((s) => s - 1);
  }, [stepIdx]);

  const handleComplete = useCallback(() => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      const summary = MOCK_DECISION_SUMMARY;
      showToast({
        type: 'success',
        title: loc?.importSuccess || 'Import completed successfully',
        description: (loc?.importSuccessDesc || '{{created}} created, {{updated}} updated, {{deleted}} deleted, {{closed}} closed')
          .replace('{{created}}', String(summary.willBeCreatedCount))
          .replace('{{updated}}', String(summary.willBeOverwrittenCount))
          .replace('{{deleted}}', String(summary.willBeDeletedCount))
          .replace('{{closed}}', String(summary.willBeClosedCount)),
      });
      navigate(PATHS.LOCATIONS);
    }, 2500);
  }, [loc, navigate]);

  // Validation: can proceed from mapping step?
  const requiredFields = VENUEX_MAPPING_FIELDS.filter((f) => f.required);
  const allRequiredMapped = requiredFields.every((f) => mappings.some((m) => m.targetField === f.key));
  const canProceed = currentStep === AnalyzeStep.MappingColumns ? allRequiredMapped : true;

  return (
    <div className="vx-section-stack !mt-0 space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(PATHS.LOCATIONS_IMPORT)}
          className="text-gray-500 hover:text-gray-700 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          {loc?.cancel || 'Cancel'}
        </Button>
        <StepIndicator steps={steps} currentIdx={stepIdx} loc={loc} />
      </div>

      {/* Step content */}
      {currentStep === AnalyzeStep.MappingColumns && (
        <MappingStep
          mappings={mappings}
          onMappingChange={handleMappingChange}
          sampleRows={MOCK_OWN_FORMAT_SAMPLE_ROWS}
          loc={loc}
        />
      )}
      {currentStep === AnalyzeStep.FileAnalysis && (
        <FileAnalysisStep
          validCount={MOCK_FILE_LOCATIONS.length - MOCK_VALIDATION_ERRORS.length}
          errors={MOCK_VALIDATION_ERRORS}
          duplicates={MOCK_FILE_DUPLICATES}
          loc={loc}
        />
      )}
      {currentStep === AnalyzeStep.Matching && <MatchingStep loc={loc} />}
      {currentStep === AnalyzeStep.LocationsCreated && <NewLocationsStep loc={loc} />}
      {currentStep === AnalyzeStep.LocationsRemoved && (
        <RemovedLocationsStep decisions={decisions} onDecisionChange={handleDecisionChange} loc={loc} />
      )}
      {currentStep === AnalyzeStep.Summary && <SummaryStep summary={MOCK_DECISION_SUMMARY} loc={loc} />}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {stepIdx > 0 && (
            <Button variant="outline" size="sm" onClick={handleBack} className="vx-button">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              {loc?.back || 'Back'}
            </Button>
          )}
        </div>
        <div>
          {currentStep === AnalyzeStep.Summary ? (
            <Button
              size="sm"
              disabled={isApplying}
              onClick={handleComplete}
              className="vx-button bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isApplying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  {loc?.applying || 'Applying changes…'}
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  {loc?.completeImport || 'Complete Import'}
                </>
              )}
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={!canProceed}
              onClick={handleNext}
              className="vx-button bg-blue-600 hover:bg-blue-700 text-white"
            >
              {currentStep === AnalyzeStep.MappingColumns
                ? (loc?.saveMappingAndContinue || 'Save Mapping & Continue')
                : (loc?.next || 'Next')}
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
