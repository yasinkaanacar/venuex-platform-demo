import { Info } from 'lucide-react';
import DataFlowStatus from './DataFlowStatus';
import PlatformHealthCards from './PlatformHealthCards';
import ActiveIssues from './ActiveIssues';

export default function SummaryTab() {
    return (
        <div className="bg-white rounded-md border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-b from-white to-stone-50">
                <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-semibold text-foreground">Özet</h3>
                    <div className="relative group">
                        <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                            Lokal envanter verisinin platformlara akış durumunu gösterir.
                            <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Stok durumu, veri akışı ve platform sağlığına genel bakış</p>
            </div>

            {/* Content */}
            <div className="p-6 bg-stone-50 space-y-6">
                {/* 1. Veri Akışı Durumu */}
                <DataFlowStatus />

                {/* 2. Platform Kabul & 3. Aktif Sorunlar */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <PlatformHealthCards />
                    <ActiveIssues />
                </div>
            </div>
        </div>
    );
}
