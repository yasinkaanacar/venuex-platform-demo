import { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle, AlertTriangle, XCircle, Loader2,
  Search, Info, FileSearch, Upload, Download,
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { useTranslation } from '@/contexts/LanguageContext';
import { fNumber } from '@/lib/formatters';
import OfflineBatchReportSheet from './OfflineBatchReportSheet';
import type { UploadBatch, IngestionJob, BatchStatus } from '@/lib/mock/pipeline';

interface UploadHistoryTableProps {
  batches: UploadBatch[];
  ingestionJobs: IngestionJob[];
}

type HistoryTab = 'uploads' | 'ingestion';
type FilterTab = 'all' | 'success' | 'issues' | 'failed';

function getPlatformSmallIcon(platform: string) {
  switch (platform) {
    case 'google': return <SiGoogle className="w-3.5 h-3.5 text-red-500" />;
    case 'meta': return <SiMeta className="w-3.5 h-3.5 text-blue-600" />;
    case 'tiktok': return <SiTiktok className="w-3.5 h-3.5 text-gray-900" />;
    default: return null;
  }
}

function getMatchRateColor(rate: number) {
  if (rate === 0) return 'text-gray-400';
  if (rate >= 75) return 'text-emerald-700';
  if (rate >= 60) return 'text-amber-700';
  return 'text-red-700';
}

function getMatchRateBarColor(rate: number) {
  if (rate >= 75) return 'bg-emerald-500';
  if (rate >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

function StatusBadge({ status, progress, dc }: { status: BatchStatus; progress?: number; dc?: Record<string, string> }) {
  switch (status) {
    case 'success':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
          <CheckCircle className="w-3 h-3" />
          {dc?.statusSuccess || 'Success'}
        </span>
      );
    case 'warning':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
          <AlertTriangle className="w-3 h-3" />
          {dc?.statusIssues || 'Issues'}
        </span>
      );
    case 'error':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700">
          <XCircle className="w-3 h-3" />
          {dc?.statusFailed || 'Failed'}
        </span>
      );
    case 'processing':
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0" />
          <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden w-14">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${progress || 0}%` }} />
          </div>
          <span className="text-xs text-blue-600 font-medium">{progress || 0}%</span>
        </div>
      );
    default:
      return null;
  }
}

function getRowHoverClass(status: BatchStatus) {
  switch (status) {
    case 'error': return 'hover:bg-red-50/40';
    case 'warning': return 'hover:bg-amber-50/40';
    case 'processing': return 'hover:bg-blue-50/40';
    default: return 'hover:bg-gray-50';
  }
}

