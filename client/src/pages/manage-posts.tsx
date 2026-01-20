import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  Plus, Calendar, Globe, Smartphone, Eye, Trash2, Edit, ChevronDown,
  Store, MapPin, Map, ChevronLeft, ChevronRight, List, LayoutGrid,
  ThumbsUp, Sparkles, Clock
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';

const mockPosts = [
  {
    id: 1,
    title: 'Summer Collection Launch',
    description: 'Discover our new summer collection with exclusive offers...',
    platforms: ['google', 'apple'],
    status: 'published',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    time: '10:15',
    views: 1243,
    likes: 45,
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=120&h=120&fit=crop',
  },
  {
    id: 2,
    title: 'Weekend Flash Sale',
    description: 'Get 30% off on all items this weekend only!',
    platforms: ['google'],
    status: 'scheduled',
    startDate: addDays(new Date(), 1),
    endDate: addDays(new Date(), 3),
    time: '16:00',
    views: 0,
    likes: 0,
    thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=120&h=120&fit=crop',
  },
  {
    id: 3,
    title: 'New Store Opening',
    description: 'Join us for the grand opening of our new location...',
    platforms: ['google', 'apple'],
    status: 'scheduled',
    startDate: addDays(new Date(), 2),
    endDate: addDays(new Date(), 2),
    time: '16:00',
    views: 0,
    likes: 0,
    thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=120&fit=crop',
  },
  {
    id: 4,
    title: 'Holiday Special Promo',
    description: 'Exclusive holiday discounts for our loyal customers...',
    platforms: ['apple'],
    status: 'scheduled',
    startDate: addDays(new Date(), 2),
    endDate: addDays(new Date(), 5),
    time: '09:00',
    views: 0,
    likes: 0,
    thumbnail: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=120&h=120&fit=crop',
  },
  {
    id: 5,
    title: 'Spring Collection Preview',
    description: 'Be the first to see our upcoming spring styles...',
    platforms: ['google'],
    status: 'draft',
    startDate: addDays(new Date(), -2),
    endDate: addDays(new Date(), -1),
    time: '14:30',
    views: 892,
    likes: 32,
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=120&h=120&fit=crop',
  },
];

