import { useState, useEffect } from 'react';
import { SiGoogle, SiMeta } from 'react-icons/si';
import { CheckCircle, AlertTriangle, XCircle, Loader2, RefreshCw, Info, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import BatchReportSheet from './BatchReportSheet';

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
        title: 'Mağaza stok durumu alınıyor...',
        subtitle: '42 mağaza envanter dosyası işleniyor',
        status: 'processing',
        platform: 'erp',
        progress: 45
    },
    {
        id: 2,
        timestamp: '14:42:30',
        batchId: '9920',
        title: 'Google Merchant Center Senkronizasyonu Tamamlandı',
        subtitle: '120 mağaza-SKU çifti reddedildi',
        status: 'warning',
        platform: 'google'
    },
    {
        id: 3,
        timestamp: '14:38:15',
        batchId: '9920',
        title: 'Google Merchant Center Feed Yüklendi',
        subtitle: '42 mağazada 124,7B mağaza-SKU çifti',
        status: 'success',
        platform: 'google'
    },
    {
        id: 4,
        timestamp: '14:35:02',
        batchId: '9919',
        title: 'Google Merchant Center Kimlik Doğrulaması Başarısız',
        subtitle: 'Content API jetonu süresi doldu',
        status: 'error',
        platform: 'google'
    },
    {
        id: 5,
        timestamp: '14:30:45',
        batchId: '9918',
        title: 'Mağaza Stok Verisi Alındı',
        subtitle: 'SFTP üzerinden 14,8B stok kaydı',
        status: 'success',
        platform: 'erp'
    },
    {
        id: 6,
        timestamp: '14:25:10',
        batchId: '9917',
        title: 'Google Merchant Center Feed Yüklendi',
        subtitle: '42 mağazada 8,2B mağaza-SKU çifti',
        status: 'success',
        platform: 'google'
    },
    {
        id: 7,
        timestamp: '14:20:33',
        batchId: '9916',
        title: 'Mağaza Stok Verisi Alındı',
        subtitle: 'SFTP üzerinden 15B stok kaydı',
        status: 'success',
        platform: 'erp'
    },
];

export default function ActivityLog() {
    const [events, setEvents] = useState<TimelineEvent[]>(initialEvents);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
    const { t } = useTranslation();
    const oc = t.catalog as any;

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
                                title: 'Mağaza Stok Durumu Alındı',
                                subtitle: '42 mağaza envanter dosyası işlendi',
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
                ? { ...e, status: 'processing' as EventStatus, title: 'Bağlantı yeniden deneniyor...', subtitle: 'Yeniden bağlanılmaya çalışılıyor', progress: 0 }
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

    const getPlatformIcon = (platform?: 'google' | 'meta' | 'erp') => {
        switch (platform) {
            case 'google': return <SiGoogle className="w-3.5 h-3.5" />;
            case 'meta': return <SiMeta className="w-3.5 h-3.5" />;
            default: return <span className="text-xs font-bold">ERP</span>;
        }
    };

    return (
        <>
            <div className="vx-card">
                {/* Header */}
                <div className="vx-card-header">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-50"></div>
                        </div>
                        <h3 className="text-base font-semibold text-foreground">{oc?.activityFeed || 'Activity Feed'}</h3>
                        <div className="relative group">
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                                {oc?.activityFeedTooltip || 'Real-time local inventory sync events across all connected platforms.'}
                                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{oc?.activityFeedDesc || 'Ingestion and platform sync operations'}</p>
                </div>

                {/* Timeline Events */}
                <div className="vx-card-body vx-surface-muted">
                    <div className="p-6">
                        {events.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <Info className="w-5 h-5 text-gray-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">{oc?.noActivity || 'No activity in the last 24 hours'}</p>
                                <p className="text-xs text-gray-500 mt-1">{oc?.noActivityDesc || 'Sync events will appear here when they occur'}</p>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                {/* Events */}
                                <div className="space-y-4">
                                    {events.map((event) => (
                                        <div key={event.id} className="relative pl-12 group">
                                            {/* Timeline Dot */}
                                            <div className={`absolute left-3.5 top-4 w-3 h-3 rounded-full ${getStatusBg(event.status)} ring-4 ring-white`}></div>

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
                                                        {oc?.retry || 'Retry'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <BatchReportSheet
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                event={selectedEvent}
            />
        </>
    );
}
