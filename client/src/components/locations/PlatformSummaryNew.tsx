import { useState, useMemo } from "react";
import { ChevronRight, Info, Phone, Navigation, Eye, MousePointer, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SiGoogle, SiMeta, SiApple } from 'react-icons/si';
import { Tooltip } from "@/components/ui/tooltip";
import { mockLocations, calculateDataHealth, LocationData } from "@/lib/mock-locations";

// --- Types & Interfaces ---

type PlatformKey = 'google' | 'meta' | 'apple' | 'yandex';

interface PlatformStats {
    live: number;
    pending: number;
    suspended: number;
    action_required: number;
    rejected: number;
    not_connected: number;
    total_problems: number;
}

interface DashboardStats {
    dataQuality: number;
    totalLocations: number;
    businessStatus: {
        open: number;
        temporarilyClosed: number;
        closed: number;
    };
    platforms: Record<PlatformKey, PlatformStats>;
}

// --- Constants ---

const PLATFORMS: { key: PlatformKey | 'venuex'; name: string; icon: React.ReactNode }[] = [
    { key: 'venuex', name: 'VenueX', icon: <img src="https://venuex.io/wp-content/uploads/2023/09/favicon-150x150.png" alt="VenueX" className="w-4 h-4 object-contain" /> },
    { key: 'google', name: 'Google Business Profile', icon: <SiGoogle className="w-4 h-4" /> },
    { key: 'meta', name: 'Meta Business', icon: <SiMeta className="w-4 h-4" /> },
    { key: 'apple', name: 'Apple Business Connect', icon: <SiApple className="w-4 h-4" /> },
    { key: 'yandex', name: 'Yandex Maps', icon: <img src="https://yastatic.net/s3/home-static/_/nova/JSRBlH1m.png" alt="Yandex" className="w-4 h-4 object-contain" /> }
];

// --- Sub-Components ---



const PlatformTabButton = ({
    isActive,
    platform,
    problemCount,
    onClick
}: {
    isActive: boolean;
    platform: typeof PLATFORMS[0];
    problemCount: number;
    onClick: () => void;
}) => (
    <button
        role="tab"
        aria-selected={isActive}
        onClick={onClick}
        className={`relative -mb-px inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-all duration-200 focus:outline-none ${isActive
            ? 'text-emerald-600 border-emerald-500'
            : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
    >
        {platform.icon}
        {platform.name}
        {problemCount > 0 && platform.key !== 'venuex' && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-600">
                {problemCount}
            </span>
        )}
    </button>
);

const DataQualityCard = ({ score, isPlatformSpecific = false }: { score: number; isPlatformSpecific?: boolean }) => {
    const getColor = (s: number) => s >= 80 ? 'emerald' : s >= 60 ? 'amber' : 'rose';
    const color = getColor(score);
    const title = isPlatformSpecific ? 'Platform Sağlık Skoru' : 'Data Quality Index';
    const description = isPlatformSpecific
        ? 'Platform üzerindeki lokasyonlarınızın senkronizasyon ve yayınlanma başarısı.'
        : 'Harika! Veri kaliteniz yüksek.'; // Simplified for demo logic

    return (
        <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm text-center h-full">
            <div className="text-5xl font-bold text-gray-900 mb-2">{score}%</div>
            <div className="text-sm font-medium text-gray-600 mb-4">{title}</div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                    className={`h-full rounded-full transition-all duration-500 bg-${color}-500`}
                    style={{ width: `${score}%` }}
                />
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
                {description}
            </p>
            <button className={`text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center`}>
                Detayları gör <ChevronRight className="w-3 h-3 ml-1" />
            </button>
        </div>
    );
};

const MetricCard = ({ label, value, subLabel, icon }: { label: string; value: string | number; subLabel?: string; icon?: React.ReactNode }) => (
    <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm text-center h-full flex flex-col items-center justify-center">
        {icon && <div className="mb-2">{icon}</div>}
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {subLabel && <div className="text-xs text-gray-400 mt-1">{subLabel}</div>}
    </div>
);

const PlatformComparisonTable = ({ stats }: { stats: DashboardStats }) => (
    <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm col-span-2">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Platform Karşılaştırması</h4>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-2 px-2 text-xs font-medium text-gray-500">Platform</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-emerald-600">Live</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-sky-600">Pending</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-amber-600">Aksiyon</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-rose-600">Sorunlu</th>
                        <th className="text-center py-2 px-2 text-xs font-medium text-slate-400">Bağlı Değil</th>
                    </tr>
                </thead>
                <tbody>
                    {PLATFORMS.filter(p => p.key !== 'venuex').map((p) => {
                        const s = stats.platforms[p.key as PlatformKey];
                        return (
                            <tr key={p.key} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="py-2.5 px-2">
                                    <div className="flex items-center gap-2">
                                        {p.icon}
                                        <span className="font-medium text-gray-900">{p.name}</span>
                                    </div>
                                </td>
                                <td className="text-center py-2.5 px-2">
                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-xs">{s.live}</span>
                                </td>
                                <td className="text-center py-2.5 px-2">
                                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-50 text-sky-700 font-semibold text-xs">{s.pending}</span>
                                </td>
                                <td className="text-center py-2.5 px-2">
                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-semibold text-xs ${s.action_required > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-400'}`}>{s.action_required}</span>
                                </td>
                                <td className="text-center py-2.5 px-2">
                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-semibold text-xs ${(s.rejected + s.suspended) > 0 ? 'bg-rose-50 text-rose-700' : 'bg-gray-50 text-gray-400'}`}>{s.rejected + s.suspended}</span>
                                </td>
                                <td className="text-center py-2.5 px-2">
                                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-semibold text-xs ${s.not_connected > 0 ? 'bg-slate-100 text-slate-600' : 'bg-gray-50 text-gray-400'}`}>{s.not_connected}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </div>
);

