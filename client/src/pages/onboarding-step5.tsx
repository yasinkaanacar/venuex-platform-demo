import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowRight,
  ArrowLeft,
  Zap,
  Check,
  Plus,
  Upload,
  Sparkles,
  TrendingUp,
  Database
} from 'lucide-react';
import { SiMeta, SiTiktok, SiGoogle } from 'react-icons/si';
import StepsSidebar from '@/components/onboarding/steps-sidebar';

interface OptimizationTask {
  id: string;
  title: string;
  points: number;
  completed: boolean;
  icon: JSX.Element;
  buttonText: string;
}

export default function OnboardingStep5Page() {
  const [, setLocation] = useLocation();
  const [integrationId] = useState(() => Math.floor(10000 + Math.random() * 90000));
  
  const [tasks, setTasks] = useState<OptimizationTask[]>([
    {
      id: 'meta',
      title: 'Connect Meta Ads Manager',
      points: 20,
      completed: false,
      icon: <SiMeta className="w-5 h-5 text-[#0668E1]" />,
      buttonText: 'Connect'
    },
    {
      id: 'tiktok',
      title: 'Connect TikTok Ads',
      points: 20,
      completed: false,
      icon: <SiTiktok className="w-5 h-5" />,
      buttonText: 'Connect'
    },
    {
      id: 'google',
      title: 'Connect Google Ads',
      points: 15,
      completed: false,
      icon: <SiGoogle className="w-5 h-5 text-[#4285F4]" />,
      buttonText: 'Connect'
    },
    {
      id: 'sales',
      title: 'Upload first sales data batch',
      points: 15,
      completed: false,
      icon: <Upload className="w-5 h-5 text-purple-600" />,
      buttonText: 'Upload'
    },
  ]);

  const baseScore = 30;
  const completedPoints = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);
  const totalScore = baseScore + completedPoints;
  const maxScore = baseScore + tasks.reduce((sum, t) => sum + t.points, 0);
  const scorePercentage = Math.round((totalScore / maxScore) * 100);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const getScoreColor = () => {
    if (scorePercentage >= 80) return { stroke: '#22c55e', bg: 'bg-green-100', text: 'text-green-600' };
    if (scorePercentage >= 50) return { stroke: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-600' };
    return { stroke: '#f97316', bg: 'bg-orange-100', text: 'text-orange-600' };
  };

  const colors = getScoreColor();
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex">
      {/* Steps Sidebar */}
      <StepsSidebar currentStep={5} />

      {/* Main Content Area - 70% */}
      <div className="w-[70%]">
        {/* Developer Navigation */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          <span className="text-gray-400 mr-2">Dev:</span>
          <button
            onClick={() => setLocation('/onboarding/step4')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
            data-testid="dev-back"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-blue-400 font-medium">Step 5</span>
          <button
            onClick={() => setLocation('/')}
            className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded transition-colors flex items-center gap-1"
            data-testid="dev-finish"
          >
            Dashboard <ArrowRight size={14} />
          </button>
      </div>

      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Celebration Banner */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <Sparkles size={16} />
            Setup Complete
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            You're ready! Workspace #{integrationId} is live.
          </h1>
          <p className="text-gray-500">
            Now, let's optimize your integration for maximum performance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Optimization Score */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-6 text-center">
              Platform Optimization Score
            </h2>

            {/* Radial Gauge */}
            <div className="relative flex items-center justify-center mb-8">
              <svg className="w-52 h-52 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="104"
                  cy="104"
                  r="90"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="104"
                  cy="104"
                  r="90"
                  stroke={colors.stroke}
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${colors.text}`}>
                  {scorePercentage}%
                </span>
                <span className="text-gray-400 text-sm mt-1">Optimized</span>
              </div>
            </div>

            {/* Recommendation */}
            <div className={`${colors.bg} rounded-lg p-4`}>
              <p className={`text-sm ${colors.text}`}>
                <strong>Recommendation:</strong> Connect your ad accounts to maximize your match rates and increase your score.
              </p>
            </div>
          </div>

          {/* Right - Action List */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Complete these actions to reach 100%
            </h2>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    task.completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      task.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {task.completed ? (
                        <Check size={20} className="text-green-600" />
                      ) : (
                        task.icon
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${task.completed ? 'text-green-700 line-through' : 'text-gray-900'}`}>
                        {task.title}
                      </p>
                      <p className={`text-sm ${task.completed ? 'text-green-600' : 'text-blue-600'}`}>
                        <Plus size={12} className="inline" /> {task.points} pts
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      task.completed
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    data-testid={`button-task-${task.id}`}
                  >
                    {task.completed ? 'Connected' : task.buttonText}
                  </button>
                </div>
              ))}
            </div>

            {/* Data Status Bar */}
            <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <Database size={20} className="text-gray-600" />
                <h3 className="font-medium text-gray-900">Data Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-500">Submitted</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-2xl font-bold text-gray-400">0</p>
                  <p className="text-sm text-gray-400">Matched</p>
                  <p className="text-xs text-gray-400 mt-1">Waiting for data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Go to Dashboard Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setLocation('/')}
            className="px-10 py-4 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mx-auto"
            data-testid="button-go-dashboard"
          >
            <TrendingUp size={20} />
            Go to Dashboard
          </button>
        </div>
        </main>
      </div>
    </div>
  );
}
