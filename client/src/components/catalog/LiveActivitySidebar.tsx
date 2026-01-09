import { useState, useEffect, useRef } from 'react';
import { SiGoogle, SiMeta } from 'react-icons/si';
import { CheckCircle, AlertTriangle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import LogDetailDrawer from './LogDetailDrawer';

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

const initialEvents: TimelineEvent[] = [
  { 
    id: 1, 
    timestamp: '14:45:12', 
    batchId: '9921',
    title: 'Ingesting from ERP...',
    subtitle: 'Processing batch data',
    status: 'processing',
    platform: 'erp',
    progress: 45
  },
  { 
    id: 2, 
    timestamp: '14:42:30', 
    batchId: '9920',
    title: 'Google Sync Finished',
    subtitle: '120 Issues found',
    status: 'warning',
    platform: 'google'
  },
  { 
    id: 3, 
    timestamp: '14:38:15', 
    batchId: '9920',
    title: 'Meta Sync Complete',
    subtitle: '5k items updated',
    status: 'success',
    platform: 'meta'
  },
  { 
    id: 4, 
    timestamp: '14:35:02', 
    batchId: '9919',
    title: 'Connection Failed',
    subtitle: 'Invalid Token',
    status: 'error',
    platform: 'google'
  },
  { 
    id: 5, 
    timestamp: '14:30:45', 
    batchId: '9918',
    title: 'Meta Catalog Synced',
    subtitle: '12.4k products updated',
    status: 'success',
    platform: 'meta'
  },
];

export default function LiveActivitySidebar() {
  const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const nextIdRef = useRef(initialEvents.length + 1);

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => {
        return prev.map(event => {
          if (event.status === 'processing' && event.progress !== undefined) {
            const newProgress = event.progress + Math.floor(Math.random() * 15) + 5;
            if (newProgress >= 100) {
              return {
                ...event,
                status: 'success' as EventStatus,
                title: 'ERP Ingestion Complete',
                subtitle: '125k items processed',
                progress: undefined
              };
            }
            return { ...event, progress: Math.min(newProgress, 99) };
          }
          return event;
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleReview = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setDrawerOpen(true);
  };

  const handleRetry = (event: TimelineEvent) => {
    setEvents(prev => prev.map(e => 
      e.id === event.id 
        ? { ...e, status: 'processing' as EventStatus, title: 'Retrying connection...', subtitle: 'Attempting reconnect', progress: 0 }
        : e
    ));
  };

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case 'processing': 
        return (
          <div className="relative">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            <div className="absolute inset-0 w-5 h-5 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
          </div>
        );
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBg = (status: EventStatus) => {
    switch (status) {
      case 'processing': return 'bg-blue-500';
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
    }
  };

  const getPlatformIcon = (platform?: 'google' | 'meta' | 'erp') => {
    switch (platform) {
      case 'google': return <SiGoogle className="w-3.5 h-3.5" />;
      case 'meta': return <SiMeta className="w-3.5 h-3.5" />;
      default: return <span className="text-[10px] font-bold">ERP</span>;
    }
  };

  return (
    <>
      <div className="w-80 bg-gray-900 flex flex-col min-h-full">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
          <div className="relative">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-50"></div>
          </div>
          <h3 className="font-semibold text-white text-sm">Activity Feed</h3>
        </div>

        {/* Timeline Events */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-700"></div>

            {/* Events */}
            <div className="space-y-1">
              {events.map((event, index) => (
                <div key={event.id} className="relative pl-12 pr-4">
                  {/* Timeline Dot */}
                  <div className={`absolute left-[18px] top-3 w-3 h-3 rounded-full ${getStatusBg(event.status)} ring-4 ring-gray-900`}></div>

                  {/* Event Card */}
                  <div className="bg-gray-800 rounded-lg p-3 hover:bg-gray-750 transition-colors">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-500">{event.timestamp}</span>
                        <div className="text-gray-400">
                          {getPlatformIcon(event.platform)}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500">#{event.batchId}</span>
                    </div>

                    {/* Content */}
                    <div className="flex items-start gap-2">
                      {getStatusIcon(event.status)}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">
                          {event.title}
                          {event.progress !== undefined && (
                            <span className="text-blue-400 ml-1">({event.progress}%)</span>
                          )}
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">{event.subtitle}</p>
                      </div>
                    </div>

                    {/* Progress Bar for Processing */}
                    {event.status === 'processing' && event.progress !== undefined && (
                      <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 transition-all duration-500"
                          style={{ width: `${event.progress}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {event.status === 'warning' && (
                      <button 
                        onClick={() => handleReview(event)}
                        className="mt-2 w-full text-xs font-medium text-yellow-400 bg-yellow-500/10 hover:bg-yellow-500/20 py-1.5 rounded transition-colors"
                      >
                        Review Issues
                      </button>
                    )}
                    {event.status === 'error' && (
                      <button 
                        onClick={() => handleRetry(event)}
                        className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 py-1.5 rounded transition-colors"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <LogDetailDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        event={selectedEvent}
      />
    </>
  );
}
