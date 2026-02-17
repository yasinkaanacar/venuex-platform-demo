import { useState } from 'react';
import {
    CheckCircle,
    AlertTriangle,
    Clock,
    ArrowRight,
    RefreshCw,
    FileText,
    Calendar,
    Server,
    Globe,
    Database,
    HardDrive
} from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import vxLogo from '@assets/vx-logo-1000x1000_1756824361260.png';

interface DataSource {
    id: string;
    name: string;
    type: 'gcs' | 'api' | 'sftp';
    status: 'connected' | 'syncing' | 'warning' | 'error';
    serverUrl: string;
    filePath?: string;
    fileRegex?: string;
    schedule: string;
    timezone: string;
    lastSync: string;
    fileSize: string;
    recordCount: string;
}

interface Destination {
    id: string;
    name: string;
    type: 'google' | 'meta' | 'tiktok';
    icon: any;
    iconColor: string;
    status: 'active' | 'syncing' | 'warning' | 'error';
    lastUpload: string;
    eventsUploaded: string;
    matchRate: string;
    nextScheduled: string;
}

const dataSources: DataSource[] = [
    {
        id: 'gcs-sales',
        name: 'Sales Data (GCS)',
        type: 'gcs',
        status: 'connected',
        serverUrl: 'gs://client-data-bucket',
        filePath: '/exports/sales/',
        fileRegex: 'store-sales-*.csv',
        schedule: 'Daily @ 02:00',
        timezone: 'GMT+03:00 Istanbul',
        lastSync: '2 min ago',
        fileSize: '847 MB',
        recordCount: '1.2M rows'
    },
    {
        id: 'api-crm',
        name: 'CRM API Endpoint',
        type: 'api',
        status: 'syncing',
        serverUrl: 'https://api.client-crm.com/v2',
        filePath: '/exports/customers',
        schedule: 'Every 15 min',
        timezone: 'GMT+03:00 Istanbul',
        lastSync: 'Syncing...',
        fileSize: '234 MB',
        recordCount: '458K records'
    }
];

const destinations: Destination[] = [
    {
        id: 'google',
        name: 'Google Ads',
        type: 'google',
        icon: SiGoogle,
        iconColor: 'text-red-500',
        status: 'active',
        lastUpload: '5 min ago',
        eventsUploaded: '125,420',
        matchRate: '78%',
        nextScheduled: 'In 10 min'
    },
    {
        id: 'meta',
        name: 'Meta CAPI',
        type: 'meta',
        icon: SiMeta,
        iconColor: 'text-blue-600',
        status: 'active',
        lastUpload: '8 min ago',
        eventsUploaded: '98,350',
        matchRate: '82%',
        nextScheduled: 'In 7 min'
    },
    {
        id: 'tiktok',
        name: 'TikTok Events',
        type: 'tiktok',
        icon: SiTiktok,
        iconColor: 'text-black',
        status: 'warning',
        lastUpload: '45 min ago',
        eventsUploaded: '34,120',
        matchRate: '65%',
        nextScheduled: 'Paused'
    }
];

const venuexStats = {
    totalEventsProcessed: '2.4M',
    todayEventsProcessed: '127K',
    avgProcessingTime: '1.2s',
    uptime: '99.98%'
};