function SourceBadge({ sourceType, sourceName }: { sourceType: string; sourceName: string }) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase border ${
      sourceType === 'api'
        ? 'bg-purple-50 text-purple-700 border-purple-200'
        : 'bg-teal-50 text-teal-700 border-teal-200'
    }`}>
      {sourceName}
    </span>
  );
}

function getCounts(items: { status: BatchStatus }[]) {
  return {
    all: items.length,
    success: items.filter((i) => i.status === 'success').length,
    issues: items.filter((i) => i.status === 'warning' || i.status === 'processing').length,
    failed: items.filter((i) => i.status === 'error').length,
  };
}

export default function UploadHistoryTable({ batches: initialBatches, ingestionJobs: initialJobs }: UploadHistoryTableProps) {
  const { t } = useTranslation();
  const dc = (t.offlineConversions as any)?.dataConnectionTab as Record<string, string> | undefined;

  const [historyTab, setHistoryTab] = useState<HistoryTab>('uploads');
  const [batches, setBatches] = useState(initialBatches);
  const [jobs, setJobs] = useState(initialJobs);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<UploadBatch | null>(null);

  // Reset filter and search when switching top-level tabs
  const switchTab = (tab: HistoryTab) => {
    setHistoryTab(tab);
    setActiveFilter('all');
    setSearchQuery('');
  };

  // Animate processing rows for both batches and jobs
  useEffect(() => {
    const interval = setInterval(() => {
      setBatches((prev) =>
        prev.map((batch) => {
          if (batch.status === 'processing' && batch.progress !== undefined) {
            const newProgress = batch.progress + Math.floor(Math.random() * 12) + 3;
            if (newProgress >= 100) {
              return {
                ...batch,
                status: 'success' as BatchStatus,
                progress: undefined,
                matchRate: 76 + Math.floor(Math.random() * 10),
                recordsMatched: Math.floor(batch.recordsSent * (0.76 + Math.random() * 0.1)),
                duration: `${Math.floor(Math.random() * 3)}m ${Math.floor(Math.random() * 50) + 10}s`,
              };
            }
            return { ...batch, progress: Math.min(newProgress, 99) };
          }
          return batch;
        })
      );
      setJobs((prev) =>
        prev.map((job) => {
          if (job.status === 'processing' && job.progress !== undefined) {
            const newProgress = job.progress + Math.floor(Math.random() * 12) + 3;
            if (newProgress >= 100) {
              return {
                ...job,
                status: 'success' as BatchStatus,
                progress: undefined,
                recordsIngested: job.sourceType === 'sftp'
                  ? 110000 + Math.floor(Math.random() * 20000)
                  : 38000 + Math.floor(Math.random() * 10000),
                duration: `${Math.floor(Math.random() * 4)}m ${Math.floor(Math.random() * 50) + 10}s`,
              };
            }
            return { ...job, progress: Math.min(newProgress, 99) };
          }
          return job;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Counts depend on active top-level tab
  const counts = useMemo(
    () => historyTab === 'uploads' ? getCounts(batches) : getCounts(jobs),
    [historyTab, batches, jobs]
  );

  // Filter + search for uploads tab
  const filteredBatches = useMemo(() => {
    if (historyTab !== 'uploads') return [];
    let result = batches;
    switch (activeFilter) {
      case 'success': result = result.filter((b) => b.status === 'success'); break;
      case 'issues': result = result.filter((b) => b.status === 'warning' || b.status === 'processing'); break;
      case 'failed': result = result.filter((b) => b.status === 'error'); break;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => b.batchId.toLowerCase().includes(q));
    }
    return result;
  }, [historyTab, batches, activeFilter, searchQuery]);

  // Filter + search for ingestion tab
  const filteredJobs = useMemo(() => {
    if (historyTab !== 'ingestion') return [];
    let result = jobs;
    switch (activeFilter) {
      case 'success': result = result.filter((j) => j.status === 'success'); break;
      case 'issues': result = result.filter((j) => j.status === 'warning' || j.status === 'processing'); break;
      case 'failed': result = result.filter((j) => j.status === 'error'); break;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((j) => j.jobId.toLowerCase().includes(q));
    }
    return result;
  }, [historyTab, jobs, activeFilter, searchQuery]);

  const handleRowClick = (batch: UploadBatch) => {
    if (batch.status === 'processing') return;
    setSelectedBatch(batch);
    setDrawerOpen(true);
  };

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: dc?.filterAll || 'All', count: counts.all },
    { key: 'success', label: dc?.filterSuccess || 'Success', count: counts.success },
    { key: 'issues', label: dc?.filterIssues || 'Issues', count: counts.issues },
    { key: 'failed', label: dc?.filterFailed || 'Failed', count: counts.failed },
  ];

  const historyTabs: { key: HistoryTab; label: string; icon: typeof Upload }[] = [
    { key: 'uploads', label: dc?.tabUploads || 'Uploads', icon: Upload },
    { key: 'ingestion', label: dc?.tabIngestion || 'Ingestion Jobs', icon: Download },
  ];

  const currentItems = historyTab === 'uploads' ? filteredBatches : filteredJobs;

  return (
    <>
      <div className="vx-card">
        {/* Header */}
        <div className="vx-card-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-foreground">
                {dc?.historyTitle || 'History'}
              </h3>
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                {counts.all}
              </span>
              <div className="relative group">
                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
                  {historyTab === 'uploads'
                    ? (dc?.uploadHistoryTooltip || 'Complete history of data batch uploads to ad platforms.')
                    : (dc?.ingestionHistoryTooltip || 'History of data ingestion jobs from your sources.')}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
                </div>
              </div>
            </div>

            {/* Top-level tab pills */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
              {historyTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => switchTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    historyTab === tab.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {historyTab === 'uploads'
              ? (dc?.uploadHistoryDesc || 'Batch upload history and status tracking')
              : (dc?.ingestionHistoryDesc || 'Data ingestion job history and status')}
          </p>
        </div>

        {/* Filter + Search bar */}
        <div className="px-6 py-3 border-b border-gray-100 bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  activeFilter === tab.key
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-semibold ${
                  activeFilter === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={
                historyTab === 'uploads'
                  ? (dc?.searchBatchId || 'Search batch ID...')
                  : (dc?.searchJobId || 'Search job ID...')
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 w-48"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {currentItems.length > 0 ? (
            historyTab === 'uploads' ? (
              /* Uploads Table */
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="vx-th text-left w-[70px]">{dc?.columnTime || 'Time'}</th>
                    <th className="vx-th text-left w-[140px]">{dc?.columnBatchId || 'Batch ID'}</th>
                    <th className="vx-th text-left">{dc?.columnDestination || 'Destination'}</th>
                    <th className="vx-th text-left w-[70px]">{dc?.columnSource || 'Source'}</th>
                    <th className="vx-th text-right w-[90px]">{dc?.columnRecords || 'Records'}</th>
                    <th className="vx-th text-right w-[100px]">{dc?.columnMatchRate || 'Match Rate'}</th>
                    <th className="vx-th text-left w-[120px]">{dc?.columnStatus || 'Status'}</th>
                    <th className="vx-th text-center w-[70px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredBatches.map((batch) => (
                    <tr
                      key={batch.id}
                      onClick={() => handleRowClick(batch)}
                      className={`border-b border-gray-50 transition-colors ${
                        batch.status !== 'processing' ? 'cursor-pointer' : 'cursor-default'
                      } ${getRowHoverClass(batch.status)}`}
                    >
                      <td className="vx-td">
                        <span className="text-xs font-mono text-gray-500">{batch.displayTime}</span>
                      </td>
                      <td className="vx-td">
                        <span className="text-xs font-mono text-gray-700">#{batch.batchId}</span>
                      </td>
                      <td className="vx-td">
                        <div className="flex items-center gap-2 text-xs">
                          {getPlatformSmallIcon(batch.destinationPlatform)}
                          <span className="text-gray-700 font-medium">{batch.destinationName}</span>
                        </div>
                      </td>
                      <td className="vx-td">
                        <SourceBadge sourceType={batch.sourceType} sourceName={batch.sourceName} />
                      </td>
                      <td className="vx-td text-right">
                        <span className="text-xs text-gray-900 font-medium">{fNumber(batch.recordsSent)}</span>
                      </td>
                      <td className="vx-td text-right">
                        {batch.status === 'processing' ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : batch.matchRate === 0 && batch.status === 'error' ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${getMatchRateBarColor(batch.matchRate)}`}
                                style={{ width: `${batch.matchRate}%` }}
                              />
                            </div>
                            <span className={`text-xs font-bold ${getMatchRateColor(batch.matchRate)}`}>
                              {batch.matchRate}%
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="vx-td">
                        <StatusBadge status={batch.status} progress={batch.progress} dc={dc} />
                      </td>
                      <td className="vx-td text-center">
                        {batch.status !== 'processing' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(batch);
                            }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                          >
                            {dc?.viewReport || 'View'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* Ingestion Jobs Table */
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="vx-th text-left w-[70px]">{dc?.columnTime || 'Time'}</th>
                    <th className="vx-th text-left w-[130px]">{dc?.columnJobId || 'Job ID'}</th>
                    <th className="vx-th text-left w-[70px]">{dc?.columnSource || 'Source'}</th>
                    <th className="vx-th text-left">{dc?.columnFile || 'File'}</th>
                    <th className="vx-th text-right w-[90px]">{dc?.columnRecords || 'Records'}</th>
                    <th className="vx-th text-right w-[90px]">{dc?.columnRejected || 'Rejected'}</th>
                    <th className="vx-th text-left w-[120px]">{dc?.columnStatus || 'Status'}</th>
                    <th className="vx-th text-right w-[80px]">{dc?.columnDuration || 'Duration'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredJobs.map((job) => (
                    <tr
                      key={job.id}
                      className={`border-b border-gray-50 transition-colors cursor-default ${getRowHoverClass(job.status)}`}
                    >
                      <td className="vx-td">
                        <span className="text-xs font-mono text-gray-500">{job.displayTime}</span>
                      </td>
                      <td className="vx-td">
                        <span className="text-xs font-mono text-gray-700">#{job.jobId}</span>
                      </td>
                      <td className="vx-td">
                        <SourceBadge sourceType={job.sourceType} sourceName={job.sourceName} />
                      </td>
                      <td className="vx-td">
                        {job.fileName ? (
                          <span className="text-xs font-mono text-gray-600 truncate block max-w-[220px]" title={job.fileName}>
                            {job.fileName}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="vx-td text-right">
                        {job.status === 'processing' ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : (
                          <span className="text-xs text-gray-900 font-medium">{fNumber(job.recordsIngested)}</span>
                        )}
                      </td>
                      <td className="vx-td text-right">
                        {job.status === 'processing' ? (
                          <span className="text-xs text-gray-400">—</span>
                        ) : job.recordsRejected > 0 ? (
                          <span className="text-xs text-red-600 font-medium">{fNumber(job.recordsRejected)}</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="vx-td">
                        <StatusBadge status={job.status} progress={job.progress} dc={dc} />
                      </td>
                      <td className="vx-td text-right">
                        {job.duration ? (
                          <span className="text-xs font-mono text-gray-500">{job.duration}</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            <div className="py-16 text-center">
              <FileSearch className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-500">
                {dc?.noResults || 'No batches match your filter'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {dc?.noResultsDesc || 'Try changing the filter or search criteria'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Batch Report Drawer */}
      <OfflineBatchReportSheet
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        event={
          selectedBatch
            ? {
                batchId: selectedBatch.batchId,
                platform: selectedBatch.destinationPlatform,
                status: selectedBatch.status,
                title: selectedBatch.destinationName,
                subtitle: `${fNumber(selectedBatch.recordsSent)} records`,
              }
            : null
        }
      />
    </>
  );
}
