import { useState } from 'react';
import { ArrowUpDown, Package, Download, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';
import { FaApple } from 'react-icons/fa';
import { showToast } from '@/lib/toast';

// Product performance interface
interface ProductPerformance {
    id: string;
    sku: string;
    name: string;
    category: string;
    thumbnail: string;
    channels: {
        google: { impressions: number; clicks: number; conversions: number; revenue: number; } | null;
        meta: { impressions: number; clicks: number; conversions: number; revenue: number; } | null;
        apple: { impressions: number; clicks: number; conversions: number; revenue: number; } | null;
    };
    totalRevenue: number;
    totalConversions: number;
    stock: number;
    trend: number; // percentage change
}

// Mock data for best performing products
const mockProducts: ProductPerformance[] = [
    {
        id: '1',
        sku: 'DEN-001',
        name: 'Classic Denim Jacket',
        category: 'Outerwear',
        thumbnail: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=80&h=80&fit=crop',
        channels: {
            google: { impressions: 125000, clicks: 8500, conversions: 420, revenue: 168000 },
            meta: { impressions: 98000, clicks: 6200, conversions: 310, revenue: 124000 },
            apple: { impressions: 45000, clicks: 2800, conversions: 140, revenue: 56000 },
        },
        totalRevenue: 348000,
        totalConversions: 870,
        stock: 245,
        trend: 12.5,
    },
    {
        id: '2',
        sku: 'TSH-042',
        name: 'Premium Cotton T-Shirt',
        category: 'Tops',
        thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop',
        channels: {
            google: { impressions: 180000, clicks: 12000, conversions: 580, revenue: 116000 },
            meta: { impressions: 156000, clicks: 9800, conversions: 490, revenue: 98000 },
            apple: null,
        },
        totalRevenue: 214000,
        totalConversions: 1070,
        stock: 892,
        trend: 8.3,
    },
    {
        id: '3',
        sku: 'SNK-015',
        name: 'Urban Runner Sneakers',
        category: 'Footwear',
        thumbnail: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop',
        channels: {
            google: { impressions: 95000, clicks: 7200, conversions: 320, revenue: 256000 },
            meta: { impressions: 72000, clicks: 4800, conversions: 210, revenue: 168000 },
            apple: { impressions: 38000, clicks: 2100, conversions: 95, revenue: 76000 },
        },
        totalRevenue: 500000,
        totalConversions: 625,
        stock: 156,
        trend: 18.7,
    },
    {
        id: '4',
        sku: 'DRS-028',
        name: 'Elegant Evening Dress',
        category: 'Dresses',
        thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=80&h=80&fit=crop',
        channels: {
            google: { impressions: 68000, clicks: 4500, conversions: 180, revenue: 270000 },
            meta: { impressions: 112000, clicks: 8200, conversions: 340, revenue: 510000 },
            apple: null,
        },
        totalRevenue: 780000,
        totalConversions: 520,
        stock: 78,
        trend: -3.2,
    },
    {
        id: '5',
        sku: 'ACC-089',
        name: 'Leather Crossbody Bag',
        category: 'Accessories',
        thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=80&h=80&fit=crop',
        channels: {
            google: { impressions: 52000, clicks: 3800, conversions: 145, revenue: 188500 },
            meta: { impressions: 89000, clicks: 6100, conversions: 280, revenue: 364000 },
            apple: { impressions: 28000, clicks: 1600, conversions: 72, revenue: 93600 },
        },
        totalRevenue: 646100,
        totalConversions: 497,
        stock: 124,
        trend: 22.4,
    },
    {
        id: '6',
        sku: 'JNS-033',
        name: 'Slim Fit Chinos',
        category: 'Pants',
        thumbnail: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=80&h=80&fit=crop',
        channels: {
            google: { impressions: 142000, clicks: 9800, conversions: 420, revenue: 126000 },
            meta: { impressions: 98000, clicks: 5900, conversions: 265, revenue: 79500 },
            apple: null,
        },
        totalRevenue: 205500,
        totalConversions: 685,
        stock: 567,
        trend: 5.1,
    },
    {
        id: '7',
        sku: 'OUT-007',
        name: 'Winter Puffer Jacket',
        category: 'Outerwear',
        thumbnail: 'https://images.unsplash.com/photo-1544923246-77307dd628b7?w=80&h=80&fit=crop',
        channels: {
            google: { impressions: 78000, clicks: 5400, conversions: 195, revenue: 351000 },
            meta: { impressions: 65000, clicks: 3900, conversions: 142, revenue: 255600 },
            apple: { impressions: 32000, clicks: 1800, conversions: 68, revenue: 122400 },
        },
        totalRevenue: 729000,
        totalConversions: 405,
        stock: 89,
        trend: 31.2,
    },
    {
        id: '8',
        sku: 'SHR-019',
        name: 'Casual Linen Shirt',
        category: 'Tops',
        thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80&h=80&fit=crop',
        channels: {
            google: { impressions: 88000, clicks: 6100, conversions: 275, revenue: 68750 },
            meta: { impressions: 72000, clicks: 4800, conversions: 218, revenue: 54500 },
            apple: null,
        },
        totalRevenue: 123250,
        totalConversions: 493,
        stock: 423,
        trend: -1.8,
    },
];

const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
        return `₺${(amount / 1000000).toFixed(1)}M`;
    }
    return `₺${(amount / 1000).toFixed(0)}K`;
};

const formatNumber = (num: number) => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString('tr-TR');
};

