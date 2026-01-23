import { Zap } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

export default function DataFlowStatus() {
    const getStatusColor = (status: 'connected' | 'disconnected' | 'warning') => {
        switch (status) {
            case 'connected': return 'bg-green-500';
            case 'warning': return 'bg-yellow-500';
            case 'disconnected': return 'bg-red-500';
        }
    };

    // Mock pipeline status
    const erpStatus = 'connected' as const;
    const googleStatus = 'connected' as const;
    const metaStatus = 'connected' as const;

    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Veri Akışı Durumu</h3>

            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 overflow-hidden">
                {/* ERP Node */}
                <div className="flex items-center gap-3 flex-shrink-0 z-10">
                    <div className="relative">
                        <div className={`w-3 h-3 ${getStatusColor(erpStatus)} rounded-full`}></div>
                        {erpStatus === 'connected' && (
                            <div className={`absolute inset-0 w-3 h-3 ${getStatusColor(erpStatus)} rounded-full animate-ping opacity-50`}></div>
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">ERP / GMC Source</p>
                        <p className="text-xs text-gray-500">2 dk önce senkronize oldu</p>
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
                        <p className="text-xs text-blue-600 font-medium">124.5K ürün işlendi</p>
                    </div>
                </div>

                {/* Connector 2 */}
                <div className="flex-1 mx-4 h-0.5 bg-gray-200 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 w-full h-full">
                        <div className="h-full w-1/2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-flow-contained"></div>
                    </div>
                </div>

                {/* Platform Nodes */}
                <div className="flex flex-col gap-2 flex-shrink-0 z-10">
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                        <div className={`w-2 h-2 ${getStatusColor(googleStatus)} rounded-full`}></div>
                        <SiGoogle className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-600">Google LIA</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                        <div className={`w-2 h-2 ${getStatusColor(metaStatus)} rounded-full`}></div>
                        <SiMeta className="w-4 h-4 text-gray-600" />
                        <span className="text-xs font-medium text-gray-600">Meta Commerce</span>
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
