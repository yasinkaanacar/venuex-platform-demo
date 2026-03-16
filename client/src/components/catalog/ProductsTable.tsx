import { useState, useMemo } from 'react';
import { Search, Info, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableEmptyState } from '@/components/shared/table-states';
import type { CatalogProduct, FeedFreshness, PlatformPublishStatus } from '@/lib/types/catalog';

interface ProductsTableProps {
  products: CatalogProduct[];
}

type PlatformFilter = 'all' | 'google_issues' | 'meta_issues' | 'any_issues';
type AvailabilityFilter = 'all' | 'full_coverage' | 'partial' | 'low';

function getPlatformBadge(status: PlatformPublishStatus, letter: string) {
  const styles: Record<PlatformPublishStatus, string> = {
    published: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    not_submitted: 'bg-gray-100 text-gray-500 border-gray-200',
  };
  const icons: Record<PlatformPublishStatus, string> = {
    published: '✓',
    rejected: '✗',
    pending: '!',
    not_submitted: '—',
  };
  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border ${styles[status]}`}>
      {letter} {icons[status]}
    </span>
  );
}

function getFreshnessBadge(freshness: FeedFreshness) {
  const config: Record<FeedFreshness, { dot: string; label: string }> = {
    fresh: { dot: 'bg-green-500', label: 'Fresh' },
    degraded: { dot: 'bg-amber-500', label: 'Degraded' },
    stale: { dot: 'bg-red-500', label: 'Stale' },
  };
  const c = config[freshness];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-600">
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function getCoveragePercent(product: CatalogProduct) {
  return (product.storeCoverage.available / product.storeCoverage.total) * 100;
}

function getCoverageColor(percent: number) {
  if (percent >= 90) return 'bg-green-500';
  if (percent >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('all');

  const filtered = useMemo(() => {
    let result = products;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }

    if (platformFilter !== 'all') {
      result = result.filter((p) => {
        if (platformFilter === 'google_issues') return p.platforms.google !== 'published';
        if (platformFilter === 'meta_issues') return p.platforms.meta !== 'published';
        return p.platforms.google !== 'published' || p.platforms.meta !== 'published';
      });
    }

    if (availabilityFilter !== 'all') {
      result = result.filter((p) => {
        const pct = getCoveragePercent(p);
        if (availabilityFilter === 'full_coverage') return pct >= 95;
        if (availabilityFilter === 'partial') return pct >= 50 && pct < 95;
        return pct < 50;
      });
    }

    return result;
  }, [products, search, platformFilter, availabilityFilter]);

  return (
    <div className="vx-card">
      <div className="vx-card-header">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-foreground">Products</h3>
          <div className="relative group">
            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-72 z-[9999]">
              Read-only view of products from your ERP feed. Store coverage, availability, and platform publish status are aggregated across all stores.
              <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Aggregated product status across all stores and platforms</p>
      </div>

      <div className="vx-card-body vx-surface-muted space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as PlatformFilter)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Platforms</option>
            <option value="google_issues">Google Issues</option>
            <option value="meta_issues">Meta Issues</option>
            <option value="any_issues">Any Issues</option>
          </select>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityFilter)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="all">All Availability</option>
            <option value="full_coverage">Full Coverage (95%+)</option>
            <option value="partial">Partial (50-95%)</option>
            <option value="low">Low (&lt;50%)</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-xs font-medium text-gray-500">Product</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Store Coverage</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Availability</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Platforms</TableHead>
                <TableHead className="text-xs font-medium text-gray-500">Freshness</TableHead>
                <TableHead className="text-xs font-medium text-gray-500 italic text-teal-600">Labels (P2)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableEmptyState
                  colSpan={6}
                  icon={<Package className="w-8 h-8 text-gray-300" />}
                  title="No products match your filters"
                />
              ) : (
                filtered.map((product) => {
                  const coveragePct = getCoveragePercent(product);
                  const coverageColor = getCoverageColor(coveragePct);

                  return (
                    <TableRow key={product.id} className="hover:bg-gray-50/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-md bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-[11px] text-gray-500 font-mono">{product.sku} · {product.category}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-semibold text-gray-900">
                          {product.storeCoverage.available}/{product.storeCoverage.total}
                        </div>
                        <div className="w-14 h-1 bg-gray-200 rounded-full mt-1">
                          <div
                            className={`h-full rounded-full ${coverageColor}`}
                            style={{ width: `${coveragePct}%` }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-[11px]">
                          {product.availabilityBreakdown.inStock > 0 && (
                            <span className="text-green-600">{product.availabilityBreakdown.inStock} in stock</span>
                          )}
                          {product.availabilityBreakdown.outOfStock > 0 && (
                            <span className="text-red-600">{product.availabilityBreakdown.outOfStock} OOS</span>
                          )}
                          {product.availabilityBreakdown.limited > 0 && (
                            <span className="text-amber-600">{product.availabilityBreakdown.limited} limited</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getPlatformBadge(product.platforms.google, 'G')}
                          {getPlatformBadge(product.platforms.meta, 'M')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getFreshnessBadge(product.feedFreshness)}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-400 italic">—</span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          {filtered.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 text-center text-[11px] text-gray-500 bg-gray-50/50">
              Showing {filtered.length} of {products.length.toLocaleString('tr-TR')} products
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
