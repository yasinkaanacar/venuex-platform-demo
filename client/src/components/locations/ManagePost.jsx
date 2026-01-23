import React, { useState } from 'react';
import { 
  Calendar, 
  Eye, 
  MousePointer, 
  MoreHorizontal, 
  Copy, 
  Trash2, 
  ExternalLink,
  Search,
  Filter
} from 'lucide-react';

// --- MOCK DATA (Veritabanından gelecek veriyi simüle ediyoruz) ---
const MOCK_POSTS = [
  {
    id: 1,
    title: "Yaz Sezonu İndirimi",
    description: "Tüm yaz ürünlerinde %50'ye varan indirimler başladı! Stoklarla sınırlıdır.",
    image: "https://images.unsplash.com/photo-1555529771-835f59fc5efe?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    status: "LIVE", // LIVE, SCHEDULED, ENDED
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    platforms: {
      google: { status: 'published', views: 1240, clicks: 85 },
      apple: { status: 'published' } // Apple'da detaylı stat yok
    }
  },
  {
    id: 2,
    title: "Yeni Menü Tadımı",
    description: "Şefimizin özel hazırladığı yeni tadım menüsü bu hafta sonu sizi bekliyor.",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    status: "SCHEDULED",
    startDate: "2025-11-10",
    endDate: "2025-11-12",
    platforms: {
      google: { status: 'scheduled', views: 0, clicks: 0 },
      apple: { status: 'scheduled' }
    }
  },
  {
    id: 3,
    title: "Hafta Sonu Etkinliği",
    description: "Canlı müzik eşliğinde harika bir akşam yemeği.",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    status: "ENDED",
    startDate: "2025-01-15",
    endDate: "2025-01-20",
    platforms: {
      google: { status: 'published', views: 540, clicks: 22 },
      apple: { status: 'rejected' } // Hata örneği
    }
  }
];

const PostArchive = () => {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, LIVE, SCHEDULED, ENDED
  const [searchTerm, setSearchTerm] = useState('');

  // Status Badge Helper
  const getStatusColor = (status) => {
    switch(status) {
      case 'published': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  // Filter Logic
  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesTab = activeTab === 'ALL' || post.status === activeTab;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Post History</h1>
            <p className="text-gray-500 text-sm">Manage and track your Google & Apple updates.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center gap-2">
            <span>+ Create New Post</span>
          </button>
        </div>

        {/* CONTROLS & FILTERS */}
        <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {['ALL', 'LIVE', 'SCHEDULED', 'ENDED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* TABLE LIST */}
        <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="p-4 w-[40%]">Content Info</th>
                <th className="p-4 text-center">Platforms</th>
                <th className="p-4">Schedule</th>
                <th className="p-4 text-center">Performance (Google)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition group">

                  {/* Content Info */}
                  <td className="p-4">
                    <div className="flex gap-4 items-start">
                      <img src={post.image} alt={post.title} className="w-16 h-12 object-cover rounded-md border border-gray-200" />
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{post.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{post.description}</p>
                      </div>
                    </div>
                  </td>

                  {/* Platforms Status */}
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      {/* Google Badge */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(post.platforms.google.status)}`}>
                        <span className="font-bold">G</span>
                        <span className="capitalize hidden xl:inline">{post.platforms.google.status}</span>
                      </div>

                      {/* Apple Badge */}
                      {post.platforms.apple ? (
                         <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getStatusColor(post.platforms.apple.status)}`}>
                           <span className="font-bold">A</span>
                           <span className="capitalize hidden xl:inline">{post.platforms.apple.status}</span>
                         </div>
                      ) : (
                        <div className="px-2 py-1 text-xs text-gray-300">N/A</div>
                      )}
                    </div>
                  </td>

                  {/* Schedule */}
                  <td className="p-4">
                    <div className="text-sm text-gray-700 flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <Calendar size={14} />
                        <span>{post.startDate}</span>
                      </div>
                      <span className="text-xs text-gray-400 pl-6">to {post.endDate}</span>
                    </div>
                  </td>

                  {/* Stats (Google Only) */}
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-4 text-sm">
                       <div className="flex items-center gap-1 text-gray-600" title="Views">
                          <Eye size={16} className="text-blue-400" />
                          <span className="font-semibold">{post.platforms.google.views}</span>
                       </div>
                       <div className="flex items-center gap-1 text-gray-600" title="Clicks">
                          <MousePointer size={16} className="text-green-500" />
                          <span className="font-semibold">{post.platforms.google.clicks}</span>
                       </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition" title="Repost / Clone">
                        <Copy size={18} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 text-gray-500 rounded-lg transition" title="View Live">
                        <ExternalLink size={18} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {filteredPosts.length === 0 && (
                 <tr>
                    <td colSpan="5" className="p-12 text-center text-gray-400">
                       No posts found matching your criteria.
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION (Simple Visual) */}
        <div className="flex justify-between items-center mt-4 px-2">
            <span className="text-sm text-gray-500">Showing {filteredPosts.length} results</span>
            <div className="flex gap-2">
                <button className="px-3 py-1 border rounded text-sm text-gray-500 disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border rounded text-sm text-gray-700 hover:bg-gray-50">Next</button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PostArchive;