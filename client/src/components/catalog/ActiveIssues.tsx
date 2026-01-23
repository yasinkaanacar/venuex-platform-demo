import { AlertCircle, ChevronRight, ArrowRight } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

const ISSUES = [
    {
        id: 1,
        type: 'critical',
        title: 'Store Code Mismatch',
        count: 45,
        platform: 'google',
        description: 'Local inventory ads feed refers to a store code that is not verified in your Business Profile.'
    },
    {
        id: 2,
        type: 'warning',
        title: 'Price Mismatch',
        count: 32,
        platform: 'meta',
        description: 'Product price in the feed matches the landing page but contradicts the checkout price.'
    },
    {
        id: 3,
        type: 'warning',
        title: 'Missing GTIN',
        count: 28,
        platform: 'google',
        description: 'Products classified as "Brand Name" must have a GTIN assigned.'
    }
];

export default function ActiveIssues() {
    return (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-semibold text-gray-700">Aktif Sorunlar</h3>
                </div>
                <span className="text-xs text-gray-500">Çözüm bekleyen 3 başlık</span>
            </div>

            <div className="divide-y divide-gray-50">
                {ISSUES.map((issue) => (
                    <div key={issue.id} className="p-4 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-start gap-3">
                                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${issue.type === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                                    }`} />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-medium text-gray-900">{issue.title}</h4>
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                                            {issue.platform === 'google' ? <SiGoogle className="w-3 h-3" /> : <SiMeta className="w-3 h-3" />}
                                            {issue.platform === 'google' ? 'Google' : 'Meta'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 max-w-xl">{issue.description}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-900">{issue.count}</div>
                                    <div className="text-[10px] text-gray-500">etkilenen ürün</div>
                                </div>
                                <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded-md hover:border-blue-300 hover:text-blue-600 transition-all flex items-center gap-1">
                                    Çöz
                                    <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-center">
                <button className="text-xs font-medium text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1 mx-auto transition-colors">
                    Tüm geçmiş sorunları gör
                    <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
}
