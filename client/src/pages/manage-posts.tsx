import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Plus, Calendar, Globe, Smartphone, MoreVertical, Eye, Trash2, Edit, ChevronDown, Store, MapPin, Map } from 'lucide-react';

const mockPosts = [
  {
    id: 1,
    title: 'Summer Collection Launch',
    description: 'Discover our new summer collection with exclusive offers...',
    platforms: ['google', 'apple'],
    status: 'published',
    startDate: '2025-06-01',
    endDate: '2025-06-30',
    views: 1243,
  },
  {
    id: 2,
    title: 'Weekend Flash Sale',
    description: 'Get 30% off on all items this weekend only!',
    platforms: ['google'],
    status: 'scheduled',
    startDate: '2025-07-01',
    endDate: '2025-07-03',
    views: 0,
  },
  {
    id: 3,
    title: 'New Store Opening',
    description: 'Join us for the grand opening of our new location in Istanbul...',
    platforms: ['google', 'apple'],
    status: 'draft',
    startDate: '',
    endDate: '',
    views: 0,
  },
];

export default function ManagePosts() {
  const [posts] = useState(mockPosts);
  const [filter, setFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [, setLocation] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreatePost = (type: string) => {
    setDropdownOpen(false);
    setLocation(`/create-post?scope=${type}`);
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Published</span>;
      case 'scheduled':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Scheduled</span>;
      case 'draft':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900" data-testid="text-page-title">Manage Posts</h1>
              <p className="text-xs text-gray-500">View and manage all your business posts across platforms</p>
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Plus size={18} />
              Create New Post
              <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => handleCreatePost('store-set')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Store size={18} className="text-gray-500" />
                  <div>
                    <div className="font-medium">Store Set</div>
                    <div className="text-xs text-gray-400">Post to a predefined group</div>
                  </div>
                </button>
                <button
                  onClick={() => handleCreatePost('select-locations')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <MapPin size={18} className="text-gray-500" />
                  <div>
                    <div className="font-medium">Select Location(s)</div>
                    <div className="text-xs text-gray-400">Choose specific locations</div>
                  </div>
                </button>
                <button
                  onClick={() => handleCreatePost('all-locations')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Map size={18} className="text-gray-500" />
                  <div>
                    <div className="font-medium">All Locations</div>
                    <div className="text-xs text-gray-400">Post to every location</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 p-4">
            <div className="flex gap-2">
              {['all', 'published', 'scheduled', 'draft'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    filter === status
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredPosts.map((post) => (
              <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{post.title}</h3>
                      {getStatusBadge(post.status)}
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-1">{post.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        {post.platforms.includes('google') && (
                          <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded">
                            <Globe size={12} /> Google
                          </span>
                        )}
                        {post.platforms.includes('apple') && (
                          <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded ml-1">
                            <Smartphone size={12} /> Apple
                          </span>
                        )}
                      </div>
                      {post.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.startDate} - {post.endDate}
                        </span>
                      )}
                      {post.status === 'published' && (
                        <span className="flex items-center gap-1">
                          <Eye size={12} />
                          {post.views.toLocaleString()} views
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <p>No posts found with the selected filter.</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