const PlatformDetailedStats = ({ stats, platformName, platformKey }: { stats: PlatformStats; platformName: string; platformKey: string }) => {
    // Determine which cards to highlight based on filter
    const highlightProblem = false;

    // Only show engagement metrics for platforms that support it (Google & Apple)
    const showEngagement = !['meta', 'yandex'].includes(platformKey);

    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Health Score */}
            <DataQualityCard score={Math.round((stats.live / (stats.live + stats.pending + stats.total_problems + 1)) * 100)} isPlatformSpecific />

            {/* Live Status */}
            <div className={`p-6 bg-white rounded-lg border shadow-sm text-center h-full flex flex-col justify-center ${highlightProblem ? 'opacity-50 border-gray-100' : 'border-emerald-100'}`}>
                <div className="text-4xl font-bold text-emerald-600 mb-2">{stats.live}</div>
                <div className="text-sm font-medium text-gray-600">Yayında</div>
                <div className="text-xs text-gray-400 mt-1">Sorunsuz listeleniyor</div>
            </div>

            {/* Problem Status */}
            <div className={`p-6 bg-white rounded-lg border shadow-sm text-center h-full flex flex-col justify-center ${highlightProblem ? 'border-rose-300 ring-2 ring-rose-100' : 'border-gray-100'}`}>
                <div className="text-4xl font-bold text-rose-600 mb-2">{stats.total_problems + stats.action_required}</div>
                <div className="text-sm font-medium text-gray-600">İlgilenilmeli</div>
                <div className="flex justify-center gap-2 mt-2">
                    {stats.action_required > 0 && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">Action: {stats.action_required}</span>}
                    {stats.total_problems > 0 && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">Problem: {stats.total_problems}</span>}
                </div>
            </div>

            {/* Engagement Grid - Placeholder for specific metrics */}
            {showEngagement && (
                <div className="col-span-3 pt-6 border-t border-gray-200 mt-2">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-500">{platformName} Etkileşimleri (Son 30 Gün)</h4>
                    </div>
                    <div className="grid grid-cols-4 gap-6">
                        <MetricCard label="Görüntülenme" value="1,245" icon={<Eye className="w-5 h-5 text-blue-500" />} />
                        <MetricCard label="Telefon" value="84" icon={<Phone className="w-5 h-5 text-green-500" />} />
                        <MetricCard label="Yol Tarifi" value="126" icon={<Navigation className="w-5 h-5 text-purple-500" />} />
                        <MetricCard label="Web Tıklama" value="92" icon={<MousePointer className="w-5 h-5 text-orange-500" />} />
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

export function PlatformSummaryNew() {
    const [activeTab, setActiveTab] = useState(0);

    // Unified Data Calculation
    const stats: DashboardStats = useMemo(() => {
        // 1. Business Status Counts
        const businessStatus = {
            open: mockLocations.filter(l => l.businessStatus === 'open').length,
            temporarilyClosed: mockLocations.filter(l => l.businessStatus === 'temporarily_closed').length,
            closed: mockLocations.filter(l => l.businessStatus === 'closed').length
        };

        // 2. Data Quality
        const totalHealth = mockLocations.reduce((sum, location) => sum + calculateDataHealth(location), 0);
        const dataQuality = mockLocations.length > 0 ? Math.round(totalHealth / mockLocations.length) : 0;

        // 3. Platform Stats
        const platforms: Record<PlatformKey, PlatformStats> = {
            google: { live: 0, pending: 0, suspended: 0, action_required: 0, rejected: 0, not_connected: 0, total_problems: 0 },
            meta: { live: 0, pending: 0, suspended: 0, action_required: 0, rejected: 0, not_connected: 0, total_problems: 0 },
            apple: { live: 0, pending: 0, suspended: 0, action_required: 0, rejected: 0, not_connected: 0, total_problems: 0 },
            yandex: { live: 0, pending: 0, suspended: 0, action_required: 0, rejected: 0, not_connected: 0, total_problems: 0 }
        };

        mockLocations.forEach(loc => {
            (Object.keys(platforms) as PlatformKey[]).forEach(key => {
                const status = loc[key].status;
                const p = platforms[key];
                if (status === 'live') p.live++;
                else if (status === 'pending') p.pending++;
                else if (status === 'action_required') p.action_required++;
                else if (status === 'suspended') { p.suspended++; p.total_problems++; }
                else if (status === 'rejected') { p.rejected++; p.total_problems++; }
                else if (status === 'not_connected' || status === 'closed') p.not_connected++;
            });
        });

        // Add back action_required to total_problems for badge count if desired, or keep separate
        // Badge count usually includes action_required + problems
        (Object.keys(platforms) as PlatformKey[]).forEach(key => {
            platforms[key].total_problems += platforms[key].action_required;
        });

        return {
            dataQuality,
            totalLocations: mockLocations.length,
            businessStatus,
            platforms
        };
    }, []);

    const activePlatform = PLATFORMS[activeTab];
    const activePlatformStats = activePlatform.key !== 'venuex' ? stats.platforms[activePlatform.key as PlatformKey] : null;
    const totalProblems = Object.values(stats.platforms).reduce((sum, p) => sum + p.total_problems, 0);


    return (
        <div className="mx-6 mb-6 bg-white rounded-md border border-slate-200 overflow-hidden shadow-none">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-gradient-to-b from-white to-stone-50">
                <h3 className="text-base font-semibold text-foreground">Platform Summary</h3>
                <nav className="inline-flex items-center gap-6" role="tablist">
                    {PLATFORMS.map((platform, index) => (
                        <PlatformTabButton
                            key={platform.key}
                            isActive={activeTab === index}
                            platform={platform}
                            problemCount={platform.key !== 'venuex' ? stats.platforms[platform.key as PlatformKey].total_problems : 0}
                            onClick={() => setActiveTab(index)}
                        />
                    ))}
                </nav>
            </div>

            {/* Content Body */}
            <div className="p-6 bg-stone-50">

                {activePlatform.key === 'venuex' ? (
                    // --- VenueX Dashboard View ---
                    <>
                        <div className="grid grid-cols-3 gap-6">
                            <DataQualityCard score={stats.dataQuality} />
                            <PlatformComparisonTable stats={stats} />
                        </div>
                        {/* Store Status Row */}
                        <div className="grid grid-cols-4 gap-4 mt-6">
                            <MetricCard label="Toplam Lokasyon" value={stats.totalLocations} />
                            <div className="p-4 bg-white rounded-lg border border-emerald-100 shadow-sm text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="text-3xl font-bold text-emerald-600">{stats.businessStatus.open}</span>
                                </div>
                                <div className="text-sm font-medium text-gray-600">Açık</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-amber-100 shadow-sm text-center">
                                <div className="text-3xl font-bold text-amber-600 mb-1">{stats.businessStatus.temporarilyClosed}</div>
                                <div className="text-sm font-medium text-gray-600">Geçici Kapalı</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-rose-100 shadow-sm text-center">
                                <div className="text-3xl font-bold text-rose-600 mb-1">{stats.businessStatus.closed}</div>
                                <div className="text-sm font-medium text-gray-600">Kalıcı Kapalı</div>
                            </div>
                        </div>
                    </>
                ) : (
                    // --- Specific Platform Dashboard View ---
                    activePlatformStats && (
                        <>
                            <PlatformDetailedStats
                                stats={activePlatformStats}
                                platformName={activePlatform.name}
                                platformKey={activePlatform.key}
                            />
                        </>
                    )
                )}
            </div>
        </div>
    );
}

export default PlatformSummaryNew;