export default function ManagePosts() {
  const [posts] = useState(mockPosts);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [contentTypeOpen, setContentTypeOpen] = useState(false);
  const [contentType, setContentType] = useState('All Content');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [, setLocation] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentTypeRef = useRef<HTMLDivElement>(null);
  const dayMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (contentTypeRef.current && !contentTypeRef.current.contains(event.target as Node)) {
        setContentTypeOpen(false);
      }
      if (dayMenuRef.current && !dayMenuRef.current.contains(event.target as Node)) {
        setSelectedDay(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreatePost = (type: string, date?: Date) => {
    setDropdownOpen(false);
    setSelectedDay(null);
    const dateParam = date ? `&date=${format(date, 'yyyy-MM-dd')}` : '';
    setLocation(`/create-post?scope=${type}${dateParam}`);
  };

  const handleDayClick = (day: Date) => {
    if (selectedDay && isSameDay(selectedDay, day)) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  };

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const goToPrevWeek = () => {
    setCurrentWeekStart(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeekStart(prev => addWeeks(prev, 1));
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const today = new Date();

  const getPostsForDay = (date: Date) => {
    return posts.filter(post => {
      if (!post.startDate) return false;
      return isSameDay(post.startDate, date);
    });
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

  const getDayName = (date: Date) => {
    return format(date, 'EEE');
  };

  const getDayNumber = (date: Date) => {
    return format(date, 'd');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header handled globally */}

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6 justify-end">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                data-testid="button-list-view"
              >
                <List size={16} />
                List
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                data-testid="button-calendar-view"
              >
                <LayoutGrid size={16} />
                Calendar
              </button>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                data-testid="button-create-post"
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
                    data-testid="button-store-set"
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
                    data-testid="button-select-locations"
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
                    data-testid="button-all-locations"
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
          {viewMode === 'calendar' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={goToPrevWeek}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                      data-testid="button-prev-week"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={goToToday}
                      className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      data-testid="button-today"
                    >
                      Today
                    </button>
                    <button
                      onClick={goToNextWeek}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                      data-testid="button-next-week"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900" data-testid="text-month-year">
                    {format(currentWeekStart, 'MMMM yyyy')}
                  </h2>

                  <div className="relative" ref={contentTypeRef}>
                    <button
                      onClick={() => setContentTypeOpen(!contentTypeOpen)}
                      className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                      data-testid="button-content-type"
                    >
                      {contentType}
                      <ChevronDown size={16} className={`transition-transform ${contentTypeOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {contentTypeOpen && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        {['All Content', 'Published', 'Scheduled', 'Draft'].map((type) => (
                          <button
                            key={type}
                            onClick={() => { setContentType(type); setContentTypeOpen(false); }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${contentType === type ? 'text-blue-600 bg-blue-50' : 'text-gray-700'
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 border-b border-gray-100">
                {weekDays.map((day, index) => {
                  const isToday = isSameDay(day, today);
                  return (
                    <div
                      key={index}
                      className={`p-3 text-center border-r border-gray-100 last:border-r-0 ${isToday ? 'bg-blue-50' : ''
                        }`}
                    >
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        {getDayName(day)}
                      </div>
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${isToday ? 'bg-blue-600 text-white' : 'text-gray-900'
                        }`}>
                        {getDayNumber(day)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-7 min-h-[500px]">
                {weekDays.map((day, index) => {
                  const dayPosts = getPostsForDay(day);
                  const isToday = isSameDay(day, today);
                  const isSelected = selectedDay && isSameDay(selectedDay, day);

                  return (
                    <div
                      key={index}
                      className={`border-r border-gray-100 last:border-r-0 p-2 relative cursor-pointer hover:bg-gray-50 transition-colors ${isToday ? 'bg-blue-50/50 hover:bg-blue-100/50' : ''
                        } ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                      onClick={() => handleDayClick(day)}
                      data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                    >
                      {isSelected && (
                        <div
                          ref={dayMenuRef}
                          className="absolute top-2 left-2 right-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-2 border-b border-gray-100 bg-gray-50">
                            <div className="text-xs font-medium text-gray-600">
                              Create post for {format(day, 'MMM d')}
                            </div>
                          </div>
                          <button
                            onClick={() => handleCreatePost('store-set', day)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            data-testid={`day-menu-store-set-${format(day, 'yyyy-MM-dd')}`}
                          >
                            <Store size={14} className="text-gray-500" />
                            Store Set
                          </button>
                          <button
                            onClick={() => handleCreatePost('select-locations', day)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            data-testid={`day-menu-select-locations-${format(day, 'yyyy-MM-dd')}`}
                          >
                            <MapPin size={14} className="text-gray-500" />
                            Select Location(s)
                          </button>
                          <button
                            onClick={() => handleCreatePost('all-locations', day)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            data-testid={`day-menu-all-locations-${format(day, 'yyyy-MM-dd')}`}
                          >
                            <Map size={14} className="text-gray-500" />
                            All Locations
                          </button>
                        </div>
                      )}

                      {dayPosts.map((post) => (
                        <div
                          key={post.id}
                          className="bg-white rounded-lg border border-gray-200 shadow-sm mb-2 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`calendar-post-${post.id}`}
                        >
                          <div className="relative">
                            <img
                              src={post.thumbnail}
                              alt={post.title}
                              className="w-full h-20 object-cover"
                            />
                            <div className="absolute top-1 left-1 flex items-center gap-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                              <Clock size={10} />
                              {post.time}
                            </div>
                            <div className="absolute top-1 right-1 flex gap-0.5">
                              {post.platforms.includes('google') && (
                                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                  <Globe size={10} className="text-blue-500" />
                                </div>
                              )}
                              {post.platforms.includes('apple') && (
                                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                  <Smartphone size={10} className="text-gray-600" />
                                </div>
                              )}
                            </div>
                          </div>
                          {post.likes > 0 && (
                            <div className="px-2 py-1.5 flex items-center gap-1 text-xs text-gray-500">
                              <ThumbsUp size={12} className="text-blue-500" />
                              {post.likes}
                            </div>
                          )}
                        </div>
                      ))}

                      {isToday && dayPosts.length === 0 && !isSelected && (
                        <div
                          className="bg-white rounded-lg border-2 border-dashed border-blue-200 p-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-100 flex items-center justify-center">
                            <Sparkles size={16} className="text-blue-500" />
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            This week, your followers are most active at this time.
                          </p>
                          <button
                            onClick={() => handleDayClick(day)}
                            className="flex items-center justify-center gap-1 w-full text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            Schedule
                            <ChevronDown size={12} />
                          </button>
                        </div>
                      )}

                      {!isSelected && dayPosts.length === 0 && !isToday && (
                        <div className="flex items-center justify-center h-full min-h-[100px]">
                          <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:border-blue-400 hover:text-blue-500 transition-colors">
                            <Plus size={16} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-100 p-4">
                <div className="flex gap-2">
                  {['all', 'published', 'scheduled', 'draft'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === status
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }`}
                      data-testid={`filter-${status}`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-4 hover:bg-gray-50 transition-colors" data-testid={`post-item-${post.id}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
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
                                {format(post.startDate, 'MMM d, yyyy')} - {format(post.endDate, 'MMM d, yyyy')}
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
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          data-testid={`button-edit-${post.id}`}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          data-testid={`button-delete-${post.id}`}
                        >
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
          )}
        </div>
      </div>
    </div>
  );
}
