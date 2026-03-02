// Mock data and types for the Data Connection tab
// All pipeline, source, destination, and upload batch data lives here

// --- Type Definitions ---

export type SourceType = 'api' | 'sftp';
export type SourceStatus = 'connected' | 'syncing' | 'warning' | 'error';
export type DestinationPlatform = 'google' | 'meta' | 'tiktok';
export type DestinationStatus = 'active' | 'syncing' | 'warning' | 'error' | 'paused';
export type BatchStatus = 'success' | 'warning' | 'error' | 'processing';
export type SyncResult = 'success' | 'warning' | 'error';
export type PipelineHealthLevel = 'healthy' | 'degraded' | 'disrupted';
export type IssueSeverity = 'critical' | 'warning' | 'info';

export interface PipelineHealthData {
  level: PipelineHealthLevel;
  eventsProcessed24h: number;
  eventsProcessedChange: number;
  avgMatchRate: number;
  avgMatchRateChange: number;
  systemUptime: number;
  activeIssuesCount: number;
  lastChecked: string;
}

export interface IngestionSource {
  id: string;
  name: string;
  type: SourceType;
  status: SourceStatus;
  serverUrl: string;
  filePath?: string;
  fileRegex?: string;
  schedule: string;
  timezone: string;
  lastSync: string;
  lastSyncTimestamp: string;
  fileSize: string;
  recordCount: string;
  recentSyncs: SyncResult[];
}

export interface PlatformDestination {
  id: string;
  name: string;
  platform: DestinationPlatform;
  status: DestinationStatus;
  lastUpload: string;
  lastUploadTimestamp: string;
  eventsUploaded: number;
  matchRate: number;
  nextScheduled: string;
  errorCount: number;
}

export interface UploadBatch {
  id: string;
  batchId: string;
  timestamp: string;
  displayTime: string;
  sourceName: string;
  sourceType: SourceType;
  destinationName: string;
  destinationPlatform: DestinationPlatform;
  recordsSent: number;
  recordsMatched: number;
  matchRate: number;
  status: BatchStatus;
  progress?: number;
  errorMessage?: string;
  duration?: string;
}

export interface IngestionJob {
  id: string;
  jobId: string;
  timestamp: string;
  displayTime: string;
  sourceName: string;
  sourceType: SourceType;
  fileName?: string;
  recordsIngested: number;
  recordsRejected: number;
  fileSize?: string;
  status: BatchStatus;
  progress?: number;
  errorMessage?: string;
  duration?: string;
}

export interface ActiveIssue {
  id: string;
  severity: IssueSeverity;
  platform?: DestinationPlatform;
  title: string;
  description: string;
  timestamp: string;
  suggestedAction: string;
  isRetryable: boolean;
  isDismissable: boolean;
}

// --- Mock Data ---

export const mockPipelineHealth: PipelineHealthData = {
  level: 'degraded',
  eventsProcessed24h: 127340,
  eventsProcessedChange: 8.2,
  avgMatchRate: 76.4,
  avgMatchRateChange: -1.2,
  systemUptime: 99.98,
  activeIssuesCount: 1,
  lastChecked: '2026-02-27T14:50:00+03:00',
};

export const mockIngestionSources: IngestionSource[] = [
  {
    id: 'src-sftp',
    name: 'SFTP',
    type: 'sftp',
    status: 'connected',
    serverUrl: 'sftp://data.example.com.tr',
    filePath: '/exports/sales/',
    fileRegex: 'store-sales-*.csv',
    schedule: 'Daily @ 02:00',
    timezone: 'GMT+03:00 Istanbul',
    lastSync: '2 min ago',
    lastSyncTimestamp: '2026-02-27T14:48:00+03:00',
    fileSize: '847 MB',
    recordCount: '1.2M rows',
    recentSyncs: ['success', 'success', 'success', 'warning', 'success', 'success', 'success'],
  },
  {
    id: 'src-api',
    name: 'API',
    type: 'api',
    status: 'syncing',
    serverUrl: 'https://api.example.com.tr/v2',
    filePath: '/exports/customers',
    schedule: 'Every 15 min',
    timezone: 'GMT+03:00 Istanbul',
    lastSync: 'Syncing...',
    lastSyncTimestamp: '2026-02-27T14:50:00+03:00',
    fileSize: '234 MB',
    recordCount: '458K records',
    recentSyncs: ['success', 'success', 'success', 'success', 'success', 'success', 'success'],
  },
];

