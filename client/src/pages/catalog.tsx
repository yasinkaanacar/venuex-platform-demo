import { Package, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function Catalog() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Local Inventory</h1>
        <p className="text-gray-500 mb-6">
          Manage your product catalog and sync inventory across all your locations and platforms.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="text-sm text-gray-500 mb-2">Coming Soon</div>
          <div className="text-lg font-semibold text-gray-900">This feature is under development</div>
        </div>
        <Link href="/">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Back to Dashboard <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  );
}
