import { useState } from 'react';
import { Bell, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from '@/contexts/LanguageContext';
import { QUERY_KEYS } from '@/hooks/query-keys';
import { showToast } from '@/lib/toast';
import { apiRequest } from '@/lib/queryClient';
import type { AlertItem } from '@/lib/types/overview';
import type { OverviewFilterState } from '@/pages/overview';

interface AlertsPanelProps {
    alerts: AlertItem[];
    filters?: OverviewFilterState;
}

const severityConfig: Record<string, { icon: React.ReactNode; bg: string; border: string }> = {
    error: {
        icon: <XCircle className="w-4 h-4 text-red-500" />,
        bg: 'bg-red-50',
        border: 'border-red-100'
    },
    warning: {
        icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
        bg: 'bg-amber-50',
        border: 'border-amber-100'
    },
    info: {
        icon: <Info className="w-4 h-4 text-blue-500" />,
        bg: 'bg-blue-50',
        border: 'border-blue-100'
    }
};

function formatRelativeTime(timestamp: Date, en: boolean): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(timestamp).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return en ? 'Just now' : 'Az önce';
    if (diffMins < 60) return en ? `${diffMins}m ago` : `${diffMins}dk önce`;
    if (diffHours < 24) return en ? `${diffHours}h ago` : `${diffHours}sa önce`;
    return en ? `${diffDays}d ago` : `${diffDays}g önce`;
}

export default function AlertsPanel({ alerts, filters }: AlertsPanelProps) {
    const { t, language } = useTranslation();
    const db = t.dashboard as any;
    const en = language === 'en';
    const queryClient = useQueryClient();
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    const visibleAlerts = alerts.filter(a => !a.isRead && !dismissedIds.has(a.id));

    const handleDismiss = async (alertId: string) => {
        setDismissedIds(prev => new Set(prev).add(alertId));
        try {
            await apiRequest('DELETE', `/api/alerts/${alertId}`);
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OVERVIEW] });
            showToast({ type: 'success', title: db?.dismissAlert || 'Alert dismissed' });
        } catch {
            setDismissedIds(prev => {
                const next = new Set(prev);
                next.delete(alertId);
                return next;
            });
            showToast({ type: 'error', title: 'Failed to dismiss alert' });
        }
    };

    return (
        <div className="vx-card">
            <div className="vx-card-header">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-gray-500" />
                        <h3 className="text-sm font-semibold text-gray-900">{db?.alerts || 'Alerts & Issues'}</h3>
                        {visibleAlerts.length > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-red-500 rounded-full">
                                {visibleAlerts.length}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">{db?.alertsDesc || 'Active issues requiring attention'}</p>
                </div>
            </div>

            <div className="vx-card-body vx-surface-muted">
                {visibleAlerts.length === 0 ? (
                    <div className="text-center py-6 text-sm text-gray-400">
                        {db?.noAlerts || 'No active alerts'}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {visibleAlerts.map((alert) => {
                            const config = severityConfig[alert.type] || severityConfig.info;
                            return (
                                <div key={alert.id} className={`p-4 bg-white rounded-lg border ${config.border} shadow-sm`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`p-1.5 rounded-md ${config.bg} mt-0.5`}>
                                            {config.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 text-sm">{alert.title}</div>
                                            <p className="text-sm text-gray-500 mt-0.5">{alert.message}</p>
                                            <span className="text-xs text-gray-400 mt-1 block">{formatRelativeTime(alert.timestamp, en)}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDismiss(alert.id)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
                                            title={db?.dismissAlert || 'Dismiss'}
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
