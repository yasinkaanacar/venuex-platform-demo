import LocationStatusTable from '@/components/locations/LocationStatusTable';
import PlatformSummaryNew from '@/components/locations/PlatformSummaryNew';


interface ComponentSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function ComponentSection({ title, description, children }: ComponentSectionProps) {
  return (
    <section className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <div className="p-4">
        {children}
      </div>
    </section>
  );
}

export default function Components() {
  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Component Development</h1>
        <p className="text-sm text-gray-500 mt-1">Test and preview components in isolation</p>
      </div>

      <div className="space-y-6">
        <ComponentSection
          title="Platform Summary New"
          description="Status checks & platform performance (New)"
        >
          <PlatformSummaryNew />
        </ComponentSection>

        <ComponentSection
          title="LocationStatusTable"
          description="Platform activity, sync status, and warning indicators"
        >
          <LocationStatusTable />
        </ComponentSection>
      </div>
    </div>
  );
}
