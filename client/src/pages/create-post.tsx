import { useState } from 'react';
import { Calendar, Image as ImageIcon, Globe, CheckCircle, Smartphone, Layout, ListFilter } from 'lucide-react';
import { Link } from 'wouter';

export default function CreatePost() {
  const [common, setCommon] = useState({
    locale: 'tr',
    title: '',
    description: '',
    media: null,
    startDate: '',
    endDate: '',
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full p-2 border rounded-lg"
                    value={common.startDate}
                    onChange={(e) => setCommon({...common, startDate: e.target.value})}
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
                  <p className="text-xs text-gray-400 mt-1">*Apple requires 3+ days duration</p>
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

        <div className="lg:col-span-1">
           <div className="sticky top-6">
              <h2 className="text-sm font-bold text-gray-400 uppercase mb-3 tracking-wider">Live Preview</h2>

              {google.enabled && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 border border-gray-200">
                   <div className="h-40 bg-gray-200 flex items-center justify-center text-gray-400">Image Preview</div>
                   <div className="p-4">
                      {google.type !== 'UPDATE' && <h4 className="font-bold text-lg mb-1">{common.title || 'Event Title'}</h4>}
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{common.description || 'Your description will appear here...'}</p>

                      {google.type === 'OFFER' && (
                        <div className="bg-green-50 text-green-700 text-xs p-2 rounded mb-3 border border-green-100">
                          <strong>Coupon:</strong> {google.offer.couponCode || 'CODE'}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-gray-400">Posted on Google</span>
                        <button className="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded uppercase">
                          {google.actionType.replace('_', ' ')}
                        </button>
                      </div>
                   </div>
                </div>
              )}

              {apple.enabled && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 w-full max-w-[300px] mx-auto">
                   <div className="relative h-48 bg-gray-800 flex items-center justify-center text-gray-500">
                      <span className="text-white z-10 font-medium">Showcase Image</span>
                      <div className="absolute inset-0 bg-black opacity-20"></div>
                   </div>
                   <div className="p-4">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-1">From the Business</p>
                      <h4 className="font-bold text-gray-900 mb-2">{common.title || 'Header Text'}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{common.description}</p>

                      {apple.actionType !== 'none' && (
                        <button className="w-full mt-4 py-2 bg-gray-100 text-blue-600 font-semibold text-sm rounded-lg hover:bg-gray-200 transition">
                           {apple.actionType === 'visit_website' ? 'Visit Website' : apple.actionType}
                        </button>
                      )}
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
