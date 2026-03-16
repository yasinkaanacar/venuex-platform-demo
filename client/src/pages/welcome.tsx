import { useLocation } from 'wouter';
import { PATHS } from '@/routes/paths';
import { Zap, Play, Link2, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-bold text-gray-900">VenueX</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to VenueX!</h1>
        <p className="text-gray-600 mb-10">Choose how you'd like to get started</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Explore Demo Card */}
          <a
            href="https://demo.venuex.io"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all text-left"
            data-testid="card-explore-demo"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Explore Demo</h3>
            <p className="text-gray-600 text-sm mb-4">
              See VenueX in action with sample data and explore all features
            </p>
            <div className="flex items-center gap-2 text-purple-600 font-medium text-sm group-hover:gap-3 transition-all">
              <span>View Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </a>

          {/* Start Connecting Card */}
          <button
            onClick={() => setLocation(PATHS.ONBOARDING)}
            className="group p-6 bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all text-left"
            data-testid="card-start-connecting"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Link2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Start Connecting</h3>
            <p className="text-gray-600 text-sm mb-4">
              Connect your platforms and set up your account step by step
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
              <span>Begin Setup</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
