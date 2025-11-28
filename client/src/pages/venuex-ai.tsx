import { Brain, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'wouter';

export default function VenueXAI() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">VenueX AI</h1>
        <p className="text-gray-500 mb-6">
          AI-powered insights and automation to optimize your retail presence across all platforms.
        </p>
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-center gap-2 text-purple-600 mb-2">
            <Sparkles size={16} />
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          <div className="text-lg font-semibold text-gray-900">Advanced AI features in development</div>
        </div>
        <div className="flex gap-3 justify-center">
          <Link href="/ai-recommendations">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
              Try Enhance <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
              Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