type SortColumn = 'name' | 'totalRevenue' | 'totalConversions' | 'stock' | 'trend';

export default function BestPerformingProducts() {
    const [sortColumn, setSortColumn] = useState<SortColumn>('totalRevenue');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [selectedChannel, setSelectedChannel] = useState<'all' | 'google' | 'meta' | 'apple'>('all');

    const handleSort = (column: SortColumn) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc');
        }
    };

    const handleExport = () => {
        showToast({
            type: 'info',
            title: 'Export Started',
            description: 'Product performance report is being generated...'
        });
    };

    // Sort products
    const sortedProducts = [...mockProducts].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
            return sortDirection === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        }

        return 0;
    });

    const getChannelIcon = (channel: 'google' | 'meta' | 'apple') => {
        switch (channel) {
            case 'google':
                return <div className="w-5 h-5 bg-[#EA4335] rounded flex items-center justify-center"><SiGoogle className="w-2.5 h-2.5 text-white" /></div>;
            case 'meta':
                return <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center"><span className="text-[10px] text-white font-bold">f</span></div>;
            case 'apple':
                return <div className="w-5 h-5 bg-black rounded flex items-center justify-center"><FaApple className="w-2.5 h-2.5 text-white" /></div>;
        }
    };

    const SortableHeader = ({ column, children, align = 'right' }: { column: SortColumn; children: React.ReactNode; align?: 'left' | 'right' | 'center' }) => (
        <th
            className={`px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap ${align === 'left' ? 'text-left' : align === 'center' ? 'text-center' : 'text-right'}`}
            onClick={() => handleSort(column)}
        >
            <div className={`flex items-center gap-1 ${align === 'left' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end'}`}>
                {children}
                <ArrowUpDown className={`w-3 h-3 ${sortColumn === column ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
        </th>
    );

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-b from-white to-stone-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-gray-700" />
                        <h3 className="text-base font-semibold text-gray-900">En İyi Performans Gösteren Ürünler</h3>
                        <div className="relative group">
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[9999]">
                                Kanal bazında ürün performans metrikleri
                                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Channel Filter */}
                        <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                            <button
                                onClick={() => setSelectedChannel('all')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${selectedChannel === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Tümü
                            </button>
                            <button
                                onClick={() => setSelectedChannel('google')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${selectedChannel === 'google'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {getChannelIcon('google')}
                                Google
                            </button>
                            <button
                                onClick={() => setSelectedChannel('meta')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${selectedChannel === 'meta'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {getChannelIcon('meta')}
                                Meta
                            </button>
                            <button
                                onClick={() => setSelectedChannel('apple')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${selectedChannel === 'apple'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {getChannelIcon('apple')}
                                Apple
                            </button>
                        </div>

                        {/* Export Button */}
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Platformlar arası ürün performansı ve satış metrikleri</p>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <SortableHeader column="name" align="left">Ürün</SortableHeader>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">Kanallar</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Gösterimler</th>
                            <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Tıklamalar</th>
                            <SortableHeader column="totalConversions">Dönüşümler</SortableHeader>
                            <SortableHeader column="totalRevenue">Gelir</SortableHeader>
                            <SortableHeader column="stock">Stok</SortableHeader>
                            <SortableHeader column="trend">Trend</SortableHeader>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedProducts.map((product) => {
                            // Calculate channel-specific metrics
                            const channelData = selectedChannel === 'all'
                                ? {
                                    impressions: (product.channels.google?.impressions || 0) + (product.channels.meta?.impressions || 0) + (product.channels.apple?.impressions || 0),
                                    clicks: (product.channels.google?.clicks || 0) + (product.channels.meta?.clicks || 0) + (product.channels.apple?.clicks || 0),
                                    conversions: product.totalConversions,
                                    revenue: product.totalRevenue,
                                }
                                : product.channels[selectedChannel] || { impressions: 0, clicks: 0, conversions: 0, revenue: 0 };

                            const activeChannels = [
                                product.channels.google ? 'google' : null,
                                product.channels.meta ? 'meta' : null,
                                product.channels.apple ? 'apple' : null,
                            ].filter(Boolean) as ('google' | 'meta' | 'apple')[];

                            return (
                                <tr
                                    key={product.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.sku} • {product.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center gap-1">
                                            {activeChannels.map((channel) => (
                                                <div key={channel} className="opacity-100">
                                                    {getChannelIcon(channel)}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm text-gray-600">
                                        {formatNumber(channelData.impressions)}
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm text-gray-600">
                                        {formatNumber(channelData.clicks)}
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                                        {formatNumber(channelData.conversions)}
                                    </td>
                                    <td className="px-4 py-4 text-right text-sm font-medium text-blue-600">
                                        {formatCurrency(channelData.revenue)}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${product.stock < 100 ? 'bg-red-50 text-red-600' : product.stock < 200 ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                                            }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className={`flex items-center justify-end gap-1 text-sm font-medium ${product.trend >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {product.trend >= 0 ? (
                                                <TrendingUp className="w-3.5 h-3.5" />
                                            ) : (
                                                <TrendingDown className="w-3.5 h-3.5" />
                                            )}
                                            {product.trend >= 0 ? '+' : ''}{product.trend}%
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                    {sortedProducts.length} ürün gösteriliyor
                </span>
                <span className="text-xs text-gray-400">
                    Son güncelleme: Bugün 14:32
                </span>
            </div>
        </div>
    );
}
