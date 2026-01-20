import PipelineStatus from '@/components/catalog/PipelineStatus';
import LiveActivitySidebar from '@/components/catalog/LiveActivitySidebar';
import ProductCatalogTable from '@/components/catalog/ProductCatalogTable';
import InventorySummary from '@/components/catalog/InventorySummary';

export default function Catalog() {
  return (
    <div className="flex min-h-full bg-gray-50">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Pipeline Header */}
        <div className="p-6 pb-4">
          <PipelineStatus
            erpStatus="connected"
            erpLastSync="2 min ago"
            erpLatency={24}
            processedCount={124500}
            avgProcessingTime={1.2}
            googleStatus="connected"
            metaStatus="connected"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 px-6 pb-6 overflow-auto space-y-6">
          {/* Summary Section */}
          <InventorySummary />

          {/* Product Catalog Table */}
          <ProductCatalogTable />
        </div>
      </div>

      {/* Always-visible Activity Sidebar */}
      <LiveActivitySidebar />
    </div>
  );
}
