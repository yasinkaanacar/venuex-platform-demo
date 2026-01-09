import PipelineStatus from '@/components/catalog/PipelineStatus';

const mockBatchActivity = [
  { id: 1, batchId: '992', platform: 'meta' as const, items: 5000, status: 'success' as const, duration: '1.2s', timestamp: '2 min ago' },
  { id: 2, batchId: '991', platform: 'google' as const, items: 12500, status: 'success' as const, duration: '3.4s', timestamp: '15 min ago' },
  { id: 3, batchId: '990', platform: 'meta' as const, items: 3200, status: 'partial' as const, duration: '2.1s', timestamp: '32 min ago', errors: 12 },
  { id: 4, batchId: '989', platform: 'google' as const, items: 8700, status: 'success' as const, duration: '2.8s', timestamp: '1 hr ago' },
];

export default function Catalog() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Local Inventory</h1>
      
      <PipelineStatus 
        erpStatus="connected"
        erpLastSync="2 min ago"
        erpLatency={24}
        processedCount={124500}
        avgProcessingTime={1.2}
        googleStatus="connected"
        metaStatus="connected"
        batchActivity={mockBatchActivity}
      />
    </div>
  );
}