export const mockDestinations: PlatformDestination[] = [
  {
    id: 'dest-google',
    name: 'Google Ads',
    platform: 'google',
    status: 'active',
    lastUpload: '5 min ago',
    lastUploadTimestamp: '2026-02-27T14:45:00+03:00',
    eventsUploaded: 125420,
    matchRate: 78.3,
    nextScheduled: 'In 10 min',
    errorCount: 0,
  },
  {
    id: 'dest-meta',
    name: 'Meta CAPI',
    platform: 'meta',
    status: 'active',
    lastUpload: '5 min ago',
    lastUploadTimestamp: '2026-02-27T14:45:00+03:00',
    eventsUploaded: 125420,
    matchRate: 82.1,
    nextScheduled: 'In 10 min',
    errorCount: 0,
  },
  {
    id: 'dest-tiktok',
    name: 'TikTok Events API',
    platform: 'tiktok',
    status: 'warning',
    lastUpload: '5 min ago',
    lastUploadTimestamp: '2026-02-27T14:45:00+03:00',
    eventsUploaded: 125420,
    matchRate: 65.2,
    nextScheduled: 'In 10 min',
    errorCount: 3,
  },
];

export const mockUploadBatches: UploadBatch[] = [
  // ── Batch group: 14:48 SFTP (125,420 records → all 3 platforms) ──
  {
    id: 'ub-1a', batchId: '9921',
    timestamp: '2026-02-27T14:48:12+03:00', displayTime: '14:48',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Google Ads', destinationPlatform: 'google',
    recordsSent: 125420, recordsMatched: 0, matchRate: 0,
    status: 'processing', progress: 45,
  },
  {
    id: 'ub-1b', batchId: '9921',
    timestamp: '2026-02-27T14:48:12+03:00', displayTime: '14:48',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Meta CAPI', destinationPlatform: 'meta',
    recordsSent: 125420, recordsMatched: 0, matchRate: 0,
    status: 'processing', progress: 62,
  },
  {
    id: 'ub-1c', batchId: '9921',
    timestamp: '2026-02-27T14:48:12+03:00', displayTime: '14:48',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'TikTok Events API', destinationPlatform: 'tiktok',
    recordsSent: 125420, recordsMatched: 0, matchRate: 0,
    status: 'processing', progress: 30,
  },
  // ── Batch group: 14:45 API (48,200 records → all 3 platforms) ──
  {
    id: 'ub-2a', batchId: '9920',
    timestamp: '2026-02-27T14:45:30+03:00', displayTime: '14:45',
    sourceName: 'API', sourceType: 'api',
    destinationName: 'Google Ads', destinationPlatform: 'google',
    recordsSent: 48200, recordsMatched: 0, matchRate: 0,
    status: 'processing', progress: 85,
  },
  {
    id: 'ub-2b', batchId: '9920',
    timestamp: '2026-02-27T14:45:30+03:00', displayTime: '14:45',
    sourceName: 'API', sourceType: 'api',
    destinationName: 'Meta CAPI', destinationPlatform: 'meta',
    recordsSent: 48200, recordsMatched: 0, matchRate: 0,
    status: 'processing', progress: 72,
  },
  {
    id: 'ub-2c', batchId: '9920',
    timestamp: '2026-02-27T14:45:30+03:00', displayTime: '14:45',
    sourceName: 'API', sourceType: 'api',
    destinationName: 'TikTok Events API', destinationPlatform: 'tiktok',
    recordsSent: 48200, recordsMatched: 31812, matchRate: 66.0,
    status: 'warning', errorMessage: 'Low match rate below 70% threshold',
    duration: '1m 48s',
  },
  // ── Batch group: 13:00 SFTP (118,340 records → all 3 platforms) ──
  {
    id: 'ub-3a', batchId: '9919',
    timestamp: '2026-02-27T13:00:00+03:00', displayTime: '13:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Google Ads', destinationPlatform: 'google',
    recordsSent: 118340, recordsMatched: 92648, matchRate: 78.3,
    status: 'success', duration: '1m 45s',
  },
  {
    id: 'ub-3b', batchId: '9919',
    timestamp: '2026-02-27T13:00:00+03:00', displayTime: '13:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Meta CAPI', destinationPlatform: 'meta',
    recordsSent: 118340, recordsMatched: 97039, matchRate: 82.0,
    status: 'success', duration: '1m 22s',
  },
  {
    id: 'ub-3c', batchId: '9919',
    timestamp: '2026-02-27T13:00:00+03:00', displayTime: '13:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'TikTok Events API', destinationPlatform: 'tiktok',
    recordsSent: 118340, recordsMatched: 0, matchRate: 0,
    status: 'error', errorMessage: 'Access token expired — re-authenticate in TikTok Business Center',
    duration: '0m 04s',
  },
  // ── Batch group: 12:45 API (45,800 records → all 3 platforms) ──
  {
    id: 'ub-4a', batchId: '9918',
    timestamp: '2026-02-27T12:45:00+03:00', displayTime: '12:45',
    sourceName: 'API', sourceType: 'api',
    destinationName: 'Google Ads', destinationPlatform: 'google',
    recordsSent: 45800, recordsMatched: 36182, matchRate: 79.0,
    status: 'success', duration: '0m 58s',
  },
  {
    id: 'ub-4b', batchId: '9918',
    timestamp: '2026-02-27T12:45:00+03:00', displayTime: '12:45',
    sourceName: 'API', sourceType: 'api',
    destinationName: 'Meta CAPI', destinationPlatform: 'meta',
    recordsSent: 45800, recordsMatched: 38172, matchRate: 83.3,
    status: 'success', duration: '0m 44s',
  },
  {
    id: 'ub-4c', batchId: '9918',
    timestamp: '2026-02-27T12:45:00+03:00', displayTime: '12:45',
    sourceName: 'API', sourceType: 'api',
    destinationName: 'TikTok Events API', destinationPlatform: 'tiktok',
    recordsSent: 45800, recordsMatched: 0, matchRate: 0,
    status: 'error', errorMessage: 'API timeout after 30s — TikTok Events API unresponsive',
    duration: '0m 30s',
  },
  // ── Batch group: 12:00 SFTP (112,500 records → all 3 platforms) ──
  {
    id: 'ub-5a', batchId: '9917',
    timestamp: '2026-02-27T12:00:00+03:00', displayTime: '12:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Google Ads', destinationPlatform: 'google',
    recordsSent: 112500, recordsMatched: 88875, matchRate: 79.0,
    status: 'success', duration: '1m 38s',
  },
  {
    id: 'ub-5b', batchId: '9917',
    timestamp: '2026-02-27T12:00:00+03:00', displayTime: '12:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Meta CAPI', destinationPlatform: 'meta',
    recordsSent: 112500, recordsMatched: 92250, matchRate: 82.0,
    status: 'success', duration: '1m 15s',
  },
  {
    id: 'ub-5c', batchId: '9917',
    timestamp: '2026-02-27T12:00:00+03:00', displayTime: '12:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'TikTok Events API', destinationPlatform: 'tiktok',
    recordsSent: 112500, recordsMatched: 73238, matchRate: 65.1,
    status: 'warning', errorMessage: 'Low match rate: 3 hashing errors detected',
    duration: '2m 14s',
  },
  // ── Batch group: 10:00 API (42,300 records → all 3 platforms) ──
  {
    id: 'ub-6a', batchId: '9916',
    timestamp: '2026-02-27T10:00:00+03:00', displayTime: '10:00',
    sourceName: 'API', sourceType: 'api',
    destinationName: 'Google Ads', destinationPlatform: 'google',
    recordsSent: 42300, recordsMatched: 33414, matchRate: 79.0,
    status: 'success', duration: '0m 52s',
  },
  {
    id: 'ub-6b', batchId: '9916',
    timestamp: '2026-02-27T10:00:00+03:00', displayTime: '10:00',
    sourceName: 'API', sourceType: 'api',
    destinationName: 'Meta CAPI', destinationPlatform: 'meta',
    recordsSent: 42300, recordsMatched: 35113, matchRate: 83.0,
    status: 'success', duration: '0m 38s',
  },
  {
    id: 'ub-6c', batchId: '9916',
    timestamp: '2026-02-27T10:00:00+03:00', displayTime: '10:00',
    sourceName: 'API', sourceType: 'api',
    destinationName: 'TikTok Events API', destinationPlatform: 'tiktok',
    recordsSent: 42300, recordsMatched: 27918, matchRate: 66.0,
    status: 'success', duration: '0m 45s',
  },
  // ── Batch group: 09:00 SFTP (98,700 records → all 3 platforms) ──
  {
    id: 'ub-7a', batchId: '9915',
    timestamp: '2026-02-27T09:00:00+03:00', displayTime: '09:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Google Ads', destinationPlatform: 'google',
    recordsSent: 98700, recordsMatched: 77972, matchRate: 79.0,
    status: 'success', duration: '1m 28s',
  },
  {
    id: 'ub-7b', batchId: '9915',
    timestamp: '2026-02-27T09:00:00+03:00', displayTime: '09:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Meta CAPI', destinationPlatform: 'meta',
    recordsSent: 98700, recordsMatched: 80934, matchRate: 82.0,
    status: 'success', duration: '1m 12s',
  },
  {
    id: 'ub-7c', batchId: '9915',
    timestamp: '2026-02-27T09:00:00+03:00', displayTime: '09:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'TikTok Events API', destinationPlatform: 'tiktok',
    recordsSent: 98700, recordsMatched: 64154, matchRate: 65.0,
    status: 'warning', errorMessage: 'Match rate degraded from last batch (was 68%)',
    duration: '1m 55s',
  },
  // ── Batch group: 08:00 SFTP (89,200 records → all 3 platforms) ──
  {
    id: 'ub-8a', batchId: '9914',
    timestamp: '2026-02-27T08:00:00+03:00', displayTime: '08:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Google Ads', destinationPlatform: 'google',
    recordsSent: 89200, recordsMatched: 66008, matchRate: 74.0,
    status: 'success', duration: '2m 55s',
  },
  {
    id: 'ub-8b', batchId: '9914',
    timestamp: '2026-02-27T08:00:00+03:00', displayTime: '08:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'Meta CAPI', destinationPlatform: 'meta',
    recordsSent: 89200, recordsMatched: 72252, matchRate: 81.0,
    status: 'success', duration: '2m 30s',
  },
  {
    id: 'ub-8c', batchId: '9914',
    timestamp: '2026-02-27T08:00:00+03:00', displayTime: '08:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    destinationName: 'TikTok Events API', destinationPlatform: 'tiktok',
    recordsSent: 89200, recordsMatched: 57688, matchRate: 64.7,
    status: 'success', duration: '3m 10s',
  },
];

