import { ChevronRight } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

export default function PlatformHealthCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Google Card */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <SiGoogle className="w-5 h-5 text-gray-700" />
                        <h3 className="text-sm font-semibold text-gray-700">Google Merchant Center</h3>
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        Connected
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">124,880</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Kabul Edilen
                            </div>
                        </div>
                        <div className="p-3 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">120</div>
                            <div className="text-xs text-red-600/80 mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Reddedilen
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-2 py-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group">
                        Sorunları İncele
                        <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Meta Card */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <SiMeta className="w-5 h-5 text-gray-700" />
                        <h3 className="text-sm font-semibold text-gray-700">Meta Commerce</h3>
                    </div>
                    <div className="px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                        Connected
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-gray-900">124,620</div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Kabul Edilen
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">380</div>
                            <div className="text-xs text-yellow-700/80 mt-1 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                Sorunlu
                            </div>
                        </div>
                    </div>

                    <button className="w-full mt-2 py-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group">
                        Sorunları İncele
                        <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}
