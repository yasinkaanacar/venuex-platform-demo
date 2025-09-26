import Header from '@/components/overview/header';
import { Target } from 'lucide-react';

export default function LocationMatch() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Location Match" />
      
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Target className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Location Matching Tool
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Debug and validate location matching algorithms for Boyner stores
          </p>
        </div>
      </div>
    </div>
  );
}