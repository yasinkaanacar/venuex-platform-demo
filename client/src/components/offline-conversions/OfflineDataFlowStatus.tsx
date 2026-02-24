import { Zap } from 'lucide-react';
import { SiGoogle, SiMeta, SiTiktok } from 'react-icons/si';

export default function OfflineDataFlowStatus() {
    const getStatusColor = (status: 'connected' | 'disconnected' | 'warning') => {
        switch (status) {
            case 'connected': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'disconnected': return 'bg-red-500';
        }
    };

    // Mock pipeline status for offline conversions
    const posStatus = 'connected' as const;
    const googleStatus = 'connected' as const;
    const metaStatus = 'connected' as const;
    const tiktokStatus = 'warning' as const;

    return (
        <div className="vx-card shadow-sm">
            <div className="vx-card-header">
                <h3 className="text-sm font-semibold text-gray-700">Data Connection Status</h3>
            </div>

            <div className="vx-card-body space-y-5">
                <div className="flex items-center justify-between vx-surface-muted rounded-lg p-4 overflow-hidden">
                    {/* POS / Store Data Node */}
                    <div className="flex items-center gap-3 flex-shrink-0 z-10">
                        <div className="relative">
                            <div className={`w-3 h-3 ${getStatusColor(posStatus)} rounded-full`}></div>
                            {posStatus === 'connected' && (
                                <div className={`absolute inset-0 w-3 h-3 ${getStatusColor(posStatus)} rounded-full animate-ping opacity-50`}></div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">POS / Store Data</p>
                            <p className="text-xs text-gray-500">Synced 5 min ago</p>
                        </div>
                    </div>

                    {/* Connector 1 */}
                    <div className="flex-1 mx-4 h-0.5 bg-gray-200 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 w-full h-full">
                            <div className="h-full w-1/2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-flow-contained"></div>
                        </div>
                    </div>

                    {/* VenueX Node */}
                    <div className="flex items-center gap-3 flex-shrink-0 z-10">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">VenueX Engine</p>
                        </div>
                    </div>

                    {/* Connector 2 */}
                    <div className="flex-1 mx-4 h-0.5 bg-gray-200 rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 w-full h-full">
                            <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-flow-contained"></div>
                        </div>
                    </div>

                    {/* Platform Nodes - Ad Platforms */}
                    <div className="flex flex-col gap-2 flex-shrink-0 z-10">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <div className={`w-2 h-2 ${getStatusColor(googleStatus)} rounded-full`}></div>
                            <SiGoogle className="w-4 h-4 text-gray-600" />
                            <span className="text-xs font-medium text-gray-600">Google Ads</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <div className={`w-2 h-2 ${getStatusColor(metaStatus)} rounded-full`}></div>
                            <SiMeta className="w-4 h-4 text-gray-600" />
                            <span className="text-xs font-medium text-gray-600">Meta Ads</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <div className={`w-2 h-2 ${getStatusColor(tiktokStatus)} rounded-full`}></div>
                            <SiTiktok className="w-4 h-4 text-gray-600" />
                            <span className="text-xs font-medium text-gray-600">TikTok Ads</span>
                        </div>
                    </div>
                </div>

                {/* Last Upload Details */}
                <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Upload</h4>
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded-full border border-green-100">
                            Success
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                            store-sales-2026-01-21-09-00-51.csv
                        </span>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Upload Date</p>
                            <p className="text-sm font-medium text-gray-900">21.02.2026 - 14:30</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Conversions</p>
                            <p className="text-sm font-medium text-gray-900">154 Units</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Avg. Basket</p>
                            <p className="text-sm font-medium text-gray-900">1.250,00 ₺</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Total Sales</p>
                            <p className="text-sm font-medium text-gray-900">192.500,00 ₺</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <div className="flex items-center gap-1.5 text-green-600">
                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium">Completed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes flow-contained {
                  0% { transform: translateX(-100%); }
                  100% { transform: translateX(200%); }
                }
                .animate-flow-contained {
                  animation: flow-contained 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
