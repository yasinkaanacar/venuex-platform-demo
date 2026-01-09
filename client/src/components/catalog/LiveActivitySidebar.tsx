import { useState, useEffect, useRef } from 'react';
import { SiGoogle, SiMeta } from 'react-icons/si';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

type EventType = 'ingestion' | 'processing' | 'outcome';
type EventStatus = 'success' | 'warning' | 'error' | 'pending';

interface JobLogEntry {
  id: number;
  timestamp: string;
  batchId: string;
  eventType: EventType;
  title: string;
  message: string;
  status: EventStatus;
  platform?: 'google' | 'meta' | 'erp';
  issueCount?: number;
  errorReason?: string;
}

const initialLogs: JobLogEntry[] = [
  { 
    id: 5, 
    timestamp: '14:32:45', 
    batchId: '204',
    eventType: 'outcome',
    title: 'Sync Failed: Meta',
    message: 'API connection timed out after 30s',
    status: 'error',
    platform: 'meta',
    errorReason: 'API Timeout'
  },
  { 
    id: 4, 
    timestamp: '14:32:12', 
    batchId: '204',
    eventType: 'processing',
    title: 'Sync Started: Meta Commerce',
    message: 'Initiating product feed sync...',
    status: 'pending',
    platform: 'meta'
  },
  { 
    id: 3, 
    timestamp: '14:31:58', 
    batchId: '204',
    eventType: 'outcome',
    title: 'Sync Completed: Google',
    message: '124,850 products synced successfully',
    status: 'warning',
    platform: 'google',
    issueCount: 45
  },
  { 
    id: 2, 
    timestamp: '14:31:15', 
    batchId: '204',
    eventType: 'processing',
    title: 'Sync Started: Google Merchant',
    message: 'Pushing inventory updates...',
    status: 'success',
    platform: 'google'
  },
  { 
    id: 1, 
    timestamp: '14:30:02', 
    batchId: '204',
    eventType: 'ingestion',
    title: 'Data Received from ERP',
    message: 'Successfully pulled 125,000 items',
    status: 'success',
    platform: 'erp'
  },
];

const simulatedEvents: Omit<JobLogEntry, 'id' | 'timestamp'>[] = [
  { 
    batchId: '205',
    eventType: 'ingestion',
    title: 'Data Received from ERP',
    message: 'Successfully pulled 118,420 items',
    status: 'success',
    platform: 'erp'
  },
  { 
    batchId: '205',
    eventType: 'processing',
    title: 'Sync Started: Google Merchant',
    message: 'Processing inventory updates...',
    status: 'success',
    platform: 'google'
  },
  { 
    batchId: '205',
    eventType: 'outcome',
    title: 'Sync Completed: Google',
    message: '118,420 products synced',
    status: 'success',
    platform: 'google'
  },
  { 
    batchId: '205',
    eventType: 'processing',
    title: 'Sync Started: Meta Commerce',
    message: 'Initiating catalog sync...',
    status: 'pending',
    platform: 'meta'
  },
  { 
    batchId: '205',
    eventType: 'outcome',
    title: 'Sync Completed: Meta',
    message: '118,200 products synced',
    status: 'warning',
    platform: 'meta',
    issueCount: 12
  },
];

export default function LiveActivitySidebar() {
  const [logs, setLogs] = useState<JobLogEntry[]>(initialLogs);
  const nextIdRef = useRef(initialLogs.length + 1);
  const eventIndexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      const eventTemplate = simulatedEvents[eventIndexRef.current % simulatedEvents.length];
      
      const newLog: JobLogEntry = {
        ...eventTemplate,
        id: nextIdRef.current,
        timestamp,
      };

      nextIdRef.current += 1;
      eventIndexRef.current += 1;
      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
    }
  };

  const getStatusBgColor = (status: EventStatus) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'pending': return 'bg-blue-50 border-blue-200';
    }
  };

  const getStatusText = (entry: JobLogEntry) => {
    switch (entry.status) {
      case 'success': return 'Completed Successfully';
      case 'warning': return `Completed with ${entry.issueCount} Issues`;
      case 'error': return `Failed: ${entry.errorReason}`;
      case 'pending': return 'In Progress...';
    }
  };

  const getStatusTextColor = (status: EventStatus) => {
    switch (status) {
      case 'success': return 'text-green-700';
      case 'warning': return 'text-yellow-700';
      case 'error': return 'text-red-700';
      case 'pending': return 'text-blue-700';
    }
  };

  const getPlatformIcon = (platform?: 'google' | 'meta' | 'erp') => {
    switch (platform) {
      case 'google': return <SiGoogle className="w-3.5 h-3.5 text-gray-500" />;
      case 'meta': return <SiMeta className="w-3.5 h-3.5 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col min-h-full">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-50"></div>
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">Pipeline Activity</h3>
      </div>

      {/* Log Entries */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className={`rounded-lg border p-3 ${getStatusBgColor(log.status)}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-500">{log.timestamp}</span>
                {getPlatformIcon(log.platform)}
              </div>
              <span className="text-xs font-medium text-gray-500">Batch #{log.batchId}</span>
            </div>

            {/* Title */}
            <h4 className="text-sm font-medium text-gray-900 mb-1">{log.title}</h4>
            
            {/* Message */}
            <p className="text-xs text-gray-600 mb-2">{log.message}</p>

            {/* Footer/Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {getStatusIcon(log.status)}
                <span className={`text-xs font-medium ${getStatusTextColor(log.status)}`}>
                  {getStatusText(log)}
                </span>
              </div>
              
              {(log.status === 'warning' || log.status === 'error') && (
                <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
                  See Details <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
