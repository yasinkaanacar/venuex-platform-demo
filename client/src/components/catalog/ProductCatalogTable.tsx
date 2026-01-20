import { useState, useMemo } from 'react';
import { SiGoogle, SiMeta } from 'react-icons/si';
import {
    Search,
    Filter,
    RefreshCw,
    Download,
    ChevronDown,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Clock,
    Package,
    Store,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip } from '@mui/material';

// Types
type PlatformStatus = 'live' | 'pending' | 'error' | 'not_synced';
type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

interface ProductItem {
    id: string;
    sku: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    stockStatus: StockStatus;
    storeCode: string;
    storeName: string;
    googleStatus: PlatformStatus;
    metaStatus: PlatformStatus;
    lastUpdated: string;
    gtin?: string;
    imageUrl?: string;
}

// Mock Data
const mockProducts: ProductItem[] = [
    {
        id: '1',
        sku: 'SKU-001',
        name: 'Nike Air Max 270',
        category: 'Ayakkabı',
        price: 2499,
        stock: 45,
        stockStatus: 'in_stock',
        storeCode: 'IST-001',
        storeName: 'Kanyon AVM',
        googleStatus: 'live',
        metaStatus: 'live',
        lastUpdated: '2 dk önce',
        gtin: '1234567890123',
        imageUrl: 'https://example.com/img1.jpg'
    },
    {
        id: '2',
        sku: 'SKU-002',
        name: 'Adidas Ultraboost 22',
        category: 'Ayakkabı',
        price: 3299,
        stock: 12,
        stockStatus: 'low_stock',
        storeCode: 'IST-002',
        storeName: 'Zorlu Center',
        googleStatus: 'live',
        metaStatus: 'pending',
        lastUpdated: '5 dk önce',
        gtin: '1234567890124'
    },
    {
        id: '3',
        sku: 'SKU-003',
        name: 'Puma RS-X',
        category: 'Ayakkabı',
        price: 1899,
        stock: 0,
        stockStatus: 'out_of_stock',
        storeCode: 'ANK-001',
        storeName: 'Ankamall',
        googleStatus: 'error',
        metaStatus: 'live',
        lastUpdated: '15 dk önce',
        gtin: '1234567890125'
    },
    {
        id: '4',
        sku: 'SKU-004',
        name: 'New Balance 574',
        category: 'Ayakkabı',
        price: 2199,
        stock: 78,
        stockStatus: 'in_stock',
        storeCode: 'IST-003',
        storeName: 'İstinye Park',
        googleStatus: 'live',
        metaStatus: 'live',
        lastUpdated: '1 dk önce'
    },
    {
        id: '5',
        sku: 'SKU-005',
        name: 'Converse Chuck 70',
        category: 'Ayakkabı',
        price: 1299,
        stock: 5,
        stockStatus: 'low_stock',
        storeCode: 'IZM-001',
        storeName: 'Forum Bornova',
        googleStatus: 'pending',
        metaStatus: 'not_synced',
        lastUpdated: '30 dk önce'
    },
    {
        id: '6',
        sku: 'SKU-006',
        name: 'Vans Old Skool',
        category: 'Ayakkabı',
        price: 1499,
        stock: 0,
        stockStatus: 'out_of_stock',
        storeCode: 'IST-001',
        storeName: 'Kanyon AVM',
        googleStatus: 'live',
        metaStatus: 'error',
        lastUpdated: '10 dk önce'
    },
    {
        id: '7',
        sku: 'SKU-007',
        name: 'Reebok Classic',
        category: 'Ayakkabı',
        price: 1799,
        stock: 34,
        stockStatus: 'in_stock',
        storeCode: 'ANK-002',
        storeName: 'Armada AVM',
        googleStatus: 'live',
        metaStatus: 'live',
        lastUpdated: '3 dk önce',
        gtin: '1234567890128'
    },
    {
        id: '8',
        sku: 'SKU-008',
        name: 'Asics Gel-Kayano',
        category: 'Ayakkabı',
        price: 2899,
        stock: 8,
        stockStatus: 'low_stock',
        storeCode: 'IST-002',
        storeName: 'Zorlu Center',
        googleStatus: 'live',
        metaStatus: 'pending',
        lastUpdated: '7 dk önce'
    }
];

