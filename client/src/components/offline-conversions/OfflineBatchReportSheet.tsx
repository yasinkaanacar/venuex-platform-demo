import { X, Download, ChevronRight } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';
import { Store, Database } from 'lucide-react';
import { useLocales } from '@/lib/formatters';

type Platform = 'google' | 'meta' | 'tiktok' | 'crm' | 'pos';

interface ErrorItem {
    id: string;
    platform: 'google' | 'meta' | 'tiktok';
    errorType: string;
    errorCode: string;
    count: number;
}

interface BatchReportSheetProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        batchId: string;
        platform?: Platform;
        status?: string;
        title?: string;
        subtitle?: string;
    } | null;
}

// Generate batch-specific mock errors based on batchId and platform
function getErrorsForBatch(batchId: string, platform?: Platform): ErrorItem[] {
    const seed = parseInt(batchId, 10) || 9920;

    const errorsByPlatform: Record<string, ErrorItem[]> = {
        google: [
            { id: 'e1', platform: 'google', errorType: 'GCLID Eksik', errorCode: 'missing_gclid', count: 20 + (seed % 40) },
            { id: 'e2', platform: 'google', errorType: 'Geçersiz Dönüşüm Zamanı', errorCode: 'invalid_timestamp', count: 10 + (seed % 25) },
            { id: 'e3', platform: 'google', errorType: 'Yinelenen Giriş', errorCode: 'duplicate_conversion', count: 5 + (seed % 15) },
        ],
        meta: [
            { id: 'e1', platform: 'meta', errorType: 'Kullanıcı Verisi Eksik', errorCode: 'missing_user_data', count: 15 + (seed % 30) },
            { id: 'e2', platform: 'meta', errorType: 'Tekilleştirme Kimliği Çakışması', errorCode: 'duplicate_event_id', count: 8 + (seed % 20) },
            { id: 'e3', platform: 'meta', errorType: 'Geçersiz Etkinlik Adı', errorCode: 'invalid_event', count: 3 + (seed % 10) },
        ],
        tiktok: [
            { id: 'e1', platform: 'tiktok', errorType: 'Erişim Jetonu Süresi Doldu', errorCode: 'invalid_token', count: 25 + (seed % 35) },
            { id: 'e2', platform: 'tiktok', errorType: 'Dönüşüm Zamanı Formatı', errorCode: 'invalid_timestamp', count: 12 + (seed % 20) },
        ],
    };

    if (platform && errorsByPlatform[platform]) {
        return errorsByPlatform[platform];
    }

    // Mixed errors for non-platform-specific batches
    return [
        { id: 'e1', platform: 'google', errorType: 'GCLID Eksik', errorCode: 'missing_gclid', count: 20 + (seed % 40) },
        { id: 'e2', platform: 'meta', errorType: 'Kullanıcı Verisi Eksik', errorCode: 'missing_user_data', count: 15 + (seed % 25) },
        { id: 'e3', platform: 'tiktok', errorType: 'Dönüşüm Zamanı Formatı', errorCode: 'invalid_timestamp', count: 8 + (seed % 15) },
    ];
}

function getTotalForBatch(batchId: string): number {
    const seed = parseInt(batchId, 10) || 9920;
    return 50000 + (seed * 13) % 100000;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'google': return <SiGoogle className="w-4 h-4 text-red-600" />;
        case 'tiktok': return <SiTiktok className="w-4 h-4 text-black" />;
        case 'meta': return <SiMeta className="w-4 h-4 text-blue-600" />;
        default: return <Database className="w-4 h-4 text-gray-500" />;
    }
};

export default function OfflineBatchReportSheet({ isOpen, onClose, event }: BatchReportSheetProps) {
    const { t } = useLocales();
    const oc = (key: string) => t(`offlineConversions.${key}`);
    if (!isOpen || !event) return null;

    const errors = getErrorsForBatch(event.batchId, event.platform);
    const totalCount = getTotalForBatch(event.batchId);
    const issueCount = errors.reduce((sum, e) => sum + e.count, 0);
    const successCount = totalCount - issueCount;
    const isSuccess = event.status === 'success';

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />

            {/* Drawer Panel */}
            <div className="fixed right-0 top-0 h-full w-[600px] max-w-[90vw] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="vx-card-header py-5">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Yükleme Paketi #{event.batchId}</h2>
                            <span className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                                isSuccess
                                    ? 'bg-green-100 text-green-700'
                                    : event.status === 'error'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-amber-100 text-amber-700'
                            }`}>
                                {isSuccess ? 'Başarıyla Tamamlandı' : event.status === 'error' ? 'Başarısız' : oc('completedWithIssues')}
                            </span>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors -mr-2 -mt-1">
                            <X className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    {/* Summary Metrics */}
                    <div className="flex items-center gap-6 text-sm">
                        <div>
                            <span className="text-slate-500">Toplam: </span>
                            <span className="font-medium text-slate-700">{totalCount.toLocaleString('tr-TR')}</span>
                        </div>
                        <div>
                            <span className="text-slate-500">Başarılı: </span>
                            <span className="font-medium text-green-600">{successCount.toLocaleString('tr-TR')}</span>
                        </div>
                        <div>
                            <span className="text-slate-500">Sorunlar: </span>
                            <span className="font-bold text-red-600">{issueCount.toLocaleString('tr-TR')}</span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {issueCount > 0 ? (
                        <>
                            <p className="text-sm text-slate-500 mb-4">
                                {issueCount} öğe yüklenemedi. Hata türüne göre gruplandırıldı:
                            </p>
                            <div className="space-y-0">
                                {errors.map((error) => (
                                    <div key={error.id} className="flex items-center gap-4 py-4 border-b border-gray-100 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <PlatformIcon platform={error.platform} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-800">{error.errorType}</p>
                                            <p className="text-xs font-mono text-slate-400">Hata: {error.errorCode}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <span className="inline-block px-2.5 py-1 bg-gray-100 text-slate-700 text-xs font-medium rounded-full">
                                                {error.count} dönüşüm
                                            </span>
                                        </div>
                                        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium flex-shrink-0">
                                            Önizleme <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Store className="w-6 h-6 text-green-600" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">Tüm dönüşümler başarıyla yüklendi</p>
                            <p className="text-xs text-slate-500 mt-1">{totalCount.toLocaleString('tr-TR')} dönüşüm işlendi</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {issueCount > 0 && (
                    <div className="vx-card-header">
                        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-slate-700 font-medium rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
                            <Download className="w-4 h-4" />
                            {oc('downloadErrorReport')}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
