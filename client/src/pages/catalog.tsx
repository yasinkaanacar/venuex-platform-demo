import { Package, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export default function Catalog() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">Local Inventory</h1>
            <p className="text-xs text-gray-500">Manage your product catalog and sync inventory</p>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Local Inventory</h2>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Manage your product catalog and sync inventory across all your locations and platforms.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Coming Soon</span>
            </div>
            <div className="text-lg font-semibold text-gray-900">This feature is under development</div>
          </div>
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Back to Dashboard <ArrowRight size={16} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