// Helper functions
const getStockStatusConfig = (status: StockStatus) => {
    switch (status) {
        case 'in_stock':
            return { label: 'Stokta', color: 'bg-green-100 text-green-700', icon: CheckCircle2 };
        case 'low_stock':
            return { label: 'Düşük Stok', color: 'bg-yellow-100 text-yellow-700', icon: AlertTriangle };
        case 'out_of_stock':
            return { label: 'Tükendi', color: 'bg-red-100 text-red-700', icon: XCircle };
    }
};

const getPlatformStatusConfig = (status: PlatformStatus) => {
    switch (status) {
        case 'live':
            return { label: 'Live', color: 'text-green-600', bgColor: 'bg-green-50', icon: CheckCircle2 };
        case 'pending':
            return { label: 'Pending', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: Clock };
        case 'error':
            return { label: 'Error', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle };
        case 'not_synced':
            return { label: 'Not Synced', color: 'text-gray-400', bgColor: 'bg-gray-50', icon: Clock };
    }
};

// Platform Status Badge Component
function PlatformStatusBadge({ status, platform }: { status: PlatformStatus; platform: 'google' | 'meta' }) {
    const config = getPlatformStatusConfig(status);
    const Icon = config.icon;
    const PlatformIcon = platform === 'google' ? SiGoogle : SiMeta;

    return (
        <Tooltip title={`${platform === 'google' ? 'Google' : 'Meta'}: ${config.label}`} arrow>
            <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${config.bgColor} cursor-default`}>
                <PlatformIcon className={`w-3 h-3 ${config.color}`} />
                <Icon className={`w-3 h-3 ${config.color}`} />
            </div>
        </Tooltip>
    );
}

// Main Component
export default function ProductCatalogTable() {
    const [searchQuery, setSearchQuery] = useState('');
    const [stockFilter, setStockFilter] = useState<StockStatus | 'all'>('all');
    const [platformFilter, setPlatformFilter] = useState<'all' | 'google' | 'meta'>('all');
    const [statusFilter, setStatusFilter] = useState<PlatformStatus | 'all'>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Filtered products
    const filteredProducts = useMemo(() => {
        return mockProducts.filter(product => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    product.sku.toLowerCase().includes(query) ||
                    product.name.toLowerCase().includes(query) ||
                    product.storeCode.toLowerCase().includes(query) ||
                    product.storeName.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Stock filter
            if (stockFilter !== 'all' && product.stockStatus !== stockFilter) {
                return false;
            }

            // Platform status filter
            if (statusFilter !== 'all') {
                if (platformFilter === 'google' && product.googleStatus !== statusFilter) return false;
                if (platformFilter === 'meta' && product.metaStatus !== statusFilter) return false;
                if (platformFilter === 'all' && product.googleStatus !== statusFilter && product.metaStatus !== statusFilter) return false;
            }

            return true;
        });
    }, [searchQuery, stockFilter, platformFilter, statusFilter]);

    // Stats
    const stats = useMemo(() => {
        const total = mockProducts.length;
        const inStock = mockProducts.filter(p => p.stockStatus === 'in_stock').length;
        const lowStock = mockProducts.filter(p => p.stockStatus === 'low_stock').length;
        const outOfStock = mockProducts.filter(p => p.stockStatus === 'out_of_stock').length;
        const synced = mockProducts.filter(p => p.googleStatus === 'live' && p.metaStatus === 'live').length;
        const errors = mockProducts.filter(p => p.googleStatus === 'error' || p.metaStatus === 'error').length;

        return { total, inStock, lowStock, outOfStock, synced, errors };
    }, []);

    // Selection handlers
    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStockFilter('all');
        setPlatformFilter('all');
        setStatusFilter('all');
    };

    const hasActiveFilters = searchQuery || stockFilter !== 'all' || platformFilter !== 'all' || statusFilter !== 'all';

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h2 className="text-base font-semibold text-gray-900">Ürün Kataloğu</h2>
                        <div className="relative group">
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                Platform bazında ürün sync durumlarını görüntüleyin
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5">
                            <Download className="w-4 h-4" />
                            Export
                        </Button>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                            <RefreshCw className="w-4 h-4" />
                            Sync All
                        </Button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 mt-3 text-xs">
                    <span className="text-gray-500"><span className="font-semibold text-gray-900">{stats.total}</span> toplam ürün</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-green-600"><span className="font-semibold">{stats.synced}</span> senkron</span>
                    <span className="text-yellow-600"><span className="font-semibold">{stats.lowStock}</span> düşük stok</span>
                    <span className="text-red-600"><span className="font-semibold">{stats.errors}</span> hata</span>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="SKU, ürün adı veya mağaza ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 text-sm"
                    />
                </div>

                {/* Stock Filter */}
                <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as StockStatus | 'all')}>
                    <SelectTrigger className="w-[140px] h-9">
                        <div className="flex items-center gap-2">
                            <Package className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-sm">{stockFilter === 'all' ? 'Stok Durumu' : getStockStatusConfig(stockFilter as StockStatus).label}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="in_stock">Stokta</SelectItem>
                        <SelectItem value="low_stock">Düşük Stok</SelectItem>
                        <SelectItem value="out_of_stock">Tükendi</SelectItem>
                    </SelectContent>
                </Select>

                {/* Platform Filter */}
                <Select value={platformFilter} onValueChange={(v) => setPlatformFilter(v as 'all' | 'google' | 'meta')}>
                    <SelectTrigger className="w-[130px] h-9">
                        <div className="flex items-center gap-2">
                            <Filter className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-sm">{platformFilter === 'all' ? 'Platform' : platformFilter === 'google' ? 'Google' : 'Meta'}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="meta">Meta</SelectItem>
                    </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PlatformStatus | 'all')}>
                    <SelectTrigger className="w-[130px] h-9">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-sm">{statusFilter === 'all' ? 'Sync Status' : getPlatformStatusConfig(statusFilter as PlatformStatus).label}</span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tümü</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="not_synced">Not Synced</SelectItem>
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 px-2 text-gray-500 hover:text-red-500">
                        Temizle
                    </Button>
                )}

                <div className="ml-auto text-xs text-gray-500">
                    <span className="font-medium text-gray-900">{filteredProducts.length}</span> / {mockProducts.length} ürün
                </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className="px-5 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-3">
                    <span className="text-sm text-blue-700 font-medium">{selectedIds.size} ürün seçildi</span>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Sync Selected</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs">Export Selected</Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())} className="h-7 text-xs text-gray-500">
                        İptal
                    </Button>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="w-10 px-4 py-3">
                                <Checkbox
                                    checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">SKU</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ürün</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Mağaza</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Fiyat</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stok</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Google</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Meta</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Güncelleme</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => {
                            const stockConfig = getStockStatusConfig(product.stockStatus);
                            const StockIcon = stockConfig.icon;

                            return (
                                <tr
                                    key={product.id}
                                    className={`hover:bg-gray-50 transition-colors ${selectedIds.has(product.id) ? 'bg-blue-50/50' : ''}`}
                                >
                                    <td className="px-4 py-3">
                                        <Checkbox
                                            checked={selectedIds.has(product.id)}
                                            onCheckedChange={() => toggleSelect(product.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-sm font-mono text-gray-600">{product.sku}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-500">{product.category}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <Store className="w-3.5 h-3.5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-900">{product.storeName}</p>
                                                <p className="text-xs text-gray-500">{product.storeCode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="text-sm font-medium text-gray-900">₺{product.price.toLocaleString()}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${stockConfig.color}`}>
                                                <StockIcon className="w-3 h-3" />
                                                {product.stock}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <PlatformStatusBadge status={product.googleStatus} platform="google" />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <PlatformStatusBadge status={product.metaStatus} platform="meta" />
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="text-xs text-gray-500">{product.lastUpdated}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
                <div className="px-5 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Filtrelerinize uygun ürün bulunamadı</p>
                    <Button variant="link" onClick={clearFilters} className="mt-2">
                        Filtreleri temizle
                    </Button>
                </div>
            )}

            {/* Pagination placeholder */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>1-{filteredProducts.length} / {mockProducts.length} ürün gösteriliyor</span>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled className="h-7">Önceki</Button>
                    <Button variant="outline" size="sm" disabled className="h-7">Sonraki</Button>
                </div>
            </div>
        </div>
    );
}
