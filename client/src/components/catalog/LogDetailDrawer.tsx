import { X, Clock, Hash, AlertTriangle, CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

type EventStatus = 'processing' | 'success' | 'warning' | 'error';

interface TimelineEvent {
  id: number;
  timestamp: string;
  batchId: string;
  title: string;
  subtitle: string;
  status: EventStatus;
  platform?: 'google' | 'meta' | 'erp';
  progress?: number;
}

interface LogDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: TimelineEvent | null;
}

interface LogEntry {
  time: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

const mockLogsByStatus: Record<EventStatus, LogEntry[]> = {
  processing: [
    { time: '14:45:12', level: 'info', message: 'Batch ingestion started' },
    { time: '14:45:13', level: 'info', message: 'Connected to ERP endpoint' },
    { time: '14:45:15', level: 'info', message: 'Reading product feed...' },
    { time: '14:45:18', level: 'info', message: 'Validating schema (125k rows)' },
  ],
  success: [
    { time: '14:38:00', level: 'info', message: 'Batch ingestion started' },
    { time: '14:38:02', level: 'info', message: 'Connected to platform API' },
    { time: '14:38:05', level: 'info', message: 'Schema validated — 0 errors' },
    { time: '14:38:10', level: 'info', message: 'Uploading 5,000 items...' },
    { time: '14:38:14', level: 'success', message: 'Upload complete — 5,000 items synced' },
    { time: '14:38:15', level: 'success', message: 'Batch finished successfully' },
  ],
  warning: [
    { time: '14:42:00', level: 'info', message: 'Batch ingestion started' },
    { time: '14:42:02', level: 'info', message: 'Connected to Google Merchant Center' },
    { time: '14:42:05', level: 'info', message: 'Schema validated — 120 warnings' },
    { time: '14:42:08', level: 'warn', message: '45 items: Store code mismatch' },
    { time: '14:42:10', level: 'warn', message: '32 items: Price format invalid' },
    { time: '14:42:12', level: 'warn', message: '28 items: Missing GTIN' },
    { time: '14:42:15', level: 'warn', message: '15 items: Invalid image URL' },
    { time: '14:42:20', level: 'info', message: 'Batch completed with 120 issues' },
  ],
  error: [
    { time: '14:35:00', level: 'info', message: 'Batch ingestion started' },
    { time: '14:35:01', level: 'info', message: 'Connecting to Google Merchant Center...' },
    { time: '14:35:02', level: 'error', message: 'Authentication failed — invalid OAuth token' },
    { time: '14:35:02', level: 'error', message: 'Connection aborted. Retry with valid credentials.' },
  ],
};

const statusConfig: Record<EventStatus, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  processing: {
    label: 'Processing',
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
  },
  success: {
    label: 'Completed',
    bg: 'bg-green-100',
    text: 'text-green-700',
    icon: <CheckCircle className="w-4 h-4" />,
  },
  warning: {
    label: 'Completed with Issues',
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  error: {
    label: 'Failed',
    bg: 'bg-red-100',
    text: 'text-red-700',
    icon: <XCircle className="w-4 h-4" />,
  },
};

const logLevelStyles: Record<LogEntry['level'], string> = {
  info: 'text-slate-500',
  warn: 'text-amber-600',
  error: 'text-red-600',
  success: 'text-green-600',
};

function getPlatformIcon(platform?: 'google' | 'meta' | 'erp') {
  switch (platform) {
    case 'google': return <SiGoogle className="w-4 h-4" />;
    case 'meta': return <SiMeta className="w-4 h-4" />;
    default: return <span className="text-xs font-bold">ERP</span>;
  }
}

function getPlatformLabel(platform?: 'google' | 'meta' | 'erp') {
  switch (platform) {
    case 'google': return 'Google Merchant Center';
    case 'meta': return 'Meta Catalog';
    default: return 'ERP System';
  }
}

export default function LogDetailDrawer({ isOpen, onClose, event }: LogDetailDrawerProps) {
  if (!isOpen || !event) return null;

  const status = statusConfig[event.status];
  const logs = mockLogsByStatus[event.status];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 h-full w-[600px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{event.title}</h2>
              <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full ${status.bg} ${status.text} text-sm font-medium`}>
                {status.icon}
                {status.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors -mr-2 -mt-1"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Meta Row */}
          <div className="flex items-center gap-5 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" />
              <span>Batch {event.batchId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{event.timestamp}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {getPlatformIcon(event.platform)}
              <span>{getPlatformLabel(event.platform)}</span>
            </div>
          </div>
        </div>

        {/* Body — Log Entries */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Event Log</p>

          <div className="space-y-0">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50">
                <span className="text-xs font-mono text-slate-400 pt-0.5 w-14 flex-shrink-0">{log.time}</span>
                <span className={`text-xs font-mono uppercase w-12 pt-0.5 flex-shrink-0 font-medium ${logLevelStyles[log.level]}`}>
                  {log.level}
                </span>
                <span className="text-sm text-slate-700">{log.message}</span>
              </div>
            ))}
          </div>

          {event.status === 'processing' && event.progress !== undefined && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">In Progress</span>
                <span className="text-sm font-mono text-blue-600">{event.progress}%</span>
              </div>
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${event.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(event.status === 'warning' || event.status === 'error') && (
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
              <Download className="w-4 h-4" />
              Download Log (.CSV)
            </button>
          </div>
        )}
      </div>
    </>
  );
}