export const mockIngestionJobs: IngestionJob[] = [
  // Processing
  {
    id: 'ij-1', jobId: 'ING-4412',
    timestamp: '2026-02-27T14:48:00+03:00', displayTime: '14:48',
    sourceName: 'SFTP', sourceType: 'sftp',
    fileName: 'store-sales-20260227-afternoon.csv',
    recordsIngested: 0, recordsRejected: 0,
    fileSize: '847 MB',
    status: 'processing', progress: 38,
  },
  {
    id: 'ij-2', jobId: 'ING-4411',
    timestamp: '2026-02-27T14:45:00+03:00', displayTime: '14:45',
    sourceName: 'API', sourceType: 'api',
    recordsIngested: 0, recordsRejected: 0,
    status: 'processing', progress: 81,
  },
  // Warnings
  {
    id: 'ij-3', jobId: 'ING-4410',
    timestamp: '2026-02-27T14:30:00+03:00', displayTime: '14:30',
    sourceName: 'SFTP', sourceType: 'sftp',
    fileName: 'store-sales-20260227-midday.csv',
    recordsIngested: 118200, recordsRejected: 342,
    fileSize: '824 MB',
    status: 'warning', errorMessage: '342 rows rejected — invalid phone format',
    duration: '4m 12s',
  },
  {
    id: 'ij-4', jobId: 'ING-4409',
    timestamp: '2026-02-27T13:15:00+03:00', displayTime: '13:15',
    sourceName: 'API', sourceType: 'api',
    recordsIngested: 45600, recordsRejected: 18,
    status: 'warning', errorMessage: 'Schema warning — 18 records missing email field',
    duration: '0m 22s',
  },
  // Errors
  {
    id: 'ij-5', jobId: 'ING-4408',
    timestamp: '2026-02-27T12:00:00+03:00', displayTime: '12:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    fileName: 'store-sales-20260227-morning.csv',
    recordsIngested: 0, recordsRejected: 0,
    fileSize: '0 B',
    status: 'error', errorMessage: 'Connection timeout — SFTP server unreachable',
    duration: '0m 30s',
  },
  {
    id: 'ij-6', jobId: 'ING-4407',
    timestamp: '2026-02-27T10:00:00+03:00', displayTime: '10:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    fileName: 'store-sales-20260227-early.csv',
    recordsIngested: 0, recordsRejected: 0,
    fileSize: '12 KB',
    status: 'error', errorMessage: 'Malformed CSV — missing header row',
    duration: '0m 02s',
  },
  // Success
  {
    id: 'ij-7', jobId: 'ING-4406',
    timestamp: '2026-02-27T09:00:00+03:00', displayTime: '09:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    fileName: 'store-sales-20260227-dawn.csv',
    recordsIngested: 124500, recordsRejected: 0,
    fileSize: '862 MB',
    status: 'success', duration: '3m 48s',
  },
  {
    id: 'ij-8', jobId: 'ING-4405',
    timestamp: '2026-02-27T08:45:00+03:00', displayTime: '08:45',
    sourceName: 'API', sourceType: 'api',
    recordsIngested: 42300, recordsRejected: 0,
    status: 'success', duration: '0m 18s',
  },
  {
    id: 'ij-9', jobId: 'ING-4404',
    timestamp: '2026-02-27T08:00:00+03:00', displayTime: '08:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    fileName: 'store-sales-20260226-night.csv',
    recordsIngested: 98700, recordsRejected: 0,
    fileSize: '715 MB',
    status: 'success', duration: '3m 22s',
  },
  {
    id: 'ij-10', jobId: 'ING-4403',
    timestamp: '2026-02-27T06:00:00+03:00', displayTime: '06:00',
    sourceName: 'API', sourceType: 'api',
    recordsIngested: 38200, recordsRejected: 0,
    status: 'success', duration: '0m 15s',
  },
  {
    id: 'ij-11', jobId: 'ING-4402',
    timestamp: '2026-02-27T04:00:00+03:00', displayTime: '04:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    fileName: 'store-sales-20260226-evening.csv',
    recordsIngested: 105200, recordsRejected: 0,
    fileSize: '780 MB',
    status: 'success', duration: '3m 55s',
  },
  {
    id: 'ij-12', jobId: 'ING-4401',
    timestamp: '2026-02-27T02:00:00+03:00', displayTime: '02:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    fileName: 'store-sales-20260226-daily.csv',
    recordsIngested: 112500, recordsRejected: 0,
    fileSize: '834 MB',
    status: 'success', duration: '4m 10s',
  },
  {
    id: 'ij-13', jobId: 'ING-4400',
    timestamp: '2026-02-26T23:00:00+03:00', displayTime: '23:00',
    sourceName: 'API', sourceType: 'api',
    recordsIngested: 35800, recordsRejected: 0,
    status: 'success', duration: '0m 14s',
  },
  {
    id: 'ij-14', jobId: 'ING-4399',
    timestamp: '2026-02-26T20:00:00+03:00', displayTime: '20:00',
    sourceName: 'SFTP', sourceType: 'sftp',
    fileName: 'store-sales-20260226-afternoon.csv',
    recordsIngested: 89200, recordsRejected: 0,
    fileSize: '698 MB',
    status: 'success', duration: '3m 05s',
  },
];

export const mockActiveIssues: ActiveIssue[] = [
  {
    id: 'issue-2',
    severity: 'warning',
    title: 'SFTP Feed Delayed',
    description: 'The daily SFTP export has not arrived. Expected at 04:00 TRT, now 22 hours overdue.',
    timestamp: '2026-02-26T04:00:00+03:00',
    suggestedAction: 'Contact the data team or check SFTP server connectivity. Verify that the scheduled job on the source side completed successfully.',
    isRetryable: false,
    isDismissable: true,
  },
];

