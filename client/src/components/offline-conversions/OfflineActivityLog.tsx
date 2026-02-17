import { useState, useEffect } from 'react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { CheckCircle, AlertTriangle, XCircle, Loader2, RefreshCw, Info, ChevronRight, ChevronDown, ChevronUp, Store, Database } from 'lucide-react';
import OfflineBatchReportSheet from './OfflineBatchReportSheet';

type EventStatus = 'processing' | 'success' | 'warning' | 'error';
type Platform = 'google' | 'meta' | 'tiktok' | 'crm' | 'pos';

interface TimelineEvent {
    id: number;
    timestamp: string;
    batchId: string;
    title: string;
    subtitle: string;
    status: EventStatus;
    platform?: Platform;
    progress?: number;
}

const initialEvents: TimelineEvent[] = [
    {
        id: 1,
        timestamp: '14:45:12',
        batchId: '9921',
        title: 'Ingesting from POS...',
        subtitle: 'Processing daily sales data',
        status: 'processing',
        platform: 'pos',
        progress: 45
    },
    {
        id: 2,
        timestamp: '14:42:30',
        batchId: '9920',
        title: 'Google Ads Upload',
        subtitle: '120 Conversions matched',
        status: 'warning',
        platform: 'google'
    },
    {
        id: 3,
        timestamp: '14:38:15',
        batchId: '9920',
        title: 'Meta CAPI Sync',
        subtitle: '5k events processed',
        status: 'success',
        platform: 'meta'
    },
    {
        id: 4,
        timestamp: '14:35:02',
        batchId: '9919',
        title: 'TikTok Events API',
        subtitle: 'Invalid Access Token',
        status: 'error',
        platform: 'tiktok'
    },
    {
        id: 5,
        timestamp: '14:30:45',
        batchId: '9918',
        title: 'CRM Data Sync',
        subtitle: '12.4k customer records updated',
        status: 'success',
        platform: 'crm'
    },
    {
        id: 6,
        timestamp: '14:25:10',
        batchId: '9917',
        title: 'Google Ads Upload',
        subtitle: '8.2k conversions uploaded',
        status: 'success',
        platform: 'google'
    },
    {
        id: 7,
        timestamp: '14:20:33',
        batchId: '9916',
        title: 'POS Data Received',
        subtitle: '15k transactions processed',
        status: 'success',
        platform: 'pos'
    },
];

export default function OfflineActivityLog() {
    const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
    const [isExpanded, setIsExpanded] = useState(true);

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
                                title: 'POS Ingestion Complete',
                                subtitle: '125k transactions processed',
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

    const handleEventClick = (event: TimelineEvent) => {
        if (event.status === 'processing') return;
        setSelectedEvent(event);
        setDrawerOpen(true);
    };

    const handleRetry = (e: React.MouseEvent, event: TimelineEvent) => {
        e.stopPropagation();
        setEvents(prev => prev.map(e =>
            e.id === event.id
                ? { ...e, status: 'processing' as EventStatus, title: 'Retrying upload...', subtitle: 'Attempting reconnect', progress: 0 }
                : e
        ));
    };

    const getStatusIcon = (status: EventStatus) => {
        switch (status) {
            case 'processing':
                return (
                    <div className="relative">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    </div>
                );
            case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
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

    const getCardBg = (status: EventStatus) => {
        switch (status) {
            case 'processing': return 'bg-blue-50 border-blue-200';
            case 'success': return 'bg-green-50 border-green-200 hover:bg-green-100/50 cursor-pointer';
            case 'warning': return 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100/80 cursor-pointer';
            case 'error': return 'bg-red-50 border-red-200 hover:bg-red-100/80 cursor-pointer';
        }
    };

    const getPlatformIcon = (platform?: Platform) => {
        switch (platform) {
            case 'google': return <SiGoogle className="w-3.5 h-3.5 text-red-500" />;
            case 'meta': return <SiMeta className="w-3.5 h-3.5 text-blue-600" />;
            case 'tiktok': return <SiTiktok className="w-3.5 h-3.5 text-black" />;
            case 'crm': return <Database className="w-3.5 h-3.5 text-purple-600" />;
            case 'pos': return <Store className="w-3.5 h-3.5 text-orange-600" />;
            default: return <Database className="w-3.5 h-3.5 text-gray-500" />;
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Header - Clickable */}
                <div
                    className="vx-card-header cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-50"></div>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">Conversion Upload Activity</h3>
                            <div className="relative group" onClick={(e) => e.stopPropagation()}>
                                <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                                    Real-time conversion uploads to ad platforms.
                                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                                </div>
                            </div>
                            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                {events.length} events
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Status of uploads to Google, Meta, and TikTok</p>
                </div>

                {/* Timeline Events - Collapsible */}
                {isExpanded && (
                    <div className="vx-card-body">
                        <div className="relative">
                            {/* Vertical Timeline Line */}
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                            {/* Events */}
                            <div className="space-y-4">
                                {events.map((event) => (
                                    <div key={event.id} className="relative pl-12 group">
                                        {/* Timeline Dot */}
                                        <div className={`absolute left-[10px] top-4 w-3 h-3 rounded-full ${getStatusBg(event.status)} ring-4 ring-white`}></div>

                                        {/* Event Card */}
                                        <div
                                            className={`rounded-lg border p-4 ${getCardBg(event.status)} transition-colors relative`}
                                            onClick={() => handleEventClick(event)}
                                        >
                                            {/* Header Row */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-mono text-gray-500">{event.timestamp}</span>
                                                    <div className="text-gray-500">
                                                        {getPlatformIcon(event.platform)}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500">#{event.batchId}</span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex items-start gap-3">
                                                {getStatusIcon(event.status)}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                        {event.title}
                                                        {event.progress !== undefined && (
                                                            <span className="text-blue-600 ml-2">({event.progress}%)</span>
                                                        )}
                                                        {event.status !== 'processing' && (
                                                            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                                                        )}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-0.5">{event.subtitle}</p>
                                                </div>
                                            </div>

                                            {/* Progress Bar for Processing */}
                                            {event.status === 'processing' && event.progress !== undefined && (
                                                <div className="mt-3 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 transition-all duration-500"
                                                        style={{ width: `${event.progress}%` }}
                                                    ></div>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            {event.status === 'error' && (
                                                <button
                                                    onClick={(e) => handleRetry(e, event)}
                                                    className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 border border-red-300 py-2 rounded-lg transition-colors z-10 relative"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                    Retry
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <OfflineBatchReportSheet
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                event={selectedEvent}
            />
        </>
    );
}
