import LocationStatusTable from '@/components/locations/LocationStatusTable';

export default function Components() {
  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Component Development</h1>
        <p className="text-sm text-gray-500 mt-1">Test and preview components in isolation</p>
      </div>

      <div className="space-y-8">
        {/* LocationStatusTable Preview */}
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">LocationStatusTable</h2>
            <p className="text-sm text-gray-500">Platform activity, sync status, and warning indicators</p>
          </div>
          <LocationStatusTable />
        </section>
      </div>
    </div>
  );
}
