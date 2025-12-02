import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowRight,
  ArrowLeft,
  Zap,
  TrendingUp,
  Target,
  BarChart3,
  Store,
  Quote
} from 'lucide-react';
import { SiGoogle, SiMeta } from 'react-icons/si';

export default function OnboardingStep3Page() {
  const [, setLocation] = useLocation();
  const [integrationId] = useState(() => Math.floor(10000 + Math.random() * 90000));

  const handleSetupAttribution = () => {
    setLocation('/onboarding/step4');
  };

  const handleSkip = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Developer Navigation */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
        <span className="text-gray-400 mr-2">Dev:</span>
        <button
          onClick={() => setLocation('/onboarding/step2')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
          data-testid="dev-back"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-blue-400 font-medium">Step 3</span>
        <button
          onClick={() => setLocation('/onboarding/step4')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
          data-testid="dev-next"
        >
          Next <ArrowRight size={14} />
        </button>
      </div>

      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">VenueX</span>
            </div>
            <div className="text-sm text-gray-400">
              Integration ID: <span className="font-mono text-gray-600">#{integrationId}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="min-h-[calc(100vh-73px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-73px)]">
          
          {/* Left Side - Social Proof */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex flex-col justify-center text-white">
            <div className="max-w-lg">
              {/* Quote */}
              <div className="mb-10">
                <Quote size={40} className="text-blue-300 mb-4 opacity-50" />
                <p className="text-xl font-medium italic text-blue-100 mb-4">
                  "VenueX helped us visualize the invisible revenue."
                </p>
                <p className="text-blue-200 text-sm">— CMO, Leading Retail Chain</p>
              </div>

              {/* Stats Grid */}
              <div className="space-y-6 mb-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                      <Store size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">11,000+</p>
                      <p className="text-blue-200 text-sm">Locations measured by A101</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/30 flex items-center justify-center">
                      <TrendingUp size={24} className="text-green-300" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-300">+25%</p>
                      <p className="text-blue-200 text-sm">ROAS increase for Koçtaş</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Graph Visualization */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-blue-200">Offline Conversion Lift</span>
                  <span className="text-xs px-2 py-1 bg-green-500/30 text-green-300 rounded">+32% avg</span>
                </div>
                <div className="flex items-end gap-1 h-20">
                  {[35, 42, 38, 55, 48, 62, 58, 75, 70, 88, 82, 95].map((height, i) => (
                    <div 
                      key={i}
                      className="flex-1 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t opacity-80 transition-all hover:opacity-100"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-blue-300">
                  <span>Jan</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - The Ask */}
          <div className="p-12 flex flex-col justify-center bg-gray-50">
            <div className="max-w-lg">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
                <Target size={14} />
                Unlock Attribution
              </div>

              {/* Headline */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Unlock your true ROI.
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">
                Measure the offline impact of your online ads.
              </p>

              <p className="text-gray-500 mb-8">
                Don't fly blind. Track how your digital ad spend drives real-world store traffic and revenue. Connect your ad platforms to see which digital clicks turn into physical store visits and sales.
              </p>

              {/* Platform Icons */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                  <SiGoogle className="w-5 h-5 text-[#4285F4]" />
                  <span className="text-sm text-gray-600">Google Ads</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                  <SiMeta className="w-5 h-5 text-[#0668E1]" />
                  <span className="text-sm text-gray-600">Meta Ads</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-600">+3 more</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleSetupAttribution}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  data-testid="button-setup-attribution"
                >
                  Setup Offline Attribution
                  <ArrowRight size={20} />
                </button>

                <button
                  onClick={handleSkip}
                  className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                  data-testid="button-skip"
                >
                  Skip for now, go to Dashboard
                </button>
              </div>

              {/* Trust Badge */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold text-xs">A</div>
                    <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-green-600 font-bold text-xs">K</div>
                    <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-purple-600 font-bold text-xs">M</div>
                  </div>
                  <span>Trusted by 50+ enterprise brands in Turkey</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