export default function DataPipelineStatus() {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected':
            case 'active':
                return 'bg-green-500';
            case 'syncing':
                return 'bg-blue-500 animate-pulse';
            case 'warning':
                return 'bg-yellow-500';
            case 'error':
                return 'bg-red-500';
            default:
                return 'bg-gray-400';
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'connected':
            case 'active':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3" /> Active
                    </span>
                );
            case 'syncing':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Syncing
                    </span>
                );
            case 'warning':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <AlertTriangle className="w-3 h-3" /> Warning
                    </span>
                );
            case 'error':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <AlertTriangle className="w-3 h-3" /> Error
                    </span>
                );
            default:
                return null;
        }
    };

    const getSourceTypeIcon = (type: string) => {
        switch (type) {
            case 'gcs':
                return <HardDrive className="w-4 h-4 text-gray-600" />;
            case 'api':
                return <Globe className="w-4 h-4 text-gray-600" />;
            case 'sftp':
                return <Server className="w-4 h-4 text-gray-600" />;
            default:
                return <Database className="w-4 h-4 text-gray-600" />;
        }
    };

    const getSourceTypeBadge = (type: string) => {
        switch (type) {
            case 'gcs':
                return <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-semibold rounded">GCS</span>;
            case 'api':
                return <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-semibold rounded">API</span>;
            case 'sftp':
                return <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-semibold rounded">SFTP</span>;
            default:
                return null;
        }
    };

    return (
        <div className="vx-card shadow-sm">
            {/* Header */}
            <div className="vx-card-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-200 rounded-lg">
                            <Server className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Data Pipeline Status</h3>
                            <p className="text-xs text-gray-500">Real-time conversion data flow</p>
                        </div>
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Pipeline Visualization */}
            <div className="vx-card-body">
                <div className="flex items-stretch gap-4">
                    {/* Sources Column */}
                    <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Database className="w-3.5 h-3.5" />
                            Data Sources
                        </div>
                        <div className="space-y-3">
                            {dataSources.map((source) => (
                                <div
                                    key={source.id}
                                    className="relative p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                                >
                                    {/* Status Indicator */}
                                    <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${getStatusColor(source.status)}`} />

                                    <div className="space-y-3">
                                        {/* Header */}
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                {getSourceTypeIcon(source.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-gray-900 text-sm">{source.name}</h4>
                                                    {getSourceTypeBadge(source.type)}
                                                </div>
                                                <p className="text-xs text-gray-500 font-mono truncate">{source.serverUrl}</p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="pl-11 space-y-1">
                                            {source.filePath && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="text-gray-400">Path:</span>
                                                    <span className="font-mono">{source.filePath}</span>
                                                </div>
                                            )}
                                            {source.fileRegex && (
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="text-gray-400">Pattern:</span>
                                                    <span className="font-mono text-gray-600">{source.fileRegex}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                <span>{source.schedule}</span>
                                                <span className="text-gray-300">|</span>
                                                <span>{source.timezone}</span>
                                            </div>
                                        </div>

                                        {/* Stats Row */}
                                        <div className="pl-11 flex items-center gap-4 pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {source.lastSync}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <FileText className="w-3 h-3" />
                                                {source.fileSize}
                                            </div>
                                            <div className="text-xs font-medium text-gray-700">
                                                {source.recordCount}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center justify-center px-2">
                        <div className="w-px h-8 bg-gray-200" />
                        <ArrowRight className="w-5 h-5 text-gray-400 my-2" />
                        <div className="w-px h-8 bg-gray-200" />
                    </div>

                    {/* VenueX Hub */}
                    <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Server className="w-3.5 h-3.5" />
                            Processing Hub
                        </div>
                        <div className="relative p-5 bg-white rounded-xl border-2 border-gray-300">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-3 border border-gray-200">
                                    <img src={vxLogo} alt="VenueX" className="w-10 h-10" />
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg mb-1">VenueX Engine</h4>
                                <p className="text-xs text-gray-500 mb-4">Attribution & Processing</p>

                                <div className="grid grid-cols-2 gap-3 w-full">
                                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="text-lg font-bold text-gray-900">{venuexStats.todayEventsProcessed}</div>
                                        <div className="text-[10px] text-gray-500">Events Today</div>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="text-lg font-bold text-green-600">{venuexStats.avgProcessingTime}</div>
                                        <div className="text-[10px] text-gray-500">Avg. Latency</div>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="text-lg font-bold text-gray-900">{venuexStats.totalEventsProcessed}</div>
                                        <div className="text-[10px] text-gray-500">Total Processed</div>
                                    </div>
                                    <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="text-lg font-bold text-green-600">{venuexStats.uptime}</div>
                                        <div className="text-[10px] text-gray-500">Uptime</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex flex-col items-center justify-center px-2">
                        <div className="w-px h-8 bg-gray-200" />
                        <ArrowRight className="w-5 h-5 text-gray-400 my-2" />
                        <div className="w-px h-8 bg-gray-200" />
                    </div>

                    {/* Destinations Column */}
                    <div className="flex-1">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5" />
                            Destinations
                        </div>
                        <div className="space-y-3">
                            {destinations.map((dest) => {
                                const Icon = dest.icon;
                                return (
                                    <div
                                        key={dest.id}
                                        className="relative p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                                    >
                                        {/* Status Indicator */}
                                        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${getStatusColor(dest.status)}`} />

                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <Icon className={`w-5 h-5 ${dest.iconColor}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-semibold text-gray-900 text-sm">{dest.name}</h4>
                                                </div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getStatusBadge(dest.status)}
                                                </div>
                                                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {dest.lastUpload}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {dest.nextScheduled}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs font-medium text-gray-700">{dest.eventsUploaded} events</span>
                                                    <span className={`text-xs font-bold ${parseFloat(dest.matchRate) >= 75 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {dest.matchRate} match
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
