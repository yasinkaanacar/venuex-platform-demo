import { useState } from 'react';
import { Calendar, Image as ImageIcon, Globe, CheckCircle, Smartphone, Layout, ListFilter, Store, MapPin, Map, Check } from 'lucide-react';
import { Link, useSearch } from 'wouter';

const mockStoreSets = [
  { id: 1, name: 'Marmara Region', locationCount: 12 },
  { id: 2, name: 'Aegean Region', locationCount: 8 },
  { id: 3, name: 'Central Anatolia', locationCount: 6 },
  { id: 4, name: 'Premium Stores', locationCount: 5 },
];

const mockLocations = [
  { id: 1, name: 'Istanbul - Kadıköy', address: 'Caferağa Mah.' },
  { id: 2, name: 'Istanbul - Beşiktaş', address: 'Sinanpaşa Mah.' },
  { id: 3, name: 'Ankara - Çankaya', address: 'Kızılay' },
  { id: 4, name: 'Izmir - Alsancak', address: 'Kordon' },
  { id: 5, name: 'Bursa - Nilüfer', address: 'Özlüce Mah.' },
  { id: 6, name: 'Antalya - Muratpaşa', address: 'Lara' },
];

export default function CreatePost() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const scope = params.get('scope') || 'all-locations';

  const [selectedStoreSets, setSelectedStoreSets] = useState<number[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<number[]>([]);

  const [common, setCommon] = useState({
    locale: 'tr',
    title: '',
    description: '',
    media: null,
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const [google, setGoogle] = useState({
    enabled: true,
    type: 'UPDATE',
    actionType: 'LEARN_MORE',
    actionUrl: '',
    offer: { couponCode: '', redeemUrl: '', terms: '' }
  });

  const [apple, setApple] = useState({
    enabled: false,
    actionType: 'visit_website',
    actionUrl: ''
  });

  const handleGoogleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGoogle({ ...google, type: e.target.value });
  };

  const handleAppleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setApple({ ...apple, actionType: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Layout size={20} className="text-blue-600" /> 
                New Post Editor
              </h2>
              <Link href="/manage-posts">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                  <ListFilter size={18} />
                  Manage Posts
                </button>
              </Link>
            </div>

            {scope === 'store-set' && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Store size={18} className="text-blue-600" />
                    <span className="font-semibold text-blue-800">Select Store Set(s)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-blue-600 font-medium">
                      {selectedStoreSets.length} selected
                    </span>
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                      <span className="text-lg leading-none">+</span> Create Store Set
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {mockStoreSets.map((set) => (
                    <button
                      key={set.id}
                      onClick={() => {
                        if (selectedStoreSets.includes(set.id)) {
                          setSelectedStoreSets(selectedStoreSets.filter(id => id !== set.id));
                        } else {
                          setSelectedStoreSets([...selectedStoreSets, set.id]);
                        }
                      }}
                      className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2 ${
                        selectedStoreSets.includes(set.id)
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedStoreSets.includes(set.id)
                          ? 'bg-white border-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedStoreSets.includes(set.id) && <Check size={14} className="text-blue-600" />}
                      </div>
                      <div>
                        <div className="font-medium">{set.name}</div>
                        <div className={`text-xs ${selectedStoreSets.includes(set.id) ? 'text-blue-100' : 'text-gray-400'}`}>
                          {set.locationCount} locations
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {scope === 'select-locations' && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-purple-600" />
                    <span className="font-semibold text-purple-800">Select Locations</span>
                  </div>
                  <span className="text-xs text-purple-600 font-medium">
                    {selectedLocations.length} selected
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {mockLocations.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        if (selectedLocations.includes(loc.id)) {
                          setSelectedLocations(selectedLocations.filter(id => id !== loc.id));
                        } else {
                          setSelectedLocations([...selectedLocations, loc.id]);
                        }
                      }}
                      className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2 ${
                        selectedLocations.includes(loc.id)
                          ? 'bg-purple-600 border-purple-600 text-white'
                          : 'bg-white border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        selectedLocations.includes(loc.id)
                          ? 'bg-white border-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedLocations.includes(loc.id) && <Check size={14} className="text-purple-600" />}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{loc.name}</div>
                        <div className={`text-xs ${selectedLocations.includes(loc.id) ? 'text-purple-100' : 'text-gray-400'}`}>
                          {loc.address}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {scope === 'all-locations' && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2">
                  <Map size={18} className="text-green-600" />
                  <span className="font-semibold text-green-800">All Locations</span>
                  <span className="ml-auto px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                    31 locations
                  </span>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  This post will be published to all connected locations across all platforms.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <select 
                    className="w-full p-2 border rounded-lg bg-gray-50"
                    value={common.locale}
                    onChange={(e) => setCommon({...common, locale: e.target.value})}
                  >
                    <option value="tr">Turkish (TR)</option>
                    <option value="en">English (EN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Media</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 flex flex-col items-center justify-center gap-1 text-gray-500">
                    <ImageIcon size={20} />
                    <span className="text-sm font-medium">Upload Image</span>
                    <span className="text-xs text-gray-400">1:1 Aspect Ratio • Min 492x492px</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Title (Optional for Updates)</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Summer Sale Started!"
                  maxLength={58}
                  value={common.title}
                  onChange={(e) => setCommon({...common, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full p-2 border rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="What's new with your business?"
                  value={common.description}
                  onChange={(e) => setCommon({...common, description: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded-lg"
                    value={common.startDate}
                    onChange={(e) => setCommon({...common, startDate: e.target.value})}
                  />
                  <p className="text-xs text-gray-400 mt-1">*Apple: min. 3 days ahead</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input 
                    type="time" 
                    className="w-full p-2 border rounded-lg"
                    value={common.startTime}
                    onChange={(e) => setCommon({...common, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded-lg"
                    value={common.endDate}
                    onChange={(e) => setCommon({...common, endDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input 
                    type="time" 
                    className="w-full p-2 border rounded-lg"
                    value={common.endTime}
                    onChange={(e) => setCommon({...common, endTime: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-xl border transition-all ${google.enabled ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2 text-gray-700">
                <Globe size={18} /> Google Business Profile
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={google.enabled} onChange={() => setGoogle({...google, enabled: !google.enabled})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {google.enabled && (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Post Type</label>
                    <select className="w-full p-2 border rounded bg-white" value={google.type} onChange={handleGoogleTypeChange}>
                      <option value="UPDATE">Standard Update</option>
                      <option value="EVENT">Event</option>
                      <option value="OFFER">Offer (Coupon)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Button (CTA)</label>
                    <select className="w-full p-2 border rounded bg-white" value={google.actionType} onChange={(e) => setGoogle({...google, actionType: e.target.value})}>
                      <option value="LEARN_MORE">Learn More</option>
                      <option value="ORDER_ONLINE">Order Online</option>
                      <option value="BOOK">Book</option>
                      <option value="CALL">Call Now</option>
                    </select>
                  </div>
                </div>

                {google.type === 'OFFER' && (
                  <div className="bg-blue-50 p-3 rounded-lg space-y-3">
                    <input 
                      type="text" placeholder="Coupon Code (e.g. SUMMER20)" 
                      className="w-full p-2 border rounded text-sm"
                      value={google.offer.couponCode}
                      onChange={(e) => setGoogle({...google, offer: {...google.offer, couponCode: e.target.value}})}
                    />
                    <input 
                      type="text" placeholder="Redeem URL" 
                      className="w-full p-2 border rounded text-sm"
                      value={google.offer.redeemUrl}
                      onChange={(e) => setGoogle({...google, offer: {...google.offer, redeemUrl: e.target.value}})}
                    />
                    <textarea 
                      placeholder="Terms & Conditions" 
                      className="w-full p-2 border rounded text-sm h-16"
                      value={google.offer.terms}
                      onChange={(e) => setGoogle({...google, offer: {...google.offer, terms: e.target.value}})}
                    />
                  </div>
                )}

                {google.actionType !== 'CALL' && (
                  <input 
                    type="text" placeholder="https://yourlink.com" 
                    className="w-full p-2 border rounded text-sm"
                    value={google.actionUrl}
                    onChange={(e) => setGoogle({...google, actionUrl: e.target.value})}
                  />
                )}
              </div>
            )}
          </div>

          <div className={`p-6 rounded-xl border transition-all ${apple.enabled ? 'bg-white border-gray-800 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold flex items-center gap-2 text-gray-700">
                <Smartphone size={18} /> Apple Business Connect
              </h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={apple.enabled} onChange={() => setApple({...apple, enabled: !apple.enabled})} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
              </label>
            </div>

            {apple.enabled && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Call To Action</label>
                  <select className="w-full p-2 border rounded bg-white" value={apple.actionType} onChange={handleAppleActionChange}>
                    <option value="none">None (Showcase Only)</option>
                    <option value="visit_website">Visit Website</option>
                    <option value="call">Call</option>
                    <option value="directions">Get Directions</option>
                    <option value="book">Book</option>
                  </select>
                </div>

                {apple.actionType === 'visit_website' ? (
                  <input 
                    type="text" placeholder="https://apple-link.com" 
                    className="w-full p-2 border rounded text-sm"
                    value={apple.actionUrl}
                    onChange={(e) => setApple({...apple, actionUrl: e.target.value})}
                  />
                ) : (
                  <p className="text-xs text-gray-500 italic">
                    *Selected action will use your location data automatically. No URL needed.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
